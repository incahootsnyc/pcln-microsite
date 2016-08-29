var express = require('express');
var router = express.Router();
var db = require('../helpers/db');

router.get('/account-confirmation/:uniqueUrl', function (req, res) {
    var errorMessage = 'hmm... nothing to confirm here.';
    var now = Date.now();
    var maxDiff = 604800000; // one week

    if (req.params.uniqueUrl) {
        db.get().collection('pendingUsers').findOne({ confirmationUrl: req.params.uniqueUrl }, function (error, user) {
            if (error || !user) {
                res.send(errorMessage);
            } else {

                if ((now - user.datetime) < maxDiff) {
                    db.get().collection('pendingUsers').remove({ username: user.username });

                    // no need to store this in the real users collection
                    user.confirmationUrl = null;

                    db.get().collection('users').insert(user, function (error, confirmation) {
                        if (error) {
                            res.send('hmm... something went wrong.');
                        } else {
                            res.redirect('/');
                        }
                    });
                } else {
                    res.send('hmm... the pending account has expired.');
                }
            }
        });
    } else {
        res.send(errorMessage);
    }
});

module.exports = router;
