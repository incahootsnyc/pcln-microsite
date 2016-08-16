var express = require('express');
var router = express.Router();

/* GET terms page. */
router.get('/terms', function (req, res, next) {

	res.render('index', { 
		title: 'PCLN Photo Contest', 
		isTerms: true,
		isHome: false
	});

});

module.exports = router;
