/**
 * Created by mik on 2016-11-30.
 */


// "C:\Program Files\MongoDB\Server\3.2\bin\mongod.exe" --dbpath ./
var mongoose = require('mongoose');

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

var postSchema = mongoose.Schema({
    title: {type: String},
    hint:   {type:String},
    author:   {type: String},
    nation: {type: String},
    duration: {type: Number},
    date:       {type: Date, required: true, default: Date.now()},
    number:     {type:String, required: true},
    markers: [{}]
});
var Post = mongoose.model('post',postSchema);

module.exports = mongoose;
module.exports = User;
module.exports = Post;