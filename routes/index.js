var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var _ = require('lodash');
var utils = require('../helpers/utils');
var imagePostHelper = require('../helpers/image-post');
var config = require('../config');



router.get('/', function (req, res) {
    res.render('index', { 
    	title: 'PCLN Photo Contest',
	  	initData: {},
	  	isHome: false,
	  	isTerms: false,
	  	isHomeSignin: true,
	  	isHomeSignup: false,
	  	categories: config.categories
    });
});

/* GET home page. */
router.get('/home', function (req, res, next) {

	var searchConfig = utils.getSortAndFilterConfig(req);

	db.get().collection('imagePosts', function (err, collection) {

		collection.find(searchConfig.query, searchConfig.sort).toArray(function (err, imageList) {
	
			var imagePosts = [];

			imageList.forEach(function (imageObj, index) {
				if (imageObj.name) {
					imagePosts.push(imagePostHelper.mapForClient(imageObj, index));
				}
			});
		
			res.render('index', { 
			  	title: 'PCLN Photo Contest',
			  	initData: {
			  		images: imagePosts,
			  		pageSize: config.itemsPerPage
			  	},
			  	isHome: true,
			  	isTerms: false,
			  	isHomeSignin: false,
			  	isHomeSignup: false,
			  	sort: searchConfig.sortType,
			  	categories: config.categories
			});

		});
	})

});

module.exports = router;
