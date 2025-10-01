exports.basename = (p) => {
	if (!p) return ''
	var parts = p.split('/')
	return parts[parts.length - 1]
}

exports.join = () => Array.prototype.join.call(arguments, '/')
