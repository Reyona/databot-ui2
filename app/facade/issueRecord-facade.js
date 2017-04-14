/**
 * Created by ZENGJO on 3/17/2017.
 */


var _ = require('lodash');
var mongoose = require('mongoose');
var issueRecordModel = mongoose.model('IssueRecord');
var dateUtil = require('../util/date-util');
var async = require('async');
exports.getIssueRecords = getIssueRecords;
exports.updateIgnoreRecordsById = updateIgnoreRecordsById;
exports.getAllIssueRecords = getAllIssueRecords;
exports.getUpstreamsByProject = getUpstreamsByProject;
exports.getFlowNamesByUpstream = getFlowNamesByUpstream;


function getIssueRecords(criteria, params, callback){
    var query = {};
    var createdAtFrom = Date();
    var createdAtTo = Date();
    createdAtFrom = criteria.createdAtFrom;
    createdAtTo = criteria.createdAtTo;
    if(_.result(criteria,'createdAtFrom') != null || _.result(criteria,'createdAtTo') != null){
        query.createdAt ={$gte:createdAtFrom,$lte:createdAtTo}
    }
    //put other fileds in query from font-end criteria
    for(var attr in criteria){
        if(attr != 'createdAtFrom' && attr != 'createdAtTo'){
            query[attr] = criteria[attr]
        }
    }
    issueRecordModel.count(query, function(err, totalCount) {
        issueRecordModel.find(query, {}, {limit:parseInt(params.pageSize),skip:parseInt((params.page-1)*params.pageSize)}, function(err, result){
            if(err){
                callback(err, null);
            }else{
                callback(null, totalCount, result);
            }
        });
    });


}


function updateIgnoreRecordsById(ignoreRecords, callbackFn){
    var task = [];
    var failTask = [];
    var successTask = [];
    _.forEach(ignoreRecords, function(ignoreRecord){
        var nowFormatDate = new Date();
        ignoreRecord.updatedAt = nowFormatDate.toISOString();
        ignoreRecord.logs = nowFormatDate.toISOString() + ': Ignored';
        task.push(function(callback){
            issueRecordModel.update({_id:ignoreRecord._id},{$set:ignoreRecord}, function(err, result){
                if(err){
                    callback(err, failTask.push(ignoreRecord._id))
                }else{
                    callback(null, successTask.push(ignoreRecord._id));
                }
            })
        })
    });
    async.parallel(task, function(err, result){
        console.log('111');
        if (err){
            callbackFn(err, null);
        }else{
            console.log('Update Ignore Records info');
            callbackFn(null, {fail:failTask, success:successTask});
        }
    });
}



function getAllIssueRecords(params,callback){
    issueRecordModel.count({cleaned: false}, function(err, totalCount) {
        issueRecordModel.find({cleaned: false}, {}, {limit:parseInt(params.pageSize),skip:parseInt((params.page-1)*params.pageSize)}, function(err, result){
            if(err){
                callback(err, null, null);
            }else{
                callback(null, totalCount, result);
            }
        });
    });

}

function getUpstreamsByProject(query, callback) {
    issueRecordModel.distinct('L', query, function(err, result) {
        if(err){
            callback(err, null);
        }else{
            callback(null, result);
        }
    });
}

function getFlowNamesByUpstream(query, callback) {
    issueRecordModel.distinct('name', query, function(err, result){
        if(err){
            callback(err, null);
        }else{
            callback(null, result);
        }
    })
}