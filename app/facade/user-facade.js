/**
 * Created by CAOTE on 12/12/2016.
 */
require('../model/user-model.js');
var mongoose = require('mongoose');
var userModel = mongoose.model('User');
function saveUser(user,cb){
    userModel.create(user,cb)
}
function findByNameAndPwd(name,pwd,callback){
    userModel.find({UserName:name,Password:pwd}, callback)
}
function findByName(name,cb){
    userModel.find({UserName:name},cb);
}
exports.findByNameAndPwd = findByNameAndPwd;
exports.saveUser = saveUser;
exports.findByName = findByName;