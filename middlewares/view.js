'use strict';

var sharp = require('sharp');

module.exports = function *(next) {
  if (this.method !== 'GET') {
    yield* next;
    return;
  }

  if (this.is('json')) {
    yield listImages.call(this, next);
  } else {
    yield sendFile.call(this, next);
  }
};

function *sendFile(next) {
  var parsed = this.parsedPath;
  var filepath = parsed.path;
  var exists = yield parsed.storage.exists(filepath);

  if (!exists) {
    if (parsed.size === 'normal') {
      yield* next;
      return;
    } else {
      var transform = sharp()
        .resize(parsed.width, parsed.height)
        .crop(sharp.gravity.center);

      yield parsed.storage.resize(
        parsed.originalPath,
        parsed.path,
        transform
      );
    }
  }

  yield parsed.storage.serve.call(this);
}

function *listImages(next) {
  this.body = yield this.parsedPath.storage.list(this.parsedPath.path);
}
