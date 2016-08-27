var express = require('express');
var router = express.Router();
var _ = require('lodash');
var utils = require('../helpers/utils');

/* GET terms page. */
router.get('/terms', utils.isLoggedIn, function (req, res, next) {
	
	var genericLayoutSettings = utils.getGenericLayoutProperties();
	res.render('index', _.assign(genericLayoutSettings, { 
		isTerms: true,
		userFirstName: req.user.firstname || ''
	}));

});

module.exports = router;
