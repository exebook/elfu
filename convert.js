var ELFU_VERSION = require(__dirname+'/package.json').version

function replaceCompilerVars(s, prefix) {
	var n = 1, x = 0, L = s.length, Q = []
	for (var x = 0; x < L; x++) {
		if (s[x] == '\n') n++
		if (s[x] == 'ロ' && s[x + 1] == '`') Q.push(n)
	}
	s = s.split('ロ`')
	for (var x = 1; x < s.length; x++) {
		s[x] = '\''+prefix +':'+ Q[x-1] + '\', ' + s[x]
	}
	return s.join('ロ')
}

function processIncludes(s, fileName) {
	var R = []
	s = replaceCompilerVars(s, fileName)
	s = s.split('\n')
	for (var i = 0; i < s.length; i++) {
		if (s[i].indexOf('include ') == 0) {
			var name = s[i].substr(8)
			if (name.indexOf('.') < 0) name += '.yy'
			//name = __dirname + '/' + name
			if (!require('fs').existsSync(name)) {
				console.log('Elfu unable to include', name)
				process.exit(1)
			}
			var included = require('fs').readFileSync(name).toString()
			included = replaceCompilerVars(included, name)
			R = R.concat(included)
		}
		else
			R.push(s[i])
	}
	return R.join('\n')
}

/*
TODO:
 -------- lexer -------
 bug: '⬠ 0.5' -- compiles as 'Math.round(0).5'
 -------- jyy -------
L[L ↥ - 1] ꕉ
	bug: ⌥ (⬤ tail ≟ 'string') flowꕉ += t
	converts to: if (typeof  (tail )== 'string') flow[(typeof  (tail )== 'string') flow.length
 -------- convert -----
a, b, c ꔪ D ----> a = D[0], b = D[1], c = D[2]
a, b, c ꔪ D ----> a = D.a, b = D.b, c = D.c
A, B, C ∆ []  ---->  var A = [], B = [], C = []
"(,,)" ---> replace with "(undefined,undefined,undefined)"
⌥ a { ロ b ⦙ }  -->  no need for ⦙ obviously
concat allow ꗚ[]
add [-1] [-2] [-3]
remove ⊜ (or change)
if... {} // DONE
☛(⚪) {} -> ☛ ... {} // is this done?
remove commas f(a,b,c) = f(a b c)
add ➮ as <= (global func)
add ➮ as --> (anonymous func)
desctrucive assignment a <=- b EQUALS a = b; delete b;
other assignments:
	a ?= b; if (b) a = b
	a =< b, a => b  if(a<b)a=b
❄(➮{}) make as ❄➮{} or even ❄{}

isolated namespaces:
❄{
	s ∆ ''
}
;(function {
	var s = ''
})()

ещё более улучшеный this:
⚫a = ⚫b 	можно же записать просто .a = .b

allow: ❄() -> ❄

---('cangive', ---) // replace tokens from previous line


x ⌶= 'a b c'  -> x = 'a b c'⌶' '
 ----- typing ------
 change la to .la (ꕉ), le to .le
 
 --- bugs ---------
	ロ ꗌcurrent ≟ ꗌexpected
	translates to:
	console.log(JSON.stringify(current==JSON.stringify(expected)) 
---- theory fro future ----
have a outer function return statement in the inner function
➮ a {
	➮ b {
		ロ 'error'
		$$ ⦾
	}
	❰error❱ b() // will return ⦾ from both b() and a() imediately
	maybe it is stupid, why not $b()?
	$ ⦿
}
---- call operator -> ----
test('p=zzz u=name po=888', 'user id password port phone',
	{ password: 'zzz', user: 'name', port: '888' })

test ->
	'u=name 2 po=888 p=zzz'
	'user id password port'
	{ user: 'name', port: '888', password: 'zzz', id: '2' }

парсинг функций: запятая добавляется только если строка на том же уровне отступа плюс за ней идёт строка на том-же уровне отступа. скобка вызова ставиться по завершении уровня отступа (шаге влево)

test ->
	'u=name 2 po=888 p=zzz'
	'user id password port'
	sub ->
		2 + 2
		'result'
	➮ f {
		ロ a
	}
	{ user: 'name', port: '888', password: 'zzz', id: '2' }
------------------

*/


module.exports.elfuConvert = elfuConvert
module.exports.userSym = userSym

var PREFIX = 'DOTCALL', callNumber = 1, lex = require('./lexer.js')

var userReplace = [
	{ find:'__elfuver', repl: "'"+ELFU_VERSION+"'" },
	{ find:'⚑', repl:'process.exit(1)' },
	{ find:'☛', repl:'with', type:'auto' },
	{ find:'ꗌ', repl:'JSON.stringify', type:'auto' },
	{ find:'ꖇ', repl:'JSON.parse', type: 'auto' },
	{ find:'⛁', repl:'fs.readFileSync',  type: 'auto' },
	{ find:'⛃', repl:'fs.writeFileSync' },
	{ find:'⚡', repl:'(new Date().getTime())' },
	{ find:'∼◬', repl:'String.fromCharCode', type:'auto'}, 
	{ find:'⚷', repl:'Object.keys', type:'auto'}, 
	{ find:'ꘉ', repl:'.bind', type: 'auto'},
	{ find:'√', repl:'Math.sqrt', type: 'auto'},
	{ find:'↵', repl:'/\\n/g'},
//	{ find:'⁋', repl:'/\\r/g'},
	{ find:'↵⁋', repl:'/\\n\\r/g'},
	{ find:'ꘉ', repl:'bind', type: 'auto'},
	{ find:'__argarr', repl:'Array.prototype.slice.apply(arguments)'},
	{ find:'**', repl:'arguments.callee.'}, // ** is temporary, find a better char
	
// lenin prototype support:
	{ find:'', repl:'stroi', type:'lenin'},
	{ find:'', repl:'riad', type: 'lenin'},
	{ find:'', repl:'poniatie', type: 'lenin'},
	{ find:'', repl:'gorenie', type: 'lenin'},
	{ find:'', repl:'deistvie', type: 'lenin'},
	{ find:'', repl:'soznanie', type: 'lenin'},

//	{ find:'', repl:''},
//leninLexerSyms = '→ → ↑ ↓                                        '

]

function userSym(sym, id, type) {
	userReplace.push({ find:sym, repl:id, type:type })
}
module.exports.userReplace = userReplace

var ovar = 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ'
for (var i = 0; i < ovar.length; i++) userSym(ovar[i], '_oo_'+i)
function getId() {
	callNumber++
	return ''+PREFIX+callNumber
}

function elfuConvert(s, fileName) {
	var R
	function replaceIndex() {
		for (var i = 0; i < userReplace.length; i++)
			elfuLexerSyms += ' ' + userReplace[i].find
//		userSym('⏚', 'sendCallback')
//		userSym('☎', 'dispatcher')
//		userSym('✚', 'viewCounter.')
		var ix = '⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʱʳˢᵗᵘᵛʷˣʸᶻ',
			re = '0123456789abcdefghijklmnopqrstuvwxyz'
		R = lex.lex(s)
		for (var i = 0; i < ix.length; i++) simpleReplace(R, ix[i], '['+re[i]+']','index')
	}
	function replaceUser() {
		var a = userReplace
		
		// using index is a real dirty hack
		var t = '❶❷❸❹❺❻❼❽❾❿', d = '①②③④⑤⑥⑦⑧⑨⑩'
		{
			for (var i = 0; i < a.length; i++)
				if (a[i].type == 'auto')
					autoArg(R, a[i].find, a[i].repl, 'id')
				else if (a[i].type == 'lenin')
					leninArg(R, a[i].find, a[i].repl, 'id')
				else
					simpleReplace(R, a[i].find, a[i].repl, 'id')
			for (var i = 0; i < t.length; i++) {
				var t1 = t[i], d1 = d[i]
				simpleReplace(R, t1, ';var var'+ i +' = ')
				varReplace(R, d1, 'var'+ i, 'id')
			}
		}
	}
	replaceIndex()
	s = processIncludes(s, fileName)
	processStringArrays(R)//before findLog
	findLog(R, 'ロ')
	replaceUser()
	findVar(R)
	findDefineIfUndefined(R)
//	autoArg(R, 'ロロ', 'process.stdout.write')
	findStdoutWrite(R, 'ロロ')
//	findLog(R, '#')
	findStrEqu(R, '≈', '=')
	findStrEqu(R, '∼', '==')
	findStrEqu(R, '≁', '!=')
	simpleReplace(R, 'ꔬ', '.filter')
	simpleReplace(R, '⧉', '.map')
	simpleReplace(R, '❄', '.sort')
	simpleReplace(R, '⩪', '.substr') // TODO: doubleArg
// 	simpleReplace(R, '≂', '.toString')
	simpleReplace(R, '⦙', ';')
	simpleReplace(R, '♻', 'continue;')
	simpleReplace(R, '⚂', 'Math.random()')
	simpleReplace(R, '⚪', 'this') // remove it, use autoDotAfter
	simpleReplace(R, '⚫', 'this.')
	simpleReplace(R, '⟡', 'new ')
	simpleReplace(R, '⏀', 'delete ')

//	simpleReplace(R, '', '')
	simpleReplace(R, '⊜', '= 0')
	processIf(R, '⌥', 'if')
	processIf(R, '⥹', 'else if')
	processIf2(R)
	simpleReplace(R, '⧗', 'for')
	processIf(R, '⧖', 'while')
	simpleReplace(R, '∞', 'while(true)')
	simpleReplace(R, '⬈', '.pop()')
	simpleReplace(R, '⬉', '.shift()')
	simpleReplace(R, '⬍', '.forEach')
	simpleReplace(R, '⦾', 'false')
	simpleReplace(R, '⦿', 'true')
	simpleReplace(R, '≠', '!=')
	simpleReplace(R, '≟', '==')
	simpleReplace(R, '⌚', 'setInterval')// TODO: doubleArg similar to autoArg
	simpleReplace(R, '⌛', 'setTimeout')
	simpleReplace(R, '⎇', 'else ')
	simpleReplace(R, '↥', '.length')
	simpleReplace(R, '∅', 'undefined')
	simpleReplace(R, '"∅"', '"undefined"')
	simpleReplace(R, "'∅'", "'undefined'")
	simpleReplace(R, '∇', 'var ')
	simpleReplace(R, '$', 'return ')
	simpleReplace(R, '@', 'break')
	autoArg(R, 'ꗚ', '.concat')
	autoArg(R, '△', '.charAt')
	autoArg(R, '◬', '.charCodeAt')
	autoArg(R, '⌶', '.split')
	autoArg(R, '⫴', '.join')
	autoArg(R, '≂', '.toString')
	autoArg(R, '≀', '.indexOf')
	autoArg(R, '≀≀', '.lastIndexOf')
	autoArg(R, '⋃', '.slice')
	autoArg(R, '⨄', '.splice')
	autoArg(R, '★', 'parseInt')
	autoArg(R, '⬠', 'Math.round')
	autoArg(R, '⍽', 'Math.floor')
	autoArg(R, '⬤', 'typeof ')
	autoArg(R, '⌿⌚', 'clearInterval')
	autoArg(R, '⌿⌛', 'clearTimeout')
	autoArg(R, '⬊', '.push')
	autoArg(R, '⬋', '.unshift')
	autoArg(R, '≣', 'require')
	findIsUndefined(R)
	findLast(R)
	findColon(R, '➮', 'function')
	var t = joinAdd(R)
	R = lex.lex(t)
	findMacros(R)
	findTuples(R, 'ꔪ')
	findEachs(R, handleEach, '⬌')
	findEachs(R, handleIterator, '►')
	findDotCalls(R, handleCall)
	findSettings(R)
	autoExports(R)
	return lex.join(R, false)
}

function loc(n) {
	if (n != undefined) return arguments.callee.caller[n]
	return arguments.callee.caller
}

//TODO: replace with loc()
var setFuncs = {}

//namespace = {}

function xeval (s) {
	return eval(s)
}

function findSettings (A) {
	var i = next(A, -1)
	while (i >= 0) {
		if (A[i].s == '⚙') {
			var n = next(A, i+1)
			if (A[n].s == '{') {
				// direct code exec
				var e = getEnd(A, n + 1)
				var s = lex.join(A.slice(n+1, e))
				xeval(s)
			} else {
				var max = 5
				var x = n
				var args = []
				while (true) { // parse args
					if (max-- <0) break
					var x = next(A, x)
					if (!x) {
						break
					}
					if (A[x].type == 'id'||A[x].type == 'str') {
						var ar = A[x].s
						if (A[x].type == 'str') ar = xeval(ar)//unescape etc
						args.push(ar)
					} else if (A[x].type == 'num'||A[x].type == 'hexnum') {
						var ar = A[x].s
						args.push(parseInt(ar, A[x].type == 'num'?10:16))
					} else if (A[x].type == 'line') {
						var e = x-1
						break;
					} else if (A[x].s == '(') {
						var e = getNameRight(A, x-1)
						var src = lex.join(e[0])
						args.push(xeval(src))
						e = e[1]
						x = e-1
					} else if (A[x].s == '{') {
						var e = getEnd(A, x + 1)
						var body = lex.join(A.slice(x+1, e))
						args.push(body)
						break
					} else if (A[x].type == 'sym') {
						args.push(A[x].s)
					} else break;
				}
				var fn = A[n].s
				if (global[fn]) global[fn].apply(this, args)
				else console.log('function undefined:', fn)
			}
			while (i <= e) {
				if (!A[i]) break
				A[i].type = 'space'
				A[i].s = ''
				i++
			}
			var i2 = i
			while (A[i2] && A[i2].type == 'line') {
				A[i2].s = ''
				i2++
			}
		}		
		i = next(A, i)
	}
}

function trimStr(str) {
	return str.replace(/^\s+|\s+$/g,"");
}

function handleFor(A, i) {
	var forId = getId(), argId = getId()
	var start = i - 1
	var args = getArgs(A, i + 1)
	var block = args.b + 2; while (A[block].s != '{') block++
	var endFor = getEnd(A, block+1)
	var endUp = getEnd(A, endFor+1)
	var fors = lex.join(A.slice(args.a, args.b + 1)).split(';')
	for (var ff = 0; ff < 3; ff++) fors[ff] = trimStr(fors[ff])
	if (fors[1] == '') fors[1] = 'true'
	for (var x = block; x < endFor; x++) if (A[x].s == 'break')
		A[x].s = '{ '+argId+'(); return }'
	A.splice(endUp, 0, {type:'re', s:'}'},{type:'re', s:')'})
	insertStart()
	exitFor()
	function exitFor() {
		A[endFor+1].add = ['\n\t'+forId+'(function() {']
		A.splice(endFor, 0,{type:'re',
		s:'  '+fors[2]+'; setImmediate('+forId+', '+argId+')\n\t'})
	}
	function insertStart() {
		for (var x = start; x <= args.b + 1; x++) A[x].s = ''
		A[args.a].s = fors[0] + '; function '+forId+'('+argId+') '
		A[args.a+1] = A[block]
		A[block] = {type:'re',s:'\n\t\tif ((' + fors[1] + ') == false)'+
			' { '+argId+'(); return }'}
	}
}

function handleWhile(A, i) {
	var args = getArgs(A, i + 1)
	for (var x = args.a; x <= args.b; x++) A[x].s = ''
	A.splice(args.a, 0,
		{type:'re',s:';'},
		{type:'re',s:args.txt},
		{type:'re',s:';'})
	handleFor(A, i)
}

function handleEach1(A, i) {
	var e = A.length, fun = 0, a = i
	A[i].s = 'for'
	while (i < e && A[i].s != '(') i++
	a = i+1
	while (i < e) {
		var c = A[i]
		if (c.s == ')') if (fun > 1) fun--; else break
		if (c.s == '(') fun++
		i++
	}
	var args = lex.join(A.slice(a, i)).split(',')
	args[0] = trimStr(args[0]), args[1] = trimStr(args[1])
	for (var x = a; x < i; x++) A[x].s = ''
	A[a-1].s = '(var '+args[0]+' = 0; '
		+args[0]+' < '+args[1]+'.length; '+args[0]+'++'
}

function lastOf(obj) { return obj[obj.length - 1] }

function handleCall(A, i) {
	var name = getNameLeft(A, i - 1)
	var nameStr = lex.join(A.slice(name.a, name.b + 1))
	if (nameStr == 'for') {	handleFor(A, i); return	}
	if (nameStr == 'while') { handleWhile(A, i); return	}
	var line = getLine(A, i)
	var args = getArgs(A, i + 1)
	var end = getEnd(A, i)
	var comma = ''; if (args.txt!='') comma = ', '
	A[line].s = A[line].s+''+nameStr+'('+args.txt+comma+'function ('+args.C.join(',')+') { '
	for (var i = name.a; i < args.b + 2; i++) A[i].s = ''
	A[name.a].s = args.N+''
	if (!A[end].add) A[end].add = []
	A[end].add.push('})')
}

function getLine(A, i) {
	while (i-- > 0) {
		if (A[i].type == 'line' || A[i].s == '{') {
			while (A[i + 1].type == 'space') i++
			return i
		}
	}
}

function getNameLeft(A, i) {
	var fun = 0, arr = 0, b = i
	while (i > 0) {
		var c = A[i]
		if (fun > 0) {
			if (c.s == '(') fun--; else if (c.s == ')') fun++
		}
		else if (arr > 0) {
			if (c.s == '[') arr--; else if (c.s == ']') arr++
		}
		else if (c.s == ')') fun++
		else if (c.s == ']') arr++
		else if (c.s == '.') ;
		else if (c.s == 'this.') ; // bad hack
		else if (c.type == 'id') ;
		else if (c.type == 'space') ;
		else if (c.s[0] == '[' && c.s[c.s.length-1] == ']') ; //ᵃ⁰
		else break
		i--
	}
	i++
	while (A[b].type == 'space') b--
	while (A[i].type == 'space') i++
	return {a:i,b:b}
}

function getArgs(A, i) {
	var e = A.length, fun = 0, a = i
	while (i < e) {
		var c = A[i]
		if (c.s == ')') if (fun > 0) fun--; else break
		if (c.s == '(') fun++
		i++
	}
	var R = {a:a, b:i-1, N:''}, e = i, C = [], on = false
	for (var x = a; x < i; x++) {
		if (on && (A[x].type == 'id' || A[x].type == 'num')) C.push(A[x].s)
		else if (A[x].s == '::') on = true, e = x
	}
	R.txt = lex.join(A.slice(a, e))
	if (C.length == 1) {
		var Q = parseInt(C[0])
		if (Q > 0) {
			C = []
			while(Q-- > 0)
				C.push(getId())
			R.N = C[C.length-1]
		}
	} else if (C.length == 0) {
		R.N = getId()
		C.push(R.N)
	}
	R.C = C
	return R
}

function joinAdd(A) {
	var R = []
	for (var i = 0; i < A.length; i++) {
		var s = A[i].s, a = A[i].add
		if (a) s = a.join(' ') + ' '+ s
		R.push(s)
	}
	return R.join('')
}

function findDotCalls(A, f) {
	for (var i = 0; i < A.length; i++) {
		if (A[i].s == '.(') f(A, i)
		if (A[i].add) A[i].s = A[i].add.join(' ') +' '+ A[i].s
	}
}

function addTo(X, s) {
	if (!X.add) X.add = []
	X.add.push(s)
}

function next(A, i) {
	var e = A.length
	while (++i < e) {
		 if (A[i].type != 'space') return i
	}
}

function prev(A, i) {
	while (--i >= 0) {
		if (A[i].type != 'space') return i
	}
}

function nextl(A, i) {
	var e = A.length
	while (++i < e) {
		 if (A[i].type != 'space' && A[i].type != 'line') return i
	}
}

function prevl(A, i) {
	while (--i >= 0) {
		if (A[i].type != 'space' && A[i].type != 'line') return i
	}
}


function simpleReplace(A, find, replace, type) {
	for (var i = 0; i < A.length; i++) {
		if (A[i].s == find) {
			A[i].s = replace
			if (type) A[i].type = type
		}
	}
}

function varReplace(A, find, replace, type) {
	for (var i = 0; i < A.length; i++) {
		if (A[i].s == find) {
			var b = next(A, i)
			var c = prev(A, i)
			var t = ''
			if ((A[b].type == 'id') && (!c || (A[c].s != '⬌'))) t='.'
			A[i].s = replace + t
			if (type) A[i].type = type
		}
	}
}

function findLog(A, find) {
	function validAutoPlusBefore(a) {
		if (a.type == 'id' || a.type == 'num') return true
		var Y = {'↥':1,'↟':1,'ꕉ':1,']':1,')':1,'}':1,'⁰':1}
		if (a.type == 'index') return true
		if (a.type == 'sym' && Y[a.s] == 1) return true
		return false
	}
	function validAutoPlusAfter(a) {
		if (a.type == 'id' || a.type == 'num') return true
		var Y = {'ꗌ':1,'↥':1,'↟':1,'ꕉ':1,'⁰':1, '(':1,'[':1,'{':1}
		if (a.type == 'index') return true
		if (a.type == 'sym' && Y[a.s] == 1) return true
		return false
	}
	for (var i = 0; i < A.length; i++) {
		if (A[i].s == find) {
			var I = i
			A[i].s = 'console.log('
			while (A[i] && A[i].type != 'line' && A[i].s != ';' && A[i].s != '⦙') i++
			
			if (!A[i]) A[i] = {type:'repl',s:')'}
			else addTo(A[i], ')')
			// iterate forward, replace ['' x ''] with  [''+x '']
			for (var x = I; x < i; x++) {
				if (A[x].type == 'str') {
					x++; if (x == i) break;
					while (A[x].type == 'space') x++
					if (x >= i) break;
					if (validAutoPlusAfter(A[x])) {
						var delim = '+'
						if (A[x].s == '{') delim = ','
						addTo(A[x], delim)
					}
				}
			}
			// iterate backward, replace ['' x ''] with  ['' x+'']
			for (var x = i; x >= I; x--) {
				if (A[x].type == 'str') {
					var x2 = x
					x--; if (x < I) break;
					while (A[x].type == 'space') x--
					if (x < I) break;
					if (validAutoPlusBefore(A[x])) {
						var delim = '+'
						if (A[x].s == '}') delim = ','
						addTo(A[x2], delim)
					}
				}
			}
			
			for (var space = I; space < i; space++) {
				if (A[space].type == 'space') A[space].s = ''
			}
		}
	}
}

function findStdoutWrite(A, find) {
	for (var i = 0; i < A.length; i++) {
		if (A[i].s == find) {
			A[i].s = 'process_stdout_write_multi('
			while (A[i] && A[i].type != 'line' && A[i].s != ';' && A[i].s != '⦙') i++
			if (!A[i]) A[i] = {type:'repl',s:')'}
			else addTo(A[i], ')')
		}
	}
}

function findStrEqu(A, sym, js) {
	// TODO: capture more than one token
	for (var i = 0; i < A.length - 1; i++) {
		if (A[i].s == sym) {
			var a = next(A, i), o = A[a]
			if (o.type == 'id' || o.type == 'num' || o.type == 'sym') {
				A[i].s = js
				o.s = '"' + o.s + '"'; i++
			} else if (o.type == 'str') {
				A[i].s = js
			}
		}
	}
}

function findLast(A) {
//TODO: not working in the beginning of file.
//TODO: maybe replace a.b.c[a.b.c.length - 1] with:
// getLast(a.b.c)
	for (var i = 1; i < A.length - 1; i++) {
		if (A[i].s == '↟') {
			var R = getNameLeft(A, i - 1)
			addTo(A[R.a], '(')
			A[i].s = '.length - 1)'
		} else if (A[i].s == 'ꕉ') {
			var R = getNameLeft(A, i - 1)
			var s = lex.join(A.slice(R.a, R.b + 1))
			A[i].s = '['+s+'.length - 1]'
		}
	}
}

function findIsUndefined (A) {
	for (var i = 1; i < A.length - 1; i++) {
		if (A[i].s == '⟑') {
			var R = getNameRight(A, i + 1)
			A[i].s = '(typeof '
			A[R[1]-1].s += ' != "undefined")'
		}
	}

}
/*
➮ a (f) {}
➮ a f {}
➮ () {}
➮ {}
➮ (f) {}
➮ a + b ; // BECOMES ((➮ { $a+b }).bind(this))
➮ - a b {} // anonymous function (a, b)
*/
function findColon(A, find, replace) {
	
	function DUMP(start, count) {
		console.log('--------DUMP---------\n')
		for (var i = start; i < start+count; i++) {
			process.stdout.write('(' + A[i].s + '), ')
		}
		console.log('\n-----------------')
	}
	
	for (var i = 0; i < A.length; i++) {
		if (A[i].s == find && ((i > 0 &&
			(A[i-1].type != 'id' && A[i-1].type != 'str')) || i == 0)) {
				var I = i
				A[i].s = replace+' '
				var b = i
				while (true) {
					b = next(A, b)
					if (A[b].s == '{') break
					if (A[b].s == ';'||A[b].s == '⦙') {
						addTo(A[i], '((')
						addTo(A[i+1], '(a,b,c){ return ')
						A[b].s = '}).bind(this))'
						return
					}
				}
				var firstArg = next(A, i), anonymous = false
				if (A[firstArg].s == '-') {
					i = firstArg
					A[firstArg].s = ''
					A[firstArg].type = 'space'
					anonymous = true
				}
				i = next(A, i)
				var ids = [], name = undefined
				while (A[i].type == 'id') {
				
					if (!anonymous && name == undefined)
						name = A[i].s
					else 
						ids.push(A[i].s)
						
					if (name || anonymous) A[i].s = ''
					i = next(A, i)
				}
				if (name) addTo(A[i], name)

				if (ids.length > 0 || anonymous) {
					var s = '(' + ids.join(',') + ')'
					addTo(A[i], s)
				} else if (A[i].s == '{') addTo(A[i], '(a,b,c)')
				for (var space = I; space < i; space++) {
					if (A[space].type == 'space') A[space].s = ''
				}
			}
	}
}

function handleEach(A, i) {
	var a = i
	var counter = A[prev(A, i)].s
	A[prev(A, i)].s = ''
	i++
//	i ⬌ a { x++ }
//	for (var i = 0; i < a.length; counter++)
	var R = getNameRight(A, i), array = lex.join(R[0]), i = R[1]
	for (var x = a; x < i; x++) A[x].s = ''
	A[a].s = 'for(var '+counter+' = 0; '+counter+' < '+array+'.length; '+counter+'++)'
}

function handleIteratorOld(A, i) {
/*
	var a = i
	var c = A[prev(A, i)].s // c is iterator item, c+_ is counter
	A[prev(A, i)].s = ''
	i++
	// i ► a { x++ }
	// for (n_ ∆ 0, x = a[n_]; n_ < a↥; n_++, x = a[n_])
	var R = getNameRight(A, i), array = lex.join(R[0]), i = R[1]
	for (var x = a; x < i; x++) A[x].s = ''
	A[a].s = 'for(var '
		+ c + '_=0,'
		+ c + '=' + array + '[' + c + '_]; '
		+ c + '_<' + array + '.length; '
		+ c + '_++,' +c+ '=' + array + '['+c+'_])'
	*/
}

function handleIterator(A, i) {
	var a = i
	var c = A[prev(A, i)].s // c is iterator item, c+_ is counter
	A[prev(A, i)].s = ''
	i++
	// n ► N { x++ }
	// for (n_ ∆ 0; n_ < a↥; n_++)
	// { n -> N[n] }
	var R = getNameRight(A, i), array = lex.join(R[0]), i = R[1]
	for (var x = a; x < i; x++) A[x].s = ''
	A[a].s = 'for(var '+ c +'_=0; '+ c +'_<'+ array +'.length; '+ c +'_++) '
	while (true) {
		if (A[i].type != 'space' && A[i].type != 'line') {
			if (A[i].s == '{') {
				var e = getEnd(A, i+1)
				for (var x = i+1; x < e; x++) {
					if (A[x].s == c) A[x].s = array + '[' + c + '_]'
				}
				i = e+1
			}
			else {
				var e = getEnd(A, i+1)
				for (var e = i+1; e < A.length; e++)
					if (A[e].type == 'line') {
						break
					}
				
				for (var x = i; x < e; x++) {
					if (A[x].s == c) A[x].s = array + '[' + c + '_]'
				}
				i = e+1
//
//				console.log('\nFATAL ERROR ► requires {')
//				var s = [], lineno = 1, linepos = -1
//				for (var x = 0; x < i; x++) if (A[x].type == 'line') lineno++, linepos = x
//				if (linepos >= 0) A[linepos].s = lineno + ')'
//				A[i].s = '^' + A[i].s
//				var a = linepos >= 0? linepos:i - 5, b = i + 10
//				A = A.slice(a, b)
//				s = lex.join(A)
//				var e = s
//				s = s.replace('^', '')
//				var t = ''
//				for (var i = 0; i < e.length; i++) {
//					if (e[i] != '^') t += ' '
//					else t += color(196)+'^'+color(7)
//				}
//				console.log(s)
//				console.log(t)
//				process.exit()
			}
			break
		}
		i = next(A, i)
	}
}

function findEachs(A, f, sym) {
	var i = next(A, 0)
	i = next(A, i)
	for (; i < A.length; i++) {
		if (A[i].s == sym) f(A, i)
	}
}

function findVar(A) {
	for (var i = 1; i < A.length; i++) {
		if (A[i].s == '∆') {
			var q = prev(A, i)
			var brace = prev(A, q)
			var s = 'var '+A[q].s
			if (brace && A[brace].s != '(') s = ';' + s
			A[q].s = s
			A[i].s = ' = '
		}
	}
}

function findDefineIfUndefined(A) {
	for (var i = 1; i < A.length; i++) {
		if (A[i].s == '≜') {
			A[i].s = '='
			var R = getNameLeft(A, i - 1)
			var s = lex.join(A.slice(R.a, R.b + 1))
			A[R.a].s = 'if (typeof '+s+' == "undefined") '+A[R.a].s
		}
	}
}

var ifExprStops = { '{':1, '@':1, '$':1, '♻':1, 'continue;':1, ';':1, '⌥':1, '⧖':1, '⧗':1, '∞':1, 'ロ':1, 'console.log(':1 }

function processIf(A, sym, str) {
	for (var i = 0; i < A.length; i++) {
		if (A[i].s == sym) {
			A[i].s = str
			var n = next(A, i)
			if (A[n].s == '(') continue
			var n2 = next(A, n)
			var short = false
			if (A[n].type == 'id' && A[n].s != 'typeof' && A[n2].type == 'id') {
				short = true, n = n2
			}
			
			else while (true) {
				var n = next(A, n)
				if (n == undefined) return
				if (ifExprStops[A[n].s] == 1) {
					short = true
					break
				}
			}
			if (short) {
				A[i].s = str + ' ('
				addTo(A[n], ')')
			}
		}
	}
}

function replaceMacros(id, macro, A, i) {
	var level = 0, e = A.length
	while (i < e) {
		if (A[i].s == id) {
			A[i].s = macro
		} else if (A[i].s == '{') level++
		else if (A[i].s == '}') {
			if (level == 0) return
			level--
		}
		i++
	}
}

function findMacros(A) {
	var e = A.length
	for (var i = 1; i < e; i++) {
		if (A[i].s == '≞') {
			var q = prev(A, i)
			var id = A[q].s, macro = ''
			A[q].s = '', A[i].s = ''
			while (A[i].type != 'line') { macro += A[i].s; A[i].s = ''; i++ }
			replaceMacros(id, macro, A, i)
		}
	}
}

//function getGroupRight(A, i) {
//	var level = 0, e = A.length
//	while (i < e) {
//	}
//}

function getNameRight(A, i) {
	var e = A.length, fun = 0, arr = 0, blk = 0, R = [], firstToken = true
	while (i < e) {
		var c = A[i]
		var none = false
		if (fun > 0) {
			if (c.s == ')') fun--; else if (c.s == '(') fun++
		}
		else if (arr > 0) {
			if (c.s == ']') arr--; else if (c.s == '[') arr++
		}
else if (blk > 0) {
	if (c.s == '}') blk--; else if (c.s == '{') blk++
}
		else if (c.s == '{' && firstToken) blk++, firstToken = false
		else if (c.s == '(') fun++
		else if (c.s == '[') arr++
		else if (c.s == '.') ;
		else if (c.type == 'id'||c.s == 'this.'|| (firstToken && c.type == 'str')) {
			firstToken = false
			if (lastOf(R) && lastOf(R).type == 'id') break
		}
		else if (c.type == 'space') ;
		else if (c.type == 'index') ;
		else none = true
		if (!none && c.type != 'space' && c.type != 'line') R.push(c)
		if (none) break
		i++
	}
	return [R, i]
}

function autoArg(A, find, repl0) {
	for (var i = 0; i < A.length; i++) {
		if (A[i].s == find) {
			var repl = repl0
			var a = next(A, i)
			if (a) {
			//TODO: ⦙ []❄(➮ { $ (⬠⚂ - 0.5) } )  // sym-nexts are not detected?
			//TODO: a ⬊ {a:123}.a  -> converts to a.push({a:123}).a
				if (A[a].s == '{'
				|| A[a].s == '['
				|| A[a].type == 'id'
				|| A[a].type == 'str'
				|| A[a].s == 'this.') {
					var R = getNameRight(A, a)
					A[a].s = '(' + A[a].s
					A[R[1]-1].s += ')'
				} else if (A[a].type == 'num') {
					A[a].s = '(' + A[a].s + ')'
				} else if (A[a].s != '(') {
					repl += '()'
				}
			}
			A[i].s = repl
		}
	}
}

function leninArg(A, find, repl0) {
	for (var i = 0; i < A.length; i++) {
		if (A[i].s == find) {
			var repl = repl0
			var args = []
			var a = next(A, i)
			if (a && A[a].s != '(') {
				while (a && A[a].type == 'id' || A[a].s == '.') {
					args.push(A[a].s)
					A[a].s = ''
					a = next(A, a)
				}
				args = args.map(function(a){return '"'+a+'"'})
				repl += '(' + args.join(',') + ')['+args[args.length-1]+']'
			}
			A[i].s = repl
			i = a
		}
	}
}

//  a,b ← f()
//  _elfu_left ∆ f(); a=_elfu_left⁰, b=_elfu_left¹
// 

function findTuples(A, symbol) {
	function parseList () {
		function skipSpaces() {
			while (A[x].type == 'space' && x >= 0) x--
		}
		function isComma() {
			if (x >= 0 && A[x].s == ',') return true
			return false
		}
		var x = i
		var list = []
		while (true) {
			var R = getNameLeft(A, x - 1)
			var s = lex.join(A.slice(R.a, R.b + 1))
			list.unshift(s)
			x = R.a-1
			skipSpaces()
			if (!isComma()) break
		}
		return [list, x+1]
	}
	for (var i = 0; i < A.length; i++) {
		if (A[i].s == symbol) {
			var ret = parseList()
			for (var x = ret[1]; x <= i; x++) {
				A[x].s = ''
			}
			list = ret[0]
			A[i-1].type = 'id'
			A[i-1].s = '__elfu_left'
			A[i].type = 'sym'
			A[i].s = '='
			var R = getNameRight(A, i+1), array = lex.join(R[0]), end = R[1]+1
			//with this +1, something is wrong
			R = []
			for (var n = 0; n < list.length; n++) {
				R.push(list[n] + '=' + '__elfu_left[' + n + ']')
			}
			addTo(A[end-1],';var '+R.join(',')+';')
		}
	}
}

function getEnd(A, i) {
	var e = A.length, level = 0, a = i
	while (i < e) {
		var c = A[i]
		if (c.s == '}') {
			if (level > 0) { level--; }
			else return i
		}
		if (c.s == '{') level++
		i++
	}
}

function autoExports(A) {
	function buildList(renameWithPrefix) {
		var R = []
		for (var i = 0; i < A.length; i++) {
			if (A[i].s == 'function') {
				for (var j = i + 1; j < i + 3; j++) {
					if (A[j].type == 'id') {
						var name = A[j].s
						if (renameWithPrefix) A[i].s = A[j].s + '=' + A[i].s
						R.push(name)
						for (var k = j + 1; k < j + 256; k++) {
							if (A[k] == undefined) break
							if (A[k].s == '{') {
								var e = getEnd(A, k+1)
								i = e+1
								break
							}
						}
						break
					}
				}
			}
		}
		return R
	}
	for (var i = 0; i < A.length; i++) {
		if (A[i].s == '➮]') {
			var F = buildList(false)
			for (var f = 0; f < F.length; f++) {
				F[f] = 'module.exports.'+ F[f] +' = ' + F[f]
			}
			A[i].s = F.join('\n')
		}
		else if (A[i].s == '➮|') {
			var F = buildList(true)
			for (var f = 0; f < F.length; f++) {
				//F[f] = ''+ F[f] +' = ' + F[f]
			}
			A[i].s = ''
			A[i].type = 'space'
			//F.join('\n')
		}
	}
}

function processIf2(A) {
	/*
		logic:
		1. replace '❱' with ')', or '){' when the next token is on the same line and is not {
		2. replace '◇' with
			a. 'else if(' if followed by the next non-space character '❰'
			b. 'else {' if the next token is on the next line
			c. 'else'
		3. replace '⁋' with '}'
		4. replace '❰' with 'if ('
	*/
	function issym(sym, i) {
		return A[i].type == 'sym' && A[i].s == sym
	}
	
	function prev_sym_was_line() {
		for (var n = i - 1; n >= 0; n--) {
			if (A[n].type == 'line') return true
			if (A[n].type != 'space') return false
		}
		return false
	}
	
	function is_block(i) {
		for (; i < A.length; i++) {
			if (A[i].type == 'space') continue
			if (A[i].type == 'line') continue
			return A[i].type == 'sym' && A[i].s == '{'
		}
		return false
	}
	
	function scan_block(i) {
		var block = is_block(i+1)
		var R = { block: block }
		for (var n = i + 1; n < A.length; n++) {
			if (A[n].type == 'space') continue
			if (A[n].type == 'line') break
			// oneliner if() detected
			for (var k = n + 1; k < A.length; k++) {
				if (A[k].type == 'line' || A[k].s == '◇' || A[k].s == '❰') {
					if (!block) R.pos = k
					break
				}
			}
			break
		}
		if (R.pos) {
			var o = A[R.pos]
			if (o.type == 'line') addTo(o, ' } ')
		}
		return R
	}
	
	for (var i = 0; i < A.length; i++) {
		if (issym('❰',i)) {
			A[i].s = 'if ('
		}
		if (issym('⁋',i)) {
			A[i].s = '}'
		}
		if (issym('❱',i)) {
			var oneliner = true, line_char
			var scan = scan_block(i)
			if (scan.block) A[i].s = ')'
			else A[i].s = ') {'
		}
		if (issym('◇',i)) {
			var type = 'else'
			for (var n = i + 1; n < A.length; n++) {
				if (A[n].type == 'space') continue
				if (issym('❰',n)) type = 'elseif'
				break
			}
			if (type == 'else') {
				A[i].s = '} else'
				var scan = scan_block(i)
				if (scan.block) A[i].s = ''
				else A[i].s = '} else {'
			}
			if (type == 'elseif') {
				A[i].s = '} else'
			}
			
		}
	}

	function check_syntax_if_if_is_closed() {
		return true
		/*
			too hard to implement, will take whole day
			so be careful
		*/
		var level = 0
		for (var n = i + 1; n < A.length; n++) {
			if (A[n].type == '⁋' && level == 0) return true
			if (A[n].type == '❰') level++
			if (A[n].type == '❱') level--
			break
		}
		return false
	}
}

function clearToken(A, i) {
	A[i].s = ''
	A[i].type = 'space'
}

function processStringArrays(A) {
	for (var i = 0; i < A.length; i++) {
		if (A[i].type == 'sym' && A[i].s == '[@') {
			clearToken(A, i)
			var list = []
			var nested = 0
			for (var n = i + 1; n < A.length; n++) {
				if (A[n].type == 'sym' && A[n].s == '[') {
					nested++
				}
				else if (A[n].type == 'sym' && A[n].s == ']') {
					if (nested-- == 0) {
						clearToken(A, n)
						var txt = lex.join(list)
						txt = txt.split(' ').filter(function(a){return a.length>0})
						addTo(A[i], JSON.stringify(txt).replace(/"/g,'\''))
						break
					}
				}
				list.push({type:A[n].type, s:A[n].s})
				clearToken(A, n)
			}
		}
	}
	return false
}

