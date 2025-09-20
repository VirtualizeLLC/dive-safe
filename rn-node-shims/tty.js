// Minimal tty shim for React Native bundler
exports.isatty = function () {
  return false;
};

exports.ReadStream = function () {};
exports.WriteStream = function () {};
