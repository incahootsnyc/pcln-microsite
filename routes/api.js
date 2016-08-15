var express = require('express');
var multer  = require('multer');
var router = express.Router();
var upload = multer();
var s3 = require('../helpers/s3');
var utils = require('../helpers/utils');
var db = require('../helpers/db');
var imagePost = require('../helpers/image-post');


/* GET home page. */
router.post('/api/upload', upload.single('image'), function (req, res) {
	var imageFile = req.file;
	var body = req.body;
	var uniqueFileName = utils.generateUniqueName(imageFile.originalname);
	
	var params = {
        Key: uniqueFileName,
        Body: imageFile.buffer
    };

    var imagePost = imagePost.generate({
    	name: uniqueFileName,
    	title: body.title
    });

    s3.getBucket().putObject(params, function (error, response) {
    	var message;
        if (error) {
        	message = 'Error uploading data';
        } else {
        	message = 'Successfully uploaded data';
        	db.get().collection('imagePosts').insert(imagePost, function(err, confirmation) {
        		res.json({
		        	message: message
				});
        	});
        }
    });

	
});

module.exports = router;
