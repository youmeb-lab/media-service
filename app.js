'use strict';

var app = require('koa')();
var gzip = require('koa-gzip');
var etag = require('koa-etag');
var cluster = require('koa-cluster');
var conditional = require('koa-conditional-get');
var config = require('./config');
var errorHandler = require('./middlewares/error-handler');
var mobileDetect = require('./middlewares/mobile-detect');
var parsePath = require('./middlewares/parse-path');
var favicon = require('./middlewares/favicon');
var upload = require('./middlewares/upload');
var view = require('./middlewares/view');
var home = require('./middlewares/home');
var log = require('./logger');

Object.defineProperty(app.context, 'size', {
  get: function () {
    return this.mobileSize
      || this.query.size
      || 'normal';
  }
})

app.use(errorHandler);
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
