var express = require('express');
var router = express.Router();
var config = require('../config');
var _ = require('lodash');
var utils = require('../helpers/utils');

/* GET terms page. */
router.get('/contestinfo', utils.isLoggedIn, function (req, res, next) {
	
	var genericLayoutSettings = utils.getGenericLayoutProperties();
	res.render('index', _.assign(genericLayoutSettings, { 
		title: 'PCLN Photo Contest', 
		isContestInfo: true,
		categories: config.categories
	}));

});

module.exports = router;