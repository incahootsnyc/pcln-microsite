var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET terms page. */
router.get('/terms', function (req, res, next) {

	res.render('index', { 
		title: 'PCLN Photo Contest', 
		isTerms: true,
		isHome: false,
		categories: config.categories
	});

});

module.exports = router;
