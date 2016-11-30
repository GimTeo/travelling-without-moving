/**
 * Created by a11 on 2016. 11. 21..
 */
/* GET users listing. */

var express = require('express');
var router = express.Router();
var mongoose = require('../model/mongoo');
var Post = mongoose.model('post',mongoose.userSchema);
//var check = require('../javascripts/checkUserRegValidation');

router.get('/', function(req, res, next) {
    if(!req.user) {
        console.log("can't access " + JSON.stringify(req.user));
        res.redirect('/');
    }
    else{
        res.render('bbs_write');
    }
});

router.post('/', function(req,res){
    console.log(req.body.title);
    Post.create(req.body, function (err,post) {
        if(err) {
            console.log(JSON.stringify(req.body));
            console.log("post DB err" + JSON.stringify(err));
            return res.json({success:false, message:err});
        }
        res.redirect('/');
    });
});

module.exports = router;