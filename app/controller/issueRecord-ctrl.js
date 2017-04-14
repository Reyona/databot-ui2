/**
 * Created by ZENGJO on 3/17/2017.
 */

/**
 * Module dependencies.
 */
//Load Node.js library
var _ = require('lodash');
var path = require('path');
var request = require('request');
var util = require('util');
var issueRecordFacade = require('../facade/issueRecord-facade');

exports.getIssueRecords = getIssueRecords;
exports.updateIssueRecords = updateIssueRecords;
exports.getAllIssueRecords = getAllIssueRecords;

function getIssueRecords(req, res, next){
    if(!_.isEmpty(_.result(req,'body.criteria'))){
        issueRecordFacade.getIssueRecords(req.body.criteria, req.query, function(err, totalCount, result){
            if(err){
                console.log("Get issueRecord failed!");
                return next(new Error(err))
            }else{
                return res.json({
                    result: result,
                    totalCount: totalCount
                });
            }
        })
    }
}


function updateIssueRecords(req, res, next){
    if(!_.isEmpty(req, 'body.criteria')){
        issueRecordFacade.updateIgnoreRecordsById(_.result(req, 'body.criteria.ignoreRecords'), function(err, result){
            if(err){
                return next(new Error(err))
            }else{
                return res.json(result);
            }
        });
    }
}



function getAllIssueRecords(req, res, next){
    issueRecordFacade.getAllIssueRecords(req.query,function(err, totalCount, result){
        if(err){
            console.log("Get all issueRecords failed!");
            return next(new Error(err))
        }else{
            return res.json({
                result: result,
                totalCount: totalCount
            });
        }
    });

}