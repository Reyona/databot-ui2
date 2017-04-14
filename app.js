var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session = require("express-session");
var mongoose = require('mongoose');
var MongoStore = require("connect-mongo")(session);
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

require('./app/model/issueRecord-model.js');
var index = require('./routes/index');
var users = require('./routes/users');
var authFilter = require('./routes/authFilter');

//config
var dbUrl = 'mongodb://zengjo-w7/databotUI';
//var dbUrl = 'mongodb://huangch7-w7/dataquality';

var app = express();
mongoose.connect(dbUrl);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:"DATABOT",
  //secret:"PA-TOOLS",
  cookie: { maxAge: 1 * 60 * 60 * 1000 },
  store:new MongoStore({
    url:dbUrl
  }),
  resave:true,
  saveUninitialized:true
}));
app.use(function(req,res,next){
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  res.locals.userName = req.session.userName;
  res.locals.readOnly = req.session.readOnly;
  res.locals.role = req.session.role;
  next();
});
app.use('/',authFilter);
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
