'use strict';

var fs = require('fs');
var path = require('path');
var pkg = require('../package');

var indexFile = path.join(__dirname, '..', 'index.html');
var html = fs.readFileSync(indexFile, 'utf8')
  .replace(/{{(.*?)}}/g, function (_, key) {
    return pkg[key.trim()] || key;
  });

module.exports = function *(next) {
  if (this.path === '/' && this.method === 'GET') {
    this.type = 'html';
    this.body = html;
  } else {
    yield* next;
  }
};
