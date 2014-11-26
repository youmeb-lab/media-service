'use strict';

var parse = require('co-busboy');

module.exports = function *upload(next) {
  if (!(this.method === 'POST' || this.method === 'PUT')) {
    yield* next;
    return;
  }

  if (!this.request.is('multipart/*')) {
    yield next
    return;
  }

  if (this.parsedPath.path === '/') {
    this.status = 403;
    throw new Error('You can\'t upload media to \'/\'');
  }

  var file = yield parse(this, {
    autoFields: true
  });

  yield this.parsedPath.storage.save(file, this.parsedPath.path);

  this.body = {
    service: this.parsedPath.service,
    url: this.parsedPath.storage.url(this.parsedPath.path)
  };
};
