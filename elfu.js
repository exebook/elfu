var fs = require('fs')
var convertor = require('./convert')
var mod = require('module')
var old_resolveFilename = mod._resolveFilename

var extraPaths = [process.cwd()]
module.exports.paths = extraPaths

module.exports.version = (function(){
	return JSON.parse(fs.readFileSync(__dirname+'/package.json')).version
})()


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



mod._resolveFilename = function(request, parent) {
	parent.paths = parent.paths.concat(extraPaths)
	return old_resolveFilename(request, parent)
}

