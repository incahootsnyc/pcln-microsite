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
                    res.json({ message: 'Error uploading image! :O' });
                } else {
                    db.get().collection('imagePosts').insert(imagePostObj, function (err, confirmation) {
                        if (err) { res.json({ message: 'Uh Oh, something went wrong! :O' }); }
                        res.json({ message: 'Successfully uploaded data! :D' });
                    });
                }

            });
        } else {
            res.json({ message: err.message });
        }
    });
	
});

module.exports = router;
