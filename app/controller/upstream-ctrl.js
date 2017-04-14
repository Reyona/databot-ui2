/**
 * Created by HUANGCH7 on 3/30/2017.
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

exports.getUpstreams = getUpstreams;

function getUpstreams(req, res, next) {
    console.log('============='+JSON.stringify(req.query.project));
    var r;
    if ('LODS' === req.query.project) r = 'LODS';
    else r = {$ne:'LODS'};
    var query = {
        cleaned: false,
        R : r
    };
    issueRecordFacade.getUpstreamsByProject(query, function(err, result) {
        return res.json(result);
    });

}