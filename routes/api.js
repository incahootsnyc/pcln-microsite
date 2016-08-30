var express = require('express');
var multer  = require('multer');
var router = express.Router();
var s3 = require('../helpers/s3');
var utils = require('../helpers/utils');
var db = require('../helpers/db');
var imagePostHelper = require('../helpers/image-post');
var imageFormatter = require('../helpers/image-formatter');
var async = require('async');
var sizeOf = require('image-size');
var config = require('../config');
var passport = require('passport');
var _ = require('lodash');
var mailer = require('../helpers/mailer');

var upload = multer({
    limits: { fileSize: 5000000 },
    fileFilter: function (req, file, cb) {
        var mimeTypes = ['image/png', 'image/jpeg'];

        if (mimeTypes.indexOf(file.mimetype) < 0) {
            return cb(new Error('Unsupported file type! :O'), false);
        }

        cb(null, true);
    }
}).single('image');

/* POST image. */
router.post('/api/upload', utils.isLoggedIn, function (req, res) {
    var defaultErrorMessage = 'Error uploading image! :O';

    upload(req, res, function (error) {
        var imageFile = req.file;

        if (imageFile) {

            var body = req.body;
            var uniqueFileName = utils.generateUniqueName(imageFile.originalname);
            var thumbPath = '/uploads/thumbnails/thumb-' + uniqueFileName;
            var detailPath = '/uploads/details/detail-' + uniqueFileName; 
            var dimensions = sizeOf(imageFile.buffer);
            var parallelRequests = [putImageInBucket, resizeImageForThumbnail];
            var params = {
                Key: uniqueFileName,
                Body: imageFile.buffer
            };
            var imagePostObj = imagePostHelper.generateForDB(uniqueFileName, body, req.user);

            if (dimensions.width > 1000 || dimensions.height > 1000) {
                parallelRequests.push(resizeImageForDetails);
            }

            async.parallel(parallelRequests, saveImagePostAndRespond);

            function putImageInBucket (callback){ 
                s3.getBucket().putObject(params, function (error, response) {
            
                    if (error) {
                        callback(error, null);
                    } else {
                        callback();
                    }

                });
            }

            function resizeImageForThumbnail (callback) {
                var imageConfig = {
                    srcData: imageFile.buffer,
                    strip: false,
                    width: 140,
                    height: "140^",
                    customArgs: [ 
                         "-gravity", "center",
                         "-extent", "140x140"
                    ]
                };

                imageFormatter.resize(imageConfig, imagePostObj, config.rootDirectory + '/public' + thumbPath, thumbPath, 'thumbNailPath', callback);
            }

            function resizeImageForDetails (callback) {
                var imageConfig = {
                    srcData: imageFile.buffer,
                    width: 1000
                };

                imageFormatter.resize(imageConfig, imagePostObj, config.rootDirectory + '/public' + detailPath, detailPath, 'detailPath', callback);            
            }

            function saveImagePostAndRespond (error, results) {
               if (error) {
                    res.json({ error: defaultErrorMessage });
                } else {

                    db.get().collection('imagePosts').insert(imagePostObj, function (error, confirmation) {
                        if (error) { res.json({ error: defaultErrorMessage }); }

                        res.json({ message: 'Successfully uploaded image! :D' });
                    });
                }
            }

        } else {
            res.json({ error: (error && error.message) || defaultErrorMessage });
        }
    });
	
});

router.post('/api/update', utils.isLoggedIn, function (req, res) {
    var defaultErrorMessage = 'Error updating image! :O';
    var body = req.body;

    db.get().collection('imagePosts').findOne({ name: body.uniquename }, function (error, item) {
        if (error || !item) {
            res.json({ message: defaultErrorMessage });
        } else {
            if (_.isArray(body['category[]'])) {
                item.tags = body['category[]'];
            } else {
                item.tags = [ body['category[]'] ];
            }
            
            item.location = body.location;

            db.get().collection('imagePosts').save(item, function (error, result) {
                if (error) {
                    res.json({ message: defaultErrorMessage });
                } else {
                    res.json({ message: 'Successfully updated image! :D' });
                }
            });
        }

    }); 
    
});

router.get('/api/remove/:uniqueName', utils.isLoggedIn, function (req, res) {
    var defaultErrorMessage = 'Error removing image! :O';

    db.get().collection('imagePosts').deleteOne({ name: req.params.uniqueName }, function (error, results) {

        if (error) {
            res.json({ message: defaultErrorMessage });
        } else {
            s3.getBucket().deleteObject({ Key: req.params.uniqueName }, function (error, data) {
                if (error) { res.json({ message: defaultErrorMessage }); }

                res.json({ message: 'Successfully deleted image! :D' });
            });
        }

    }); 
    
});

router.get('/api/like/:uniqueName', utils.isLoggedIn, function (req, res) {
    var defaultErrorMessage = 'Error liking image! :O';
    var addedLike = { 'likes': { user: utils.generateUniqueName('test') } };

    db.get().collection('imagePosts').findOne({ name: req.params.uniqueName }, function (error, item) {
        if (error || !item) {
            res.json({ message: defaultErrorMessage });
        } else {

            var likeIndex = item.likes.indexOf(req.user._id.toString());
            var liked = false;
            if (likeIndex > -1) {
                item.likes.splice(likeIndex, 1);
                item.likesCount = item.likes.length;
            } else {
                item.likes.push(req.user._id.toString());
                item.likesCount = item.likes.length;
                liked = true;
            }

            db.get().collection('imagePosts').save(item, function (error, result) {
                if (error) {
                    res.json({ message: defaultErrorMessage });
                } else {
                    res.json({ likes: item.likes, hasLiked: liked });
                }
            });
        }

    }); 
    
});

router.get('/api/fetchPosts/:pageNum', utils.isLoggedIn, function (req, res) {

    var searchConfig = utils.getSortAndFilterConfig(req);
    var uidQuery = req.query.uid ? {uid: req.user._id } : {};
    async.parallel([getMoreImages, getCollectionCount], processImagePostDataAndRespond);

    function getMoreImages (callback) {
        db.get().collection('imagePosts', function (err, collection) {

            _.assign(searchConfig.query, uidQuery);

            collection.find(searchConfig.query, searchConfig.sort).toArray(function (err, imageList) {
        
                var imagePosts = [];

                imageList.forEach(function (imageObj, index) {
                    if (imageObj.name) {
                        imagePosts.push(imagePostHelper.mapForClient(imageObj, index+searchConfig.sort.skip));
                    }
                });

                callback(null, imagePosts);

            });
        });
    }

    function getCollectionCount (callback) {
        db.get().collection('imagePosts').count(uidQuery, function (error, numOfDocs) {
            callback(null, numOfDocs);
        });
    }

    function processImagePostDataAndRespond (error, aggregatedResponse) {
        if (error) {
            res.json({ message: error });
        } else {
            res.json({ 
                images: aggregatedResponse[0],
                totalPostCount: aggregatedResponse[1]
            });
        }
       
    }
    
});

router.post('/api/pwreset', function (req, res, next) {
  var username = req.body.username;

  db.get().collection('users').findOne({ username: username }, function (error, user) {
        if (error || !user) {
            res.redirect('/?e=05');
        } else {

            var saltHashPassword = utils.saltHashPassword(config.resetPassword, utils.generateRandomString(16));
            user.passwordResetUrl = utils.generateRandomString(16);
            user.salt = saltHashPassword.salt;
            user.hash = saltHashPassword.passwordHash;

            db.get().collection('users').save(user, function (error, result) {
                if (error) {
                    res.redirect('/?e=06');
                } else {
                    mailer.sendPasswordResetEmail(req, user);
                    res.redirect('/?e=07');
                }
            });
        }
    });
});

router.post('/api/pwreset/complete', function (req, res, next) {

  db.get().collection('users').findOne({ username: req.body.username }, function (error, user) {
        if (error || !user) {
            res.redirect('/password-reset/fail?e=nouser');
        } else {

            var saltHashPassword = utils.saltHashPassword(req.body.password, utils.generateRandomString(16));
            user.salt = saltHashPassword.salt;
            user.hash = saltHashPassword.passwordHash;
            user.passwordResetUrl = null;

            db.get().collection('users').save(user, function (error, result) {
                if (error) {
                    res.redirect('/password-reset/fail?e=savefail');
                } else {
                    res.redirect('/');
                }
            });
        }
    });
});

router.post('/api/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) { return res.redirect('/?e=' + info.message); }
    req.logIn(user, function (err) {
      if (err) { return res.redirect('/?e=' + info.message); }
      return res.redirect('/home');
    });
  })(req, res, next);
});

router.post('/api/signup', function (req, res, next) {
  passport.authenticate('signup', function (err, user, info) {
    if (err || !user) { return res.redirect('/?e=' + info.message); }
    return res.redirect('/?e=' + info.message);
  })(req, res, next);
});

// router.post('/api/login', passport.authenticate('local', {
//     successRedirect: '/home',
//     failureRedirect: '/'
// }));

// router.post('/api/signup', passport.authenticate('signup', {
//     successRedirect: '/home',
//     failureRedirect: '/'
// }));

router.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

module.exports = router;
