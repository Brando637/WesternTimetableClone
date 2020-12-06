const LocalStrategy = require('passport-local').Strategy;
const { builtinModules } = require('module');
const mongoose = require('mongoose');

//Load User Model
const User = require('../models/User');
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            //Check if user exists in database
            User.findOne({ email: email })
                .then(user => {
                    if(!user)
                    {
                        return done(null, false, { message: 'That email is not registered in the database' });
                    }

                    //Match password
                    if(user.password == password)
                    {
                        //Check to see if the account is deactivated
                        if(user.status == 'deactivate')
                        {
                            return done(null, false, {message: 'The account has been de-activated. Please contact the administrator at the following email: bdmichaud637@gmail.com' });
                        }


                        return done(null, user);
                    }
                    else
                    {
                        console.log("the passwords don't match")
                        return done(null, false, { message: 'Password Incorrect' })
                    }
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser(function(user, done) {
        if(user) done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}