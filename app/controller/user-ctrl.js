/**
 * Created by CAOTE on 12/12/2016.
 */
'use strict';

/**
 * Module dependencies.
 */
//Load Node.js library
var path = require('path');
var request = require('request');
var common = require('../util/common.js');
var userFacade = require('../facade/user-facade');

exports.login = login;
exports.addUser = addUser;
exports.logout = logout;
function addUser(req, res, next){
    if(req.body.userName){
        userFacade.findByName(req.body.userName,function(err,data){
            var result={};
            if(err){
                console.log(err);
                result.success=false;
                result.message='System error!';
                res.send(result);
            }else{
                if(common.isEmptyObject(data)){
                    var user = {
                        UserName:req.body.userName,
                        Password:req.body.password,
                        Role:'normal',
                        ReadOnly:req.body.readOnly > 0,
                        Date: new Date().toDateString()
                    };
                    user.Password = common.crypto.encrypt(user.Password);
                    userFacade.saveUser(user,function(err){
                        if(err){
                            console.log(err);
                            result.success=false;
                            result.message='System error!';
                        }else {
                            result.success = true;
                            result.resultCode = '01';
                            result.message = 'Add user success!';
                        }
                        res.send(result);
                    });
                }else{
                    result.success=true;
                    result.resultCode='00';
                    result.message='User already exists!';
                    res.send(result);
                }
            }
        });
    }
}

function login(req, res, next) {
    userFacade.findByNameAndPwd(req.body.userName, common.crypto.encrypt(req.body.password), function (err, data) {
        var result = {};
        if (err) {
            console.log(err);
            result.success = false;
            result.message = 'System error';
        } else {
            if (common.isEmptyObject(data)) {
                result.success = true;
                result.resultCode = '00';
                result.message = 'Login failed, please check your user name or password!';
            } else {
                result.success = true;
                result.resultCode = '01';
                result.message = 'success';
                req.session.userName = data[0].UserName;
                req.session.readOnly = data[0].ReadOnly;
                req.session.role = data[0].Role;
            }
        }
        res.send(result);
    });
}

function logout(req,res){
    req.session.userName = '';
    req.session.readOnly = '';
    req.session.role = '';
    //res.redirect('/');
    res.send('success');
}

