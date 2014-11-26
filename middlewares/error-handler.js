'use strict';

var log = require('../logger');

module.exports = function *errorHandler(next) {
  try {
    yield* next;
  } catch (e) {
    var msg = process.env.NODE_ENV === 'production'
      ? e.message
      : (e.stack || e.message);

    if (this.status === 404) {
      log.error(msg);
      this.status = 500;
    }
    
    this.body = {
      error: msg
    };
  }
};
