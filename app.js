var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var session  = require('express-session');
var flash    = require('connect-flash');

var mongoose = require('./model/mongoo');
var User = mongoose.model('user',mongoose.userSchema);
/*var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/dib");
 var db = mongoose.connection;
 db.once("open",function () {
 console.log("DB connected!");
 });
 db.on("error",function (err) {
 console.log("DB ERROR :", err);
 });

var userSchema = mongoose.Schema({
  email: {type:String, required:true, unique:true},
  nickname: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  createdAt: {type:Date, default:Date.now}
});
var User = mongoose.model('user',userSchema);
*/


passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


var routes = require('./routes/main');
var user = require('./routes/user');
var bbs_write = require('./routes/bbs_write');
var bbs = require('./routes/bbs');
var login = require('./routes/login');
var logout = require('./routes/logout');
var newUser = require('./routes/newUser');
// 게시글 접근어떻게??

// routes폴더안의 js파일 위치

var app = express();

app.use(flash());

app.use(session({secret:'MySecret'}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/user', user);
app.use('/bbs_write', bbs_write);
app.use('/bbs', bbs);
app.use('/login', login);
app.use('/logout', logout);
app.use('/newUser', newUser);
//routes함수의 js파일을 주소와 연결

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
