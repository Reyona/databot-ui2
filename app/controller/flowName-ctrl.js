/**
 * Created by HUANGCH7 on 4/3/2017.
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

exports.getFlowNames = getFlowNames;

function getFlowNames(req, res, next) {
    console.log('============='+JSON.stringify(req.query.project));
    var r;
    if ('LODS' === req.query.project) r = 'LODS';
    else r = {$ne:'LODS'};
    var query = {
        cleaned: false,
        L: req.query.L,
        R: r
    };
    issueRecordFacade.getFlowNamesByUpstream(query, function(err, result){
        return res.json(result);
    });
}