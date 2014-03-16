var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');

var api = require('./routes/api/issues');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.index);

app.param(function(name, fn){
  if (fn instanceof RegExp) {
    return function(req, res, next, val){
      var captures;
      if (captures = fn.exec(String(val))) {
        req.params[name] = captures;
        next();
      } else {
        next('route');
      }
    }
  }
});

app.param("issueId", /^\d+$/);
app.param("bountyId", /^\d+$/);

app.all('/api/*', function(req, res, next){
  console.log("Setting Allow-Origin header.")
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  next();
});

app.get('/api/issues/', api.getIssues);
app.get('/api/issues/:issueId', api.getIssue);

app.get('/api/issues/:issueId/bounties/', api.getIssueBounties);

app.get('/api/bounties/', api.getBounties);
app.get('/api/bounties/:bountyId', api.getBounty);

app.post('/api/bounties/', api.addBounty);

app.post('/api/transactions/', api.transactions);
app.get('/api/listtransactions/', api.listtransactions);
app.get('/api/block/', api.block);

app.get('/claimbounty', api.claimBounty)
app.get('/oauth/callback', api.claimBountyCallback)


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
