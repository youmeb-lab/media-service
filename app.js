'use strict';

var app = require('koa')();
var gzip = require('koa-gzip');
var etag = require('koa-etag');
var cluster = require('koa-cluster');
var conditional = require('koa-conditional-get');

var log = require('./logger');
var view = require('./middlewares/view');
var home = require('./middlewares/home');
var upload = require('./middlewares/upload');
var config = require('./config');
var favicon = require('./middlewares/favicon');
var parsePath = require('./middlewares/parse-path');
var mobileDetect = require('./middlewares/mobile-detect');
var errorHandler = require('./middlewares/error-handler');
var accessControl = require('./middlewares/access-control');

Object.defineProperty(app.context, 'size', {
  get: function () {
    return this.mobileSize
      || this.query.size
      || 'normal';
  }
})

app.use(errorHandler);

if (config.enableAccessControl) {
  app.use(accessControl);
}

app.use(gzip());
app.use(conditional());
app.use(etag());
app.use(home);
app.use(favicon);
app.use(mobileDetect);
app.use(parsePath);
app.use(view);
app.use(upload);

cluster(app, { restart: config.autoRestart })
  .listen(config.port, function (err, worker) {
    if (err) {
      return log.error(err.stack || e.message);
    }
    console.log('  Worker ' + worker.id + ' is ready');
  });
