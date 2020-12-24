const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'se3316testlab5@gmail.com',
        pass: 'test123lab5'
    }
});
//Load User Model
const User = require('../models/User');

//To extract the JWT from the query parameter
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
                            let emailToken = crypto.randomBytes(64).toString('hex');
                            console.log("The token is the following" + emailToken);
                            User.create({ fName, email, password, emailToken })
                            .then(user => {
                                const msg = {
                                    from: 'se3316testlab5@gmail.com',
                                    to: email,
                                    subject: 'DraftMySchedule - Verify Your Email',
                                    text: `
                                        Hello, please complete registration by clicking the link below.
                                        http://${req.headers.host}/verify-email?token=${emailToken}`,

                                    html: `
                                        <h1>Hello</h1>
                                        <p>Please complete registration by clicking the link below.</p>
                                        <a href="http://${req.headers.host}/verify-email?token=${emailToken}>Verify Account</a>`
                                }
                                transporter.sendMail(msg, function(err, data) {
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        console.log('Email sent successfully');
                                    }
                                });
                                return done(null, user);
                            })     
                        }
                        catch (error)
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

                //Check to see if the entered email is in the database
                if(!user)
                {
                    return done(null, false, { message: 'User not found'});
                }

                const validate = await user.isValidPassword(password);

                //Check to see if the password entered is incorrect
                if(!validate)
                {
                    return done(null, false, { message: 'Wrong Password' });
                }
                
                //Check to see if the account is deactivated
                if (user.status == 'deactivate') {
                    return done(null, false, { message: 'The account has been de-activated. Please contact the administrator at the following email: se3316testlab5@gmail.com' });
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

//To extract the JWT from the query parameter
passport.use(
    new JWTstrategy(
        {
            secretOrKey: 'TOP_SECRET',
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try 
            {
                const expirationDate = new Date (token.exp * 1000);
                if(expirationDate < new Date())
                {
                    return done(null, false);
                }
                return done(null, token);
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
//                         


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