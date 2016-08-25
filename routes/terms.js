var express = require('express');
var router = express.Router();
var config = require('../config');
var utils = require('../helpers/utils');
var genericLayoutSettings = utils.getGenericLayoutProperties();

/* GET terms page. */
router.get('/terms', function (req, res, next) {

	res.render('index', _.assign(genericLayoutSettings, { 
		title: 'PCLN Photo Contest', 
		isTerms: true,
		categories: config.categories
	}));

});

module.exports = router;
