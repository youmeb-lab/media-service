'use strict';

var cliopts = require('./cliopts');
var storages = require('./storages');

var configWrapper = require(cliopts.config || './config.default');
var config = module.exports;

config.storages = [];

configWrapper(module.exports, storages);

config.storages = config.storages.reduce(function (map, storage) {
  map[storage.name] = storage;
  return map;
}, {});
