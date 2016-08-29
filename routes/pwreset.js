var express = require('express');
var router = express.Router();
var db = require('../helpers/db');
var _ = require('lodash');
var utils = require('../helpers/utils');

router.get('/password-reset/:uniqueUrl', function (req, res) {
    var errorMessage = 'hmm... nothing to reset here.';
    var genericLayoutSettings = utils.getGenericLayoutProperties();

    if (req.params.uniqueUrl) {
        db.get().collection('users').findOne({ passwordResetUrl: req.params.uniqueUrl }, function (error, user) {
            if (error || !user) {
                res.render('pwreset', { error: errorMessage });
            } else {

                res.render('pwreset', {});
                        
            }
        });
    } else {
        res.render('pwreset', { error: errorMessage });
    }
});

module.exports = router;