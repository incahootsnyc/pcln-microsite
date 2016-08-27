var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');
var utils = require('./utils');
var mailer = require('./mailer');
var ObjectID = require('mongodb').ObjectID;

function setUpPassport (passport) {

    passport.use(new LocalStrategy(function (username, password, done){
        db.get().collection('users').findOne({ username : username}, function (err,user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: '00' });
            }

            var saltHashPassword = utils.saltHashPassword(password, user.salt);
            if (err) { return done(err); }
            if (saltHashPassword.passwordHash == user.hash) return done(null, user);
            done(null, false, { message: '01' });
        });
    }));

    passport.use('signup', new LocalStrategy({ passReqToCallback : true }, function (req, username, password, done) { 

        if (!utils.isValidPricelineEmail(username)) {
            return done(null, false, { message: '02' });
        }

        // Delay the execution of findOrCreateUser and execute 
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);

        function findOrCreateUser () {
            // find a user in Mongo with provided username
            db.get().collection('users').findOne({ username: username },function (err, user) {
                // In case of any error return
                if (err){
                    return done(err);
                }
                // already exists
                if (user) {
                    return done(null, false, { message: '03' });
                } else {
                    // if there is no user with that email create the user and save the user
                    var tempUser = utils.createTempUser(username, password);
                    db.get().collection('pendingUsers').insert(tempUser, function (error, confirmation) {
                        if (error) { throw err; }
                        mailer.sendConfirmationEmail(req, tempUser);
                        return done(null, tempUser, { message: '04' });
                    });
                }
            });
        }
    }));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });


    passport.deserializeUser(function (id, done) {
        db.get().collection('users').findOne({ _id: new ObjectID(id)}, function (err,user){
            if (err) done(err);
            done(null,user);
        });
    });
}

module.exports = {
    configureStrategy: setUpPassport
}