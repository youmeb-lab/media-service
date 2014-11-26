'use strict';

var path = require('path');
var c = module.exports;

c.port = process.env.MEDIA_SERVICE_PORT || 80;
c.autoRestart = true;

// log
c.logDir = process.env.MEDIA_SERVICE_LOG_DIR || path.join(__dirname, 'log');
c.logBackCopies = process.env.MEDIA_SERVICE_LOG_BACK_COPIES || 3;

// size
c.sizes = {
  'small-avatar': '16x16',
  'avatar': '120x120',
  'big-avatar': '240x240'
};

// local
c.local = {
  baseUrl: 'http://localhost:8080',
  dir: path.join(__dirname, 'medias')
};

// mobile detect
c.enableMobileDetect = true;
c.mobileSizes = {
  phone: {
    'avatar': 'small-avatar',
    'big-avatar': 'avatar'
  }
};
