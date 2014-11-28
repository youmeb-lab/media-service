'use strict';

var path = require('path');
var normalize = require('path').normalize;
var File = require('../file');
var config = require('../config');

module.exports = function *(next) {
  var filepath = normalize(this.path);

  var data = {};
  var parts = filepath.replace(/^\/+/, '').split('/');

  data.storageName = parts.shift();
  data.size = this.size;
  data.dir = '/' + parts.join('/');

  var file = new File(data);

  if (!file.storage) {
    throw new Error(data.storageName + ' is not a available service.');
  }

  this.file = file;

  yield* next;
};
