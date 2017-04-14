/**
 * Created by HUANGCH7 on 4/6/2017.
 */

var mongoose = require('mongoose');
var common = require('./app/util/common.js');
var userFacade = require('./app/facade/user-facade');
var userModel = mongoose.model('User');
var dbUrl = 'mongodb://zengjo-w7/databotUI';
//var dbUrl = 'mongodb://huangch7-w7/dataquality';

mongoose.connect(dbUrl);

var user = {
    UserName:'admin',
    Password:common.crypto.encrypt('admin'),
    Role:'admin',
    ReadOnly:false,
    Date: new Date().toDateString()
};
/*
userFacade.saveUser(user,function(err){
    if(err){
        console.log(err);
    }else {
        console.log('Add user success!')
    }
});*/
userModel.update({_id:"585e102e0518eb298ced338e"},{$set:{Password:user.Password}}, function(err, result){
    if(err){
        console.log(err);
    }else{
        console.log('Update success!');
    }
});
