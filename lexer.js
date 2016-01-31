module.exports.join = join
module.exports.lex = function(s) {
	if (!symLookupTable) symLookupTable = buildSymLookupTree()
	return mainLoop(s)
}
module.exports.addSymbol = function(sym) {
	elfuLexerSyms += ' ' + sym
	symLookupTable = buildSymLookupTree()
}
var symLookupTable

function isCharNum(c) { return (c >= '0' && c <= '9') }

function isCharAlpha(c) {
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
	 || (c >= '\u0370' && c<= '\u03ff') || c == '_'
	  || (c >= 'А' && c <= 'Я') || (c >= 'а' && c <= 'я')
}

function isCharHex(c) {
	if (isCharNum(c)) return true
	if (c >= 'a' && c <= 'f') return true
	if (c >= 'A' && c <= 'F') return true
	return false
}

leninLexerSyms = '→ → ↑ ↓                                        '

spaseboLexerSyms = ' ⏚ ☎ ✚'

elfuLexerSyms = '` ᗰ ᙏ ᗲ ᗶ ᗼ ᙢ ᙕ ᙨ ᙜ ᘻ ❶ ❷ ❸ ❹ ❺ ❻ ❼ ❽ ❾ ❿ ① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⁰ ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ᵃ ᵇ ᶜ ᵈ ᵉ ᶠ ᵍ ʰ ⁱ ʲ ᵏ ˡ ᵐ ⁿ ᵒ ᵖ ʱ ʳ ˢ ᵗ ᵘ ᵛ ʷ ˣ ʸ ᶻ ∆ ↟ ꕉ ⌶ ⫴ ⋃ ⨄ ꔬ ⧉ ꗚ ❄ ⩪ △ ◬ ⟡ ⌑ ≞ ≂ ≈ ≀≀ ≀ ≁ ∼ ≃ ≄ ⦙ ⍽ ★ ⬠ ⚂ ♻ ★ ⏀ ⌿⌚ ⌿⌛ ⚪ ⚫ ⬤ ⋀ ⋁ ↥ ⎇ ⌚ ⌛ ≣ ≠ ≟ ⦾ ⦿ ⬌ ⬊ ⬈ ⬉ ⬋ ⬍ ∞ ⧖ ∅ ⧗ ⌥ ⥹ ⊜ ⨃ ∇ ➮ ꗝ √ ⚑ ⟑ ⚙ ≜ ロ ロロ ► ꔪ'
+ ' # $ @ : :: ( ) [ ] { } .( , ; . - + * / % ~ ^ | ++ -- != || && == === >= <= += -= *= /= %= >> << >>= <<= >>> <<< >>>= <<<= ?'
+ ' '+ leninLexerSyms + spaseboLexerSyms
// ∿ sine?
/*
⌥ a ≟ 0 {
} ⥹ x ≠ 4 {
}
*/
/*this is not part of elfu, but support for Leenin prototype*/

function buildSymLookupTree() {
	var syms = elfuLexerSyms
	var L = syms.split(' '), T = {}
	L.forEach(function(x) {
		var Z = T
		for (var i = 0; i < x.length; i++) {
			var c = x.charAt(i)
			if (!Z[c]) Z[c] = {}
			Z = Z[c]
		}
	})
	return T
}

function checkSym(s, i) {
	var Z = symLookupTable, x = i
	while (Z = Z[s[x]]) x++
	return x
}

function mainLoop(s) {
	var R = [], i = 0, ch, e = s.length, O
	while (i < e) {
		ch = s[i]
		if (ch == '\n') {
			O = {type:'line', s:'\n'}
			i++
		} else if (ch==' '||ch=='\t'||ch=='\r') {
			var b = i
			while (++b < e) {
				c = s[b]
				if (c != ' ' && c != '\t' && c != '\r') break
			}
			O = {type:'space', s:cut()}
		} else if (isCharAlpha(ch)) {
			var b = i
			while (++b < e) {
				c = s[b]
				if (isCharAlpha(c) || isCharNum(c)) continue
				break
			}
			O = {type:'id', s:cut()}
		} else if (ch == '0' && s[i+1] == 'x') {
			var b = i+1, dot = false
			while (++b < e) {
				if (!isCharHex(s[b])) break
			}
			O = {type:'hexnum', s:cut()}
		} else if (isCharNum(ch)) {
			var b = i, dot = false
			while (++b < e) {
				if (s[b] == '.') {
					if (dot) break
					dot = true
					continue
				}
				if (!isCharNum(s[b])) break
			}
			O = {type:'num', s:cut()}
		} else if (s.substr(i, 4) == "'''\n") {
			b = s.indexOf("'''", i + 4)
//			b = s.indexOf("\n'''", i + 4)
			if (b < 0) return [{type:"error, unterminated long string: '''"}]
			else {
				var longs = s.slice(i + 4, b)
					.split('\\').join('\\\\')
					.split('\n').join('\\n')
					.split('"').join('\\"')
				i = b + 3//4
				O = {type:'str', s:'"'+longs+'"'}
			}
		} else if (ch == '"' || ch == "'") {
			b = i
			while (true) {
				b++
				b = s.indexOf(ch, b)
				if (b < 0) break
				if (s[b - 1] != '\\') break; else if (s[b - 2] == '\\') break;
			}
			if (b < 0) b = e; else b++
			O = {type:'str', s:cut()}
		} else if (ch == '/' && s[i+1] == '*') {
			b = s.indexOf('*/', i+2)
			if (b < 0) b = e; else b+=2
			O = {type:'rem', s:cut()}
		} else if (ch == '/' && s[i+1] == '/') {
			b = s.indexOf('\n', i+2)
			if (b < 0) b = e
			O = {type:'rem', s:cut()}
		} else {
			var p = R[R.length-1]
			if (p && p.type == 'space') p = R[R.length-2]
			if (ch == '/' && p.type != 'num' && p.type != 'id' && p.s != ')' && p.s != ']'
			&& p.s.charCodeAt(0) < 128) {
				b=i; while (++b < e) {
					if (s[b] == '\\') b++
					else if (s[b] == '/') break
				}
				b++
				O = {type:'regex', s:cut()}
			} else {
				var b = checkSym(s, i)
				if (b > i) O = {type:'sym', s:cut()}
				else {
					O = {type: 'tok', s:s[i++]}
					console.log('UNRECOGNIZED TOKEN:', O.s)
					for (var i = 0; i < O.s.length; i++) console.log(i, O.s.charCodeAt(i))
					console.log(s.substr(i - 20, 40))
					process.exit()
				}
			}
		}
		R.push(O)
	}
	return R
	function cut() { var R = s.substr(i, b-i); i=b; return R }
}

function join(A, opt) {
	var R = []
	for (var i = 0; i < A.length; i++) R.push(opt == 'untab'?A[i].s.replace('\t', '   '):A[i].s)
	return R.join('')
}
