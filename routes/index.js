var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var _ = require('lodash');
var config = require('../config');
var imagePostHelper = require('../helpers/image-post');

/* GET home page. */
router.get('/', function (req, res, next) {

	var sortType = req.query.sort ? req.query.sort  : 'newest';

	db.get().collection('imagePosts', function (err, collection) {

		var options = {  'limit': config.itemsPerPage };

		if (sortType == 'popular') {
			options['sort'] = [[ 'likesCount', 'desc' ]];
		} else {
			options['sort'] = [[ 'datetime', 'desc' ]];
		}

		collection.find({}, options).toArray(function (err, imageList) {
	
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
			  	sort: sortType
			});

		});
	})

  

});

module.exports = router;
