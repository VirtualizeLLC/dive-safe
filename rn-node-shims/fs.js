// Minimal fs shim for React Native bundler
module.exports = {
  readFile: function (_path, _enc, cb) {
    if (typeof _enc === 'function') {
      cb = _enc;
    }
    cb(new Error('fs.readFile is not supported in React Native'));
  },
  existsSync: function () {
    return false;
  }
};
