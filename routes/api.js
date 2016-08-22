var express = require('express');
var multer  = require('multer');
var router = express.Router();
var s3 = require('../helpers/s3');
var utils = require('../helpers/utils');
var db = require('../helpers/db');
var imagePost = require('../helpers/image-post');
var imageFormatter = require('../helpers/image-formatter');
var async = require('async');
var sizeOf = require('image-size');
var config = require('../config');

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
router.post('/api/upload', function (req, res) {
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
            var imagePostObj = imagePost.generateForDB({
                name: uniqueFileName,
                location: body.location,
                datetime: body.datetime
            });

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
                    height: "140!",
                    customArgs: [ 
                         "-gravity", "center"
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
                    res.json({ message: defaultErrorMessage });
                } else {

                    db.get().collection('imagePosts').insert(imagePostObj, function (error, confirmation) {
                        if (error) { res.json({ message: defaultErrorMessage }); }

                        res.json({ message: 'Successfully uploaded image! :D' });
                    });
                }
            }

        } else {
            res.json({ message: (error && error.message) || defaultErrorMessage });
        }
    });
	
});

router.get('/api/remove/:uniqueName', function (req, res) {
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

router.get('/api/like/:uniqueName', function (req, res) {
    var defaultErrorMessage = 'Error liking image! :O';
    var addedLike = { 'likes': { user: utils.generateUniqueName('test') } };

    db.get().collection('imagePosts').update({ name: req.params.uniqueName }, { '$push': addedLike } , function (error, item) {

        if (error) {
            res.json({ message: defaultErrorMessage });
        } else {
            res.json({ liked: true });
        }

    }); 
    
});

module.exports = router;
