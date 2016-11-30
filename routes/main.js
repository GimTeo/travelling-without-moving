var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.user) {
    console.log("session " + JSON.stringify(req.user));
    res.render('index', {userName: req.user, user: req.user});
    //else res.render('index', { userName: "hello " + "<p>"+req.user.nickname+"<p>" });
  }
  else {
    console.log("session " + JSON.stringify(req.user));
    res.render('index', { userName: req.user.nickname , user: req.user});
  }
});

module.exports = router;
