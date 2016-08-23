var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var _ = require('lodash');
var utils = require('../helpers/utils');
var imagePostHelper = require('../helpers/image-post');

/* GET home page. */
router.get('/', function (req, res, next) {

	var searchConfig = utils.getSortAndFilterConfig(req);

	db.get().collection('imagePosts', function (err, collection) {

		collection.find(searchConfig.query, searchConfig.sort).toArray(function (err, imageList) {
	
			var imagePosts = [];

			imageList.forEach(function (imageObj) {
				if (imageObj.name) {
					imagePosts.push(imagePostHelper.mapForClient(imageObj));
				}
			});
		
			res.render('index', { 
			  	title: 'PCLN Photo Contest', 
			  	images: imagePosts,
			  	isHome: true,
			  	isTerms: false,
			  	sort: searchConfig.sortType
			});

		});
	})

  

});

module.exports = router;
