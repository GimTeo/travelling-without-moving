/**
 * Created by a11 on 2016. 11. 21..
 */

/* GET users listing. */

var express = require('express');
var router = express.Router();



router.post('/', function(req, res, next){
    var country = req.body.country;
    var duration = req.body.dur;
    //db에서 오브젝트 찾는 펑션 넣어준다.

    next();
});

router.get('/:postid', function(req, res, next) {
    res.send('respond with a resource');
    partial('comment', { object: movie, as: this });
});

module.exports = router;