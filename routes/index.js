var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var _ = require('lodash');
var imagePost = require('../helpers/image-post');

/* GET home page. */
router.get('/', function (req, res, next) {

	var sortType = req.query.sort ? req.query.sort  : 'newest';

	db.get().collection('imagePosts', function (err, collection) {

		collection.find().toArray(function (err, imageList) {
	
			var imagePosts = [];

			imageList.forEach(function (imageObj) {
				if (imageObj.name) {
					imagePosts.push(imagePost.mapForClient(imageObj));
				}
			});

			if (sortType == 'popular') {
				imagePosts = _.sortBy(imagePosts, function (post) {
					return post.likes.length;
				}).reverse();
			} else {
				imagePosts = _.sortBy(imagePosts, function (post) {
					return post.datetime;
				}).reverse();
			}
		
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
