/**
 * Created by mik on 2016-11-30.
 */

var flash = require('connect-flash');

module.exports = function checkUserRegValidation(req, res, next) {
    var isValid = true;

    async.waterfall(
        [function(callback) {
            User.findOne({email: req.body.user.email, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
                function(err,user){
                    if(user){
                        isValid = false;
                        req.flash("emailError","- This email is already resistered.");
                    }
                    callback(null, isValid);
                }
            );
        }, function(isValid, callback) {
            User.findOne({nickname: req.body.user.nickname, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
                function(err,user){
                    if(user){
                        isValid = false;
                        req.flash("nicknameError","- This nickname is already resistered.");
                    }
                    callback(null, isValid);
                }
            );
        }], function(err, isValid) {
            if(err) return res.json({success:"false", message:err});
            if(isValid){
                return next();
            } else {
                req.flash("formData",req.body.user);
                res.redirect("back");
            }
        }
    );
}
