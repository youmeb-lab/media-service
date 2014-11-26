'use strict';

var path = require('path');
var normalize = require('path').normalize;
var config = require('../config');
var storages = require('../storages');

module.exports = function *(next) {
  var filepath = normalize(this.path);

  var data = {};
  var parts = filepath.replace(/^\/+/, '').split('/');

  data.service = parts.shift();
  data.storage = storages[data.service];
  data.size = this.size;
  data.dir = '/' + parts.join('/');
  data.originalPath = path.join(data.dir, 'normal');
  data.path = path.join(data.dir, data.size);
  size(data);

  if (!data.storage) {
    throw new Error(data.service + ' is not a available service.');
  }

  this.parsedPath = data;

  yield* next;
};

function size(data) {
  var size = config.sizes[data.size];

  if (size) {
    size = size.split('x');
    data.width = size[0] | 0;
    data.height = size[1] | 0;
  }
}
