'use strict';

var path = require('path');
var nopt = require('nopt');

var knownOpts = {
  config: path
};

var shortHands = {
  'c': ['--config']
};

module.exports = nopt(knownOpts, shortHands, process.argv, 2);
