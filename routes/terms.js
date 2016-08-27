var express = require('express');
var router = express.Router();
var config = require('../config');
var _ = require('lodash');
var utils = require('../helpers/utils');

/* GET terms page. */
router.get('/terms', utils.isLoggedIn, function (req, res, next) {
	
	var genericLayoutSettings = utils.getGenericLayoutProperties();
	res.render('index', _.assign(genericLayoutSettings, { 
		title: 'PCLN Photo Contest', 
		isTerms: true,
		categories: config.categories,
		userFirstName: req.user.firstname || ''
	}));

});

module.exports = router;
