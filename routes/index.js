var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var s3 = require('../helpers/s3');

/* GET home page. */
router.get('/', function(req, res, next) {

	db.get().collection('imagePosts', function (err, collection) {

		collection.find().toArray(function (err, imageList) {
	
			var imageUrls = [];
			var s3bucket = s3.getBucket();

			imageList.forEach(function (imageObj) {
				if (imageObj.name) {
					var params = { Key: imageObj.name };
					imageUrls.push(s3bucket.getSignedUrl('getObject', params));
				}
			});
		
			res.render('index', { 
		  	title: 'PCLN Photo Contest', 
		  	images: imageUrls,
		  	isHome: true,
		  	isTerms: false
		  });

		});
	})

  

});

module.exports = router;
