'use strict';

var path = require('path');
var bunyan = require('bunyan');
var config = require('./config');

module.exports = bunyan.createLogger({
  name: 'media-service',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'error',
      path: path.join(config.logDir, 'error.log'),
      count: config.logBackCopies
    }
  ]
});
