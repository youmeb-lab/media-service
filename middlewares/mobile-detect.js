'use strict';

var MobileDetect = require('mobile-detect');
var config = require('../config');

module.exports = function *(next) {
  if (!(this.method === 'GET'
    && config.enableMobileDetect
    && config.mobileSizes)) {
    yield* next;
    return;
  }

  var md = new MobileDetect(this.request.get('user-agent'));
  var mobileConfig;

  if (!md.mobile()) {
    yield* next;
    return;
  }

  // phone
  mobileConfig = config.mobileSizes.phone
    || config.mobileSizes.tablet;

  if (md.phone() && mobileConfig) {
    this.mobileSizes = mobileConfig[this.size];
    yield* next;
    return;
  }

  // tablet
  mobileConfig = config.mobileSizes.tablet;

  if (md.tablet() && mobileConfig) {
    this.mobileSizes = mobileConfig[this.size];
  }

  yield* next;
};
