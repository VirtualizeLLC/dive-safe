exports.basename = function (p) {
  if (!p) return '';
  var parts = p.split('/');
  return parts[parts.length - 1];
};

exports.join = function () {
  return Array.prototype.join.call(arguments, '/');
};
