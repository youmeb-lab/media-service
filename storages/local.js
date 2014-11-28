'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var send = require('koa-send');
var safe = require('safe-stream');
var mkdirp = require('mkdirp');
var saveTo = require('save-to');
var thunkify = require('thunkify');
var Storage = require('./storage');

var readdir = thunkify(fs.readdir);
mkdirp = thunkify(mkdirp);

module.exports = LocalStorage;

util.inherits(LocalStorage, Storage);

var proto = LocalStorage.prototype;

function LocalStorage(name, options) {
  options || (options = {});
  this.dir = options.dir;
  this.baseUrl = options.baseUrl;
  Storage.call(this, name);
}

proto.serve = function *(ctx) {
  yield send(ctx, ctx.file.path, {
    root: this.dir
  });
};

proto.save = function *(stream, filepath) {
  filepath = path.join(this.dir, filepath);
  yield mkdirp(path.dirname(filepath));
  yield saveTo(stream, filepath);
};

proto.url = function (filepath) {
  return this.baseUrl + '/local' + path.dirname(filepath);
};

proto.exists = function *(filepath, isThumb) {
  filepath = path.join(this.dir, filepath);
  return yield function (cb) {
    fs.exists(filepath, function (exists) {
      cb(null, exists);
    });
  };
};

proto.list = function *(dir) {
  return yield readdir(dir);
};

proto.resize = function *(filepath, newfilepath, transform) {
  filepath = path.join(this.dir, filepath);
  newfilepath = path.join(this.dir, newfilepath);

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
