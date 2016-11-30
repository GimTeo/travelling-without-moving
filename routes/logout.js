/**
 * Created by a11 on 2016. 11. 29..
 */

var express = require('express');
var router = express.Router();

var passport = require('passport');


passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
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
                if (err) return done(err);

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
                return done(null, user); // 성공시 user 객체를 이용해서 session 생성
            });

        })
);
router.get('/', function(req, res){ // logout으로 접속시 logout한다.
    if(!req.user) {
        console.log("can't access " + JSON.stringify(req.user));
        res.redirect('/');
    }
    else {
        req.logout();// pasport에서 제공하는 logout 함수
        res.redirect('/');
    }

});

module.exports = router;