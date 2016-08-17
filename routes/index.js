var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var s3 = require('../helpers/s3');

/* GET home page. */
router.get('/', function(req, res, next) {

	db.get().collection('imagePosts', function (err, collection) {

		collection.find().toArray(function (err, imageList) {
	
			var imagePosts = [];
			var s3bucket = s3.getBucket();

			imageList.forEach(function (imageObj) {
				if (imageObj.name) {
					var params = { Key: imageObj.name };
					imagePosts.push({
						url: imageObj.thumbNailPath || s3bucket.getSignedUrl('getObject', params),
						uniqueName: imageObj.name
					});
				}
			});
		
			res.render('index', { 
			  	title: 'PCLN Photo Contest', 
			  	images: imagePosts,
			  	isHome: true,
			  	isTerms: false
			});

		});
	})

  

});

module.exports = router;
