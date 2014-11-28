'use strict';

var ipchecker = require('ipchecker');
var config = require('../config');

var read = ipchecker.create(config.accessControl
  && config.accessControl.read || []);

var write = ipchecker.create(config.accessControl
  && config.accessControl.write || []);

module.exports = function *(next) {
  var ip = this.ip === '::1' ? '127.0.0.1' : this.ip;
  ip = ip.replace(/^::ffff:/, '');

  if (this.method === 'POST' || this.method === 'PUT') {
    if (write(ip)) {
      yield* next;
      return;
    }
  } else if (this.method === 'GET' || this.method === 'HEAD') {
    if (read(ip)) {
      yield* next;
      return;
    }
  }

  this.status = 403;
  this.body = {
    error: '403 Forbidden'
  };
};
