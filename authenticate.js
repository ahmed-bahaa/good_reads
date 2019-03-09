var jwt = require('jsonwebtoken');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User=require('./models/user')
var config = require('./config')


exports.local = passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    secret_key='123-456-789'
    return jwt.sign(user,config.secretKey ,
        {expiresIn: 3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));
    
    exports.verifyUser = passport.authenticate('jwt', {session: false});

    exports.verifyAdmin = (req,res,next)=>{
        if(req.user.admin){
            next();
           
        }else {
             
             res.statusCode= 403;
             res.end("You are not authorized to perform this operation!")
             next(err);
        }
    };
   

