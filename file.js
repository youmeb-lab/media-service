'use strict';

var path = require('path');
var sharp = require('sharp');
var config = require('./config');
var storages = config.storages;
var sizes = config.sizes;

var DIR = Symbol('dir');
var SIZE = Symbol('size');
var CROP = Symbol('crop');
var WIDTH = Symbol('width');
var HEIGHT = Symbol('height');
var STORAGE = Symbol('storage');

module.exports = File;

function File(data) {
  data || (data = {});

  var size = sizes[data.size].split(':');
  
  this[CROP] = sharp.gravity[size[1]] || sharp.gravity['center'];
  size = size[0];

  if (size) {
    size = size.split('x');
    this[WIDTH] = size[0] | 0;
    this[HEIGHT] = size[1] | 0;
  }

  this[STORAGE] = storages[data.storageName];
  this[SIZE] = data.size;
  this[DIR] = data.dir;
}

File.prototype = {
  get storage() {
    return this[STORAGE];
  },

  get storageName() {
    return this.storage.name;
  },

  get size() {
    return this.width && this.height
      ? this[SIZE]
      : 'normal';
  },

  get dir() {
    return this[DIR];
  },

  get originalPath() {
    return this.getFilepath('normal');
  },

  get path() {
    return this.getFilepath();
  },

  get url() {
    return this.storage.url(this.path);
  },

  get isThumb() {
    return this.size !== 'normal';
  },

  get isOriginal() {
    return this.size === 'normal';
  },

  get width() {
    return this[WIDTH];
  },

  get height() {
    return this[HEIGHT];
  },

  getFilepath: function (size) {
    return path.join(this.dir, size || this.size);
  },

  exists: function *(size) {
    size || (size = this.size);
    var filepath = this.getFilepath(size);
    return yield this.storage.exists(filepath, size === 'normal');
  },

  save: function *(stream) {
    return yield this.storage.save(stream, this.path);
  },

  resize: function *() {
    var transform = sharp()
      .resize(this.width, this.height);

    config.metadata && transform.etadata();
    config.progressive && transform.progressive();
    config.quality && transform.quality(config.quality | 0);
    config.webp && transform.webp();
    transform.crop(sharp.gravity.center);

    return yield this.storage.resize(
      this.originalPath, this.path, transform);
  },

  getAvailableSizes: function *() {
    return yield this.storage.list(this.originalPath);
  },

  serve: function *(ctx) {
    return yield this.storage.serve(ctx);
  }
};
