'use strict';

var NAME = Symbol('name');

module.exports = Storage;

function Storage(name) {
  this[NAME] = name || 'unknown';
}

Storage.prototype = {
  get name() {
    return this[NAME];
  },
  serve: gnyi,
  save: nyi,
  url: nyi,
  exists: gnyi,
  list: nyi,
  resize: gnyi
};

function nyi() {
  throw new Error('Not yet implemented');
}

function *gnyi() {
  throw new Error('Not yet implemented');
}
