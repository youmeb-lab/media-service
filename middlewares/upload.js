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

  if (this.file.originalPath === '/') {
    this.status = 403;
    throw new Error('You can\'t upload media to \'/\'');
  }

  var stream = yield parse(this, {
    autoFields: true
  });

  yield this.file.save(stream);

  this.body = {
    storage: this.file.storageName,
    url: this.file.url
  };
};
