/**
 * Created by a11 on 2016. 11. 27..
 */

var express = require('express');
var router = express.Router();
var mongoose = require('../model/mongoo');
var User = mongoose.model('user',mongoose.userSchema);
var async    = require('async');

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


function checkUserRegValidation(req, res, next){ // newuser정보 check
    var isValid  = true;
  req.body.user = JSON;
   req.body.user.email = req.body.email;
  req.body.user.nickname = req.body.nickname;
    console.log("1");
    console.log("body"+req.body);
    console.log("body"+JSON.stringify(req.body));
    console.log("body.user"+JSON.stringify(req.body.user));
    console.log("params"+JSON.stringify(req.user));
    console.log("params.id"+JSON.stringify(req.body.user));
    async.waterfall( // 비동기를 막기위한 async
        [function(callback){
            //User.findOne({email: req.body.user.email, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
            User.findOne({email: req.body.user.email},
                function(err,user){
                    if(user){
                        isValid = false;
                        console.log("- This email is already resistered.");
                        req.flash("emailError","- This email is already resistered.");
                    }
                    callback(null, isValid);
                }
            );
        }, function(isValid, callback) {
            //User.findOne({nickname: req.body.user.nickname, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
            User.findOne({nickname: req.body.user.nickname},
                function(err,user){
                    if(user){
                        isValid = false;
                        console.log("- This nickname is already resistered.");
                        req.flash("nicknameError","- This nickname is already resistered.");
                    }
                    callback(null, isValid);
                }
            );
        }], function(err, isVaild){
            if(err) return res.json({success: "false", message:err});
            if(isVaild){
                return next();
            }
            else{
                req.flash("formdata", req.body.user);
                res.redirect("back");
            }
        }
    );
}



router.get('/', function(req, res){
    if(req.user){
        console.log("can't access " + JSON.stringify(req.user));
        res.redirect('/');
    }
    else {
        console.log("session " + JSON.stringify(req.user));
        res.render('newUser', {dormData: req.flash('formData')[0], emailError: req.flash('emailError')[0], nicknameError: req.flash('nicknameError')[0], passwordError: req.flash('passwordError')[0]});
    }
});

router.post('/', checkUserRegValidation, function(req, res, next){
    req.body.user.password = req.body.password;
    User.create(req.body.user, function(err,user){
        if(err) {
            console.log(err);
            console.log(JSON.stringify(err));
            return res.json({success:false , message:err});
        }
        res.redirect('/login'); // 성공시 login화면으로 이동
    });
});

//app.get('/user/:id', function(req, res){
    //User.findById(req.params.id, function(err, user){
      //  if(err) return res.json({success : false, message:err});
        //res.render("user/show", {user: user});
    //});
//});

module.exports = router;