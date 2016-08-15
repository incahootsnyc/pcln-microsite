var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var s3 = require('../helpers/s3');

/* GET home page. */
router.get('/', function(req, res, next) {

	db.get().collection('imagePosts', function (err, collection) {

		collection.find().toArray(function (err, imageList) {
	
			var imageUrls = [];

			imageList.forEach(function (imageObj) {
				var params = { Key: imageObj.name };
				imageUrls.push(s3.getBucket().getSignedUrl('getObject', params));
			});
		
			res.render('index', { 
		  	title: 'PCLN Photo Contest', 
		  	images: imageUrls 
		  });

		});
	})

  

});

module.exports = router;
