const passort = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/user');


//for logging in
passsport.use(new localStrategy({
    usernameField : username,
    passwordField : password
},
    async (username, password, done) => {
        //find the username in the table
        const userDoc = UserModel.findOne({username: username}).exec();

        try{
            //if user doesn't exist
            if(!userDoc){
                return done(null,false,{message: 'Incorrect username'});
            }
            //if user exists, check password
            if(!userDoc.isValidPassword(password)){
                return done(null, false, {message:'Incorrect Password'});
            }

             //send user info to next middleware
            return done(null, userDoc, {message: 'Log in successful!'});

        } catch(error){
            done(error);
        }
    }
));

//for verifying token
passort.use(new jwtStrategy({
    secretOrKey: 'top_secret',

    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
    try{
        return done(null, token.user);
    } catch(error){
        done(error);
    }
}));