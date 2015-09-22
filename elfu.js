module.exports.version = '0.0.12'

var fs = require('fs')
var convertor = require('./convert')

loadFile = function loadFile(module, filename) {
	var raw, s
	raw = fs.readFileSync(filename, 'utf8')
	s = raw.charCodeAt(0) === 0xFEFF ? raw.substring(1) : raw
	if (s[0] == '#' && s[1] == '!') {
		var i = s.indexOf('\n')
		s = s.substr(i)
	}
	var t = filename
	var yy = convertor.elfuConvert('module.paths.push(".");'+s, filename)
	var R = module._compile(yy, filename)
	return R
}

if (require.extensions) {
   require.extensions['.yy'] = loadFile
   require.extensions['.dc'] = loadFile
}
module.exports.require = function elfuRequire(f) {
	loadFile(module, f)
}
module.exports.convert = convertor.elfuConvert
module.exports.userSym = convertor.userSym
module.exports.handleExt = function handleExt(ext) {
	if (require.extensions) {
	   require.extensions[ext] = loadFile
	}
}

