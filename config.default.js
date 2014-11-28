'use strict';

var path = require('path');

module.exports = function (config, storages) {
  config.port = process.env.MEDIA_SERVICE_PORT || 80;
  config.autoRestart = true;

  // access control
  config.enableAccessControl = true;
  config.accessControl = {
    // [ '192.168.*.*', '127.0.0.1' ]
    write: [ '127.0.0.1' ],
    read: [ '127.0.0.1' ]
  };

  // log
  config.logDir = process.env.MEDIA_SERVICE_LOG_DIR || path.join(__dirname, 'log');
  config.logBackCopies = process.env.MEDIA_SERVICE_LOG_BACK_COPIES || 3;

  // size
  config.sizes = {
    'small-avatar': '16x16',
    'avatar': '120x120',
    'big-avatar': '240x240'
  };

  // mobile detect
  config.enableMobileDetect = true;
  config.mobileSizes = {
    phone: {
      'avatar': 'small-avatar',
      'big-avatar': 'avatar'
    }
  };

  // storages
  var localStorage = new storages.LocalStorage('local', {
    baseUrl: 'http://localhost',
    dir: path.join(__dirname, 'medias')
  });

  config.storages = [
    localStorage
  ];
};
