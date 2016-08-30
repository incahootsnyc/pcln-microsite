var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var _ = require('lodash');
var utils = require('../helpers/utils');
var imagePostHelper = require('../helpers/image-post');
var config = require('../config');

router.get('/', function (req, res) {
	var genericLayoutSettings = utils.getGenericLayoutProperties();

	// ALERT ALERT ALERT
	// ALERT ALERT ALERT

	// DO NOT COMMENT IN THIS LINE UNLESS YOU ARE 
	// PLANNING ON DESTROYING THE ENTIRE COLLECTIONS
	// db.get().collection('imagePosts').remove();
	// db.get().collection('pendingUsers').remove();
	// db.get().collection('users').remove();

	// ALERT ALERT ALERT
	// ALERT ALERT ALERT

	if (req.user) {
        res.redirect('/home');
    } else {
        res.render('index', _.assign(genericLayoutSettings, { 
		  	initData: {},
		  	isHomeSignin: true,
			userFirstName: ''
	    }));
    }
  
});

/* GET home page. */
router.get('/home', utils.isLoggedIn, function (req, res, next) {
	var genericLayoutSettings = utils.getGenericLayoutProperties(req.query.user);
	var searchConfig = utils.getSortAndFilterConfig(req);

	db.get().collection('imagePosts', function (err, collection) {

		collection.find(searchConfig.query, searchConfig.sort).toArray(function (err, imageList) {
	
			var imagePosts = [];

			imageList.forEach(function (imageObj, index) {
				if (imageObj.name) {
					imagePosts.push(imagePostHelper.mapForClient(imageObj, index, req.user.isAdmin));
				}
			});
		
			res.render('index', _.assign(genericLayoutSettings, { 
			  	initData: {
			  		images: imagePosts,
			  		uid: req.user._id.toString(),
			  		pageSize: config.itemsPerPage
			  	},
			  	isHome: true,
			  	sort: searchConfig.sortType,
			  	userFirstName: req.user.firstname || ''
			}));

		});
	})

});

module.exports = router;
