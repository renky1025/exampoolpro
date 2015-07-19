require( './mongdb' );

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var roles = require('./routes/roles');
var school = require('./routes/school');
var course = require('./routes/course');
var account = require('./routes/account');

var app = express();

// view engine setup
app.set( 'views', path.join( __dirname, 'views' ));
app.set( 'view engine', 'ejs' );

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/roles', roles);
app.use('/school', school);
app.use('/account', account);
app.use('/courses', course);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('error', {
    title: "Page Not Found",
    message: err.message,
    error: err,
    results:[]
  });
  //next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: "server error : "+(err.status||500),
      message: err.message,
      error: err,
      results:[]
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: "server error : "+(err.status||500),
    message: err.message,
    error: {},
    results:[]
  });
});


module.exports = app;
