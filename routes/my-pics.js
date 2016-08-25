var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var _ = require('lodash');
var utils = require('../helpers/utils');
var imagePostHelper = require('../helpers/image-post');
var config = require('../config');

/* GET home page. */
router.get('/mypics', utils.isLoggedIn, function (req, res, next) {
	
	var genericLayoutSettings = utils.getGenericLayoutProperties();
	var searchConfig = utils.getSortAndFilterConfig(req);

	db.get().collection('imagePosts', function (err, collection) {

		collection.find(searchConfig.query, searchConfig.sort).toArray(function (err, imageList) {
	
			var imagePosts = [];

			imageList.forEach(function (imageObj, index) {
				if (imageObj.name) {
					imagePosts.push(imagePostHelper.mapForClient(imageObj, index, req.user));
				}
			});
		
			res.render('index', _.assign(genericLayoutSettings, { 
			  	title: 'PCLN Photo Contest',
			  	initData: {
			  		images: imagePosts,
			  		id: req.user._id.toString(),
			  		pageSize: config.itemsPerPage
			  	},
			  	isHome: true,
			  	sort: searchConfig.sortType,
			  	categories: config.categories
			}));

		});
	})

});

module.exports = router;
