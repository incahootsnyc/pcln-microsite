var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');
var utils = require('./utils');

function setUpPassport (passport) {

    passport.use(new LocalStrategy(function (username, password, done){
        db.get().collection('users').findOne({ username : username}, function (err,user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            var saltHashPassword = utils.saltHashPassword(password, user.salt);
            if (err) { return done(err); }
            if (saltHashPassword.passwordHash == user.hash) return done(null, user);
            done(null, false, { message: 'Incorrect password.' });
        });
    }));

    passport.use('signup', new LocalStrategy({ passReqToCallback : true }, function (req, username, password, done) {   
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
                    return done(null, false, { message: 'User already exists.' });
                } else {
                    // if there is no user with that email create the user and save the user
                    var newUser = utils.createUser(req.body.username, req.body.password);
                    db.get().collection('users').insert(newUser, function (error, confirmation) {
                        if (error) { throw err; }
                        return done(null, newUser);
                    });
                }
            });
        }
    }));

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });


    passport.deserializeUser(function (id, done) {
        db.get().collection('users').findOne({ _id: id}, function (err,user){
            if (err) done(err);
            done(null,user);
        });
    });
}

module.exports = {
    configureStrategy: setUpPassport
}