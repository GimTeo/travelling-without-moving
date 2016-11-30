/**
 * Created by a11 on 2016. 11. 27..
 */

var express = require('express');
var router = express.Router();
var passport = require('passport');
var flash    = require('connect-flash');
var session = require('express-session');


var mongoose = require('../model/mongoo');
var User = mongoose.model('user',mongoose.userSchema);


passport.serializeUser(function(user, done) {
    console.log("serial " + user.id);
    console.log("serial " + JSON.stringify(user.id));
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    console.log("deserial " + user.id);
    console.log("deserial " + JSON.stringify(user.id));
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.use(passport.initialize());
router.use(passport.session());
var LocalStrategy = require('passport-local').Strategy; // localstratage 호출 하고

passport.use('local-login', // localstratage 이름을 local-login
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function (req, email, password, done) {
        User.findOne({'email' : email}, function(err, user){
            if (err) {
                console.log("err " + user.id);
                console.log("err " + JSON.stringify(user.id));
                return done(err);
            }

            if(!user){
                req.flash('email', req.body.email);
                console.log("not found email");
                return done(null, false, req.flash('loginError', 'no found email.'));
            }
            if(user.password != password){
                req.flash("email", req.body.email);
                console.log("not match pass");
                return done(null, false, req.flash('loginError','not match password'));
            }
            console.log("pa use " + user.id);
            console.log("pa use " + JSON.stringify(user.id));
            return done(null, user); // 성공시 user 객체를 이용해서 session 생성
        });

    })
);


router.get('/', function(req, res){ //  login page
    if(req.user)  {
        console.log("can't access " + JSON.stringify(req.user));
        res.redirect('/');
    }
    else{
        res.render('login', {email : req.flash("email")[0], loginError:req.flash('loginError')});
    }
}); // login으로 들어오면 로그인 창 render함

router.post('/', function(req, res, next) {
    req.flash("email"); // flash email data
    if (req.body.email.length === 0 || req.body.password === 0) {
        req.flash("email", req.body.email);
        req.flash("loginError", "input email and password");
        res.redirect('/newUser'); // error시 다시 login render
    }
    else {
        next();
    }
}, passport.authenticate('local-login',{ //localstratage 인 local-login을  부름
    successRedirect : '/', // 성공시 main으로
    failureRedirect : '/login', //실패시 다시 login으로
    failureFlash: true
    })
);

module.exports = router;