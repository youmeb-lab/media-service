'use strict';

var fs = require('fs');
var path = require('path');
var send = require('koa-send');
var safe = require('safe-stream');
var mkdirp = require('mkdirp');
var saveTo = require('save-to');
var thunkify = require('thunkify');
var config = require('../config');

var readdir = thunkify(fs.readdir);
mkdirp = thunkify(mkdirp);

exports.serve = function *() {
  yield send(this, this.parsedPath.path, {
    root: config.local.dir
  });
};

exports.save = function *(stream, filepath) {
  filepath = path.join(config.local.dir, filepath);
  yield mkdirp(path.dirname(filepath));
  yield saveTo(stream, filepath);
};

exports.url = function (filepath) {
  return config.local.baseUrl + '/local' + path.dirname(filepath);
};

exports.exists = function *(filepath) {
  filepath = path.join(config.local.dir, filepath);
  return yield function (cb) {
    fs.exists(filepath, function (exists) {
      cb(null, exists);
    });
  };
};

exports.list = function *(dir) {
  return yield readdir(dir);
};

exports.resize = function *(filepath, newfilepath, transform) {
  filepath = path.join(config.local.dir, filepath);
  newfilepath = path.join(config.local.dir, newfilepath);

  yield mkdirp(path.dirname(filepath));

  yield function (cb) {
    safe(fs.createReadStream(filepath))
      .pipe(transform)
      .pipe(fs.createWriteStream(newfilepath))
      .once('error', cb)
      .once('drain', cb)
      .once('finish', cb);
  };
};
