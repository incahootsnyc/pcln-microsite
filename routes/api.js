var express = require('express');
var multer  = require('multer');
var router = express.Router();
var upload = multer();
var AWS = require('aws-sdk');
var utils = require('../helpers/utils');

AWS.config.update({
	region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

var s3bucket = new AWS.S3({
	params: {
		Bucket: 'pcln-images-bucket'
	}
});

/* GET home page. */
router.post('/api/upload', upload.single('image'), function (req, res) {
	var imageFile = req.file;
	var body = req.body;
	var uniqueFileName = utils.generateUniqueName(imageFile.originalname);
	
	var params = {
        Key: uniqueFileName,
        Body: imageFile.buffer
    };

    s3bucket.putObject(params, function (error, response) {
    	var message;
        if (error) {
        	message = 'Error uploading data';
        } else {
        	message = 'Successfully uploaded data';
        }

        res.json({
        	message: message
		});
    });

	
});

module.exports = router;
