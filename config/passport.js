const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

//Load User Model
const User = require('../models/User');

//
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


//Create a new account and add it to the database
passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true //Allow use to fill in the fName component before saving it to the database
        },
        function (req, email, password, done)
        {
            let resArray = [];
            let password2 = req.body.password2;

            //Check if passwords match
            if(password !== password2)
            {
                return done(null, false, { message: 'Passwords do not match' });
            }
            else
            {
                User.findOne({ email: email })
                .then(user => {
                    if(user)
                    {
                        return done(null, false, { message: 'The user already exists'});
                    }
                    else
                    {
                        try {
                            let fName = req.body.fName;
                            User.create({ fName, email, password })
                            .then(user => {
                                return done(null, user);
                            })     
                        }
                        catch 
                        {
                            done(error);
                        }
                    }
                })
            }
        }
    )
);

//Login to the website using account created for the website
//Catch potential logins with invalid credentials
passport.use(
    'login',
    new LocalStrategy (
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try{
                const user = await User.findOne({ email });

                if(!user)
                {
                    return done(null, false, { message: 'User not found'});
                }

                const validate = await user.isValidPassword(password);

                if(!validate)
                {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done (null, user, {message: 'Logged in Successfully' });
            }

            catch (error)
            {
                return done(error);
            }
        }
    )  
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: 'TOP_SECRET',
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
        },
        async (token, done) => {
            try 
            {
                return done(null, token.user);
            }
            catch (error){done(error);}
        }
    )
);

// module.exports = function(passport) {
//     passport.use(
//         new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
//             //Check if user exists in database
//             User.findOne({ email: email })
//                 .then(user => {
//                     if(!user)
//                     {
//                         return done(null, false, { message: 'That email is not registered in the database' });
//                     }

//                     //Match password
//                     if(user.password == password)
//                     {
//                         //Check to see if the account is deactivated
//                         if(user.status == 'deactivate')
//                         {
//                             return done(null, false, {message: 'The account has been de-activated. Please contact the administrator at the following email: bdmichaud637@gmail.com' });
//                         }


//                         return done(null, user);
//                     }
//                     else
//                     {
//                         console.log("the passwords don't match")
//                         return done(null, false, { message: 'Password Incorrect' })
//                     }
//                 })
//                 .catch(err => console.log(err));
//         })
//     );

//     passport.serializeUser(function(user, done) {
//         if(user) done(null, user.id);
//       });
      
//       passport.deserializeUser(function(id, done) {
//         User.findById(id, function(err, user) {
//           done(err, user);
//         });
//       });
// }