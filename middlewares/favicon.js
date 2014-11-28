'use strict';

module.exports = function *(next) {
  if (this.path !== '/favicon.ico') {
    yield* next;
  }
};
