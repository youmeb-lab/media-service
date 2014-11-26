'use strict';

var cliopts = require('./cliopts');

module.exports = require(cliopts.config || './config.default');
