var express = require('express');
var multer  = require('multer');
var router = express.Router();
var s3 = require('../helpers/s3');
var utils = require('../helpers/utils');
var db = require('../helpers/db');
var imagePost = require('../helpers/image-post');


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

    upload(req, res, function (err) {
        var imageFile = req.file;

        if (imageFile) {
            var body = req.body;
            var uniqueFileName = utils.generateUniqueName(imageFile.originalname);
            
            var params = {
                Key: uniqueFileName,
                Body: imageFile.buffer
            };

            var imagePostObj = imagePost.generate({
                name: uniqueFileName,
                title: body.title
            });

            s3.getBucket().putObject(params, function (error, response) {
                
                if (error) {
                    res.json({ message: defaultErrorMessage });
                } else {
                    db.get().collection('imagePosts').insert(imagePostObj, function (err, confirmation) {
                        if (err) { res.json({ message: defaultErrorMessage }); }

                        res.json({ message: 'Successfully uploaded image! :D' });
                    });
                }

            });
        } else {
            res.json({ message: (err && err.message) || defaultErrorMessage });
        }
    });
	
});

router.get('/api/remove/:uniqueName', function (req, res) {

    db.get().collection('imagePosts').deleteOne({ name: req.params.uniqueName }, function (err, results) {

        if (err) {
            res.json({ message: defaultErrorMessage });
        } else {
            s3.getBucket().deleteObject({ Key: req.params.uniqueName }, function (err, data) {
                if (err) { res.json({ message: defaultErrorMessage }); }

                res.json({ message: 'Successfully deleted image! :D' });
            });
        }

    }); 
    
});

module.exports = router;
