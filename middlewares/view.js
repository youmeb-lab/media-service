'use strict';

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
  var file = this.file;
  var exists = yield file.exists();

  if (!exists) {
    if (file.isOriginal) {
      yield* next;
      return;
    } else {
      yield file.resize();
    }
  }

  yield file.serve(this);
}

function *listImages(next) {
  this.body = yield this.file.getAvailableSizes();
}
