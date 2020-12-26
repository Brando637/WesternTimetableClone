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

const express = require ('express');//Load the express module
const app = express();//Create an express object, a web application is created
const expressSanitizer = require('express-sanitizer');
app.use(expressSanitizer());

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
            let emailSan = req.sanitize(email);
            let passwordSan = req.sanitize(password);
            let password2San = req.sanitize(req.body.password2);


            //Check if passwords match
            if(passwordSan !== password2San)
            {
                return done(null, false, { message: 'Passwords do not match' });
            }
            else
            {
                User.findOne({ email: emailSan })
                .then(user => {
                    if(user)
                    {
                        return done(null, false, { message: 'The user already exists'});
                    }
                    else
                    {
                        try {
                            let fName = req.sanitize(req.body.fName);
                            let emailToken = crypto.randomBytes(64).toString('hex');
                            console.log("The token is the following" + emailToken);
                            User.create({ fName, email: emailSan, password: passwordSan, emailToken })
                            .then(user => {
                                const msg = {
                                    from: 'se3316testlab5@gmail.com',
                                    to: emailSan,
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
                let emailSan = req.sanitize(email);
                let passwordSan = req.sanitize(password)
                const user = await User.findOne({ email: emailSan });

                //Check to see if the entered email is in the database
                if(!user)
                {
                    return done(null, false, { message: 'User not found'});
                }

                const validate = await user.isValidPassword(passwordSan);

                //Check to see if the password entered is incorrect
                if(!validate)
                {
                    return done(null, false, { message: 'Wrong Password' });
                }
                
                //Check to see if the account is deactivated
                if (user.status == 'deactivate') {
                    return done(null, false, { message: 'The account has been de-activated. Please contact the administrator at the following email: se3316testlab5@gmail.com' });
                }

                //Check to see if the user has confirmed their email
                if ( user.confirmed == false)
                {
                    return done(null, false, { message: 'You have not confirmed your email yet. Would you like to re-send your confirmation email?'})
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
