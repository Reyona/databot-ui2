var express = require('express');
var router = express.Router();
var controllerForUserInfo = require('../app/controller/user-ctrl');
var controllerForIssueRecord = require('../app/controller/issueRecord-ctrl');
var controllerForUpstream = require('../app/controller/upstream-ctrl');
var controllerForFlowName = require('../app/controller/flowName-ctrl');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'DataBot DataQuality System' });
});
router.get('/home', function(req, res, next) {
  res.render('homePage', { title: 'DataBot DataQuality System' });
});
router.post('/addUser',controllerForUserInfo.addUser);
router.post('/login',controllerForUserInfo.login);
router.post('/logout',controllerForUserInfo.logout);
router.get('/uncleanedRecords', controllerForIssueRecord.getAllIssueRecords);
router.post('/uncleanedRecords', controllerForIssueRecord.updateIssueRecords);
router.put('/uncleanedRecords', controllerForIssueRecord.getIssueRecords);
router.get('/upstreams', controllerForUpstream.getUpstreams);
router.get('/flowNames', controllerForFlowName.getFlowNames);

module.exports = function(app) {
  app.route('/databot/saveReport')
      .post(controller.saveReport(app));
};
module.exports = function(app) {
  app.route('/databot/getReport')
      .post(controller.getReport(app));
};

module.exports = router;
