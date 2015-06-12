∇ lex = ≣ ('./lexer.js')

exports.convert = ➮ (R) {
	R = lex.lex(R)
	findFunctions(R)
	findLog(R)
	findEach(R)
	findIndex(R)
//todo: remove () if empty
// TODO sfcc -> ∼◬
// D⌶('\r\n') -> D⌶'\r\n' // detect autoargs when possible
	longReplace(R, '⌶', ['.','split'])
	longReplace(R, '⫴', ['.','join'])
	longReplace(R, '⋃', ['.','slice'])
	longReplace(R, '⨄', ['.','splice'])
	longReplace(R, 'ꔬ', ['.','filter'])
	longReplace(R, '⧉', ['.','map'])
	longReplace(R, 'ꗚ', ['.','concat'])
	longReplace(R, '❄', ['.','sort'])
	longReplace(R, '⩪', ['.','substr'])
	longReplace(R, '△', ['.','charAt'])
	longReplace(R, '◬', ['.','charCodeAt'])

	longReplace(R, '≂', ['.','toString','(',')'])
	longReplace(R, '≀', ['.','indexOf'])
	simpleReplace(R, ' ⦙', ';')
	simpleReplace(R, '☛', 'with')
	
	simpleReplace(R, '★', 'parseInt')
	longReplace(R, '⬠', ['Math','.','round'])
	longReplace(R, '⍽', ['Math','.','floor'])
	simpleReplace(R, '♻', 'continue')
	longReplace(R, '⚂', ['Math','.','random','(',')'])

	longReplace(R, '⚫', ['this','.'])
	simpleReplace(R, '⚪', 'this')
	simpleReplace(R, '⬤', 'typeof')
	simpleReplace(R, '⌿⌚', 'clearInterval')
	simpleReplace(R, '⌿⌛', 'clearTimeout')
	simpleReplace(R, '⟡', 'new')
	simpleReplace(R, '⏀', 'delete')
	//
	longReplace(R, '⊜', ['=','0'])
	longReplace(R, '⥹', ['else','if'])
	simpleReplace(R, '⌥', 'if')
	simpleReplace(R, '⎇', 'else')
	
	longReplace(R, '∞', ['while','(','true',')'])
	longReplace(R, '∞', ['for','(',';',';',')'])
	simpleReplace(R, '⧗', 'for')
	simpleReplace(R, '⧖', 'while')
	longReplace(R, ' ⬊', ['.','push'])
	longReplace(R, ' ⬈', ['.','pop()'])
	longReplace(R, ' ⬉', ['.','shift()'])
	longReplace(R, ' ⬋', ['.','unshift'])
	longReplace(R, '⬍', ['.','forEach'])
	simpleReplace(R, '⦾', 'false')
	simpleReplace(R, '⦿', 'true')
	simpleReplace(R, '≠', '!=')
	simpleReplace(R, '≟', '==')
	simpleReplace(R, '≣', 'require')
	simpleReplace(R, '⌚', 'setInterval')
	simpleReplace(R, '⌛', 'setTimeout')
	longReplace(R, ' ↥', ['.','length'])
	simpleReplace(R, '∅ '[0], 'undefined')
	simpleReplace(R, '"∅"', '"undefined"')
	simpleReplace(R, "'∅'", "'undefined'")
	simpleReplace(R, '∇', 'var')
	simpleReplace(R, '$', 'return')
	simpleReplace(R, '@', 'break')
	∇ s = lex.join(R, ⦿)
	$ s
}

➮ findIndex ρ {
	❶ '⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʱʳˢᵗᵘᵛʷˣʸᶻ'
	❷ '0123456789abcdefghijklmnopqrstuvwxyz'
	i ⬌ ① {
	❸ ②ⁱ
		a ⬌ ρ ⌥ (ρᵃ.s ≟ ③) {
			c ∆ next(ρ, a) ⦙ ⌥ (ρᶜ.s ≠ ']') ♻
			b ∆ prev(ρ, a) ⦙ ⌥ (ρᵇ.s ≠ '[') ♻
			erase(ρᵇ) ⦙ ρᵃ.s = ①ⁱ ⦙ erase(ρᶜ)
		}
	}
}

➮ erase { a.s = '' ⦙ a.type = 'space' }
➮ next { ⧖ (a[++b].type ≟ 'space') ⦙ $ b }
➮ prev { ⧖ (a[--b].type ≟ 'space') ⦙ $ b }

➮ testAt(ρ, i, find) {
	∇ a = i
	∇ e = find ↥ - 1
	j ⬌ find {
		⌥ (findʲ ≠ ρⁱ.s) $
		if (j ≠ e) i = next(ρ, i)
	}
	$ i
}

➮ getNameRight(A, i) {
	∇ e = A↥ , fun = 0, arr = 0, R = []
	⧖ (i < e) {
		∇ c = A[i]
		∇ none = ⦾
		⌥ (fun > 0) {
			⌥ (c.s == ')') fun--; ⎇ ⌥ (c.s == '(') fun++
		}
		⎇⌥ (arr > 0) {
			⌥ (c.s == ']') arr--; ⎇ ⌥ (c.s == '[') arr++
		}
		⎇⌥ (c.s == '(') fun++
		⎇⌥ (c.s == '[') arr++
		⎇⌥ (c.s == '.') ;
		⎇⌥ (c.type == 'id') {
			⌥ (R.last && R.last.type == 'id') @
		}
		⎇⌥ (c.type == 'space') ;
		⎇ none = ⦿
		⌥ (!none && c.type != 'space' && c.type != 'line') R ⬊(c)
		⌥ (none) @
		i++
	}
	$ [R, i]
}

➮ findEach(ρ) {
	➮ ω { i = next(ρ, i) }
	i ⬌ ρ {
		∇ a = i
		⌥ (ρⁱ.s ≠ 'for') ♻ ω()
		⌥ (ρⁱ.s ≠ '(') ♻ ω()
		⌥ (ρⁱ.s ≟ 'var') ω()
		⌥ (ρⁱ.type ≠ 'id') ♻ ∇ id = ρⁱ.s ⦙ ω()
		⌥ (ρⁱ.s ≠ '=') ♻ ω()
		⌥ (ρⁱ.s ≠ '0') ♻ ω()
		⌥ (ρⁱ.s ≠ ';') ♻ ω()
		⌥ (ρⁱ.type ≠ 'id') ♻ ω()
		⌥ (ρⁱ.s ≠ '<') ♻ ω()
		∇ N = getNameRight(ρ, i), arr = N⁰, q = N¹
		⌥ (arr↥ ≟ 0) ♻ ω()
		⌥ (arr ⬈.s ≠ 'length' || arr ⬈.s != '.') ♻ i = q
		arr = lex.join(arr)
		⌥ (ρⁱ.s ≠ ';') ♻ ω()
		⌥ (ρⁱ.s ≠ id) ♻ ω()
		⌥ (ρⁱ.s ≠ '++') ♻ ω()
		⌥ (ρⁱ.s ≠ ')') ♻
		⧗ (∇ x = a ⦙ x <= i ⦙ x++) ρ[x].s = ''
		ρᵃ.s = id ⦙ a++
		ρᵃ.s = ' ' ⦙ a++
		ρᵃ.s = '⬌' ⦙ a++
		ρᵃ.s = ' ' ⦙ a++
		ρᵃ.s = arr
	}
}

➮ findLog (ρ) {
	i ⬌ ρ {
		∇ q = testAt(ρ, i, ['console', '.', 'log'])
		⌥ (q) {
			∇ q = next(ρ, q)
			⌥ (ρ[q].s ≠ '(') ♻
			⧗ (∇ b = i; b <= q; b++) ρ[b].s = ''
			ρ[i].s = 'ロ'
			i = q
			∇ λ ⊜
			∞ {
				⌥ (ρ[i].s ≟ ')') ⌥ (λ ≟ 0) @; ⎇ λ--
				⌥ (ρ[i].s ≟ '(') λ++
				i = next(ρ, i)
			}
			∇ n = next(ρ, i)
			⌥ (ρⁿ.type ≟ 'line') ρⁱ.s = '' ⦙ ⎇ {
				⌥ (ρⁿ.s ≠ ';') ρⁱ.s = ';' ⦙ ⎇ ρⁱ.s = ''
			}
		}
	}
}

➮ findFunctions R {
	//TODO: remove ➮, think about teetdb.js
	//TODO: remove(), but not if 'a''b''c' found inbody
	i ⬌ R ⌥(R[i].s ≟ 'function' || R[i].s ≟ '➮') {
		Rⁱ.s = '➮'
		∇ a = i
		a = next(R, a)
		⌥ (Rᵃ.type ≠ 'id') { // lambda
			∇ x = next(R, a)
			if (Rᵃ.s == '(' && Rˣ.s == ')') {
				Rˣ.s = Rᵃ.s = ''
				x++
				if (Rˣ.type == 'space') Rˣ.s = ''
			}
		} ⎇ {
			∇f = Rᵃ.s ⦙ a = next(R, a)
			⌥ (Rᵃ.s ≟ '(') { 
				∇ id = [], ix = [], z = a
				⧖ (Rᵃ.s ≠ ')') {
					⌥ (Rᵃ.type == 'id') id ⬊(Rᵃ.s), ix ⬊(a)
					a = next(R, a)
				}
				∇ t = z ⦙ ⧖ (z <= a) Rᶻ.s = '', z++
				⌥ (id ↥ ≠ 0) Rᵗ.s = ' '
				R[t+1].s = id ⫴ (' ')
			}
			i = a
		}
	}
}

➮ simpleReplace(R, replace, find) {
	i ⬌ R ⌥(Rⁱ.s ≟ find) Rⁱ.s = replace
}

➮ longReplace(R, replace, find) {
	i ⬌ R {
		∇ ω = ⦿, x = i, p
		j ⬌ find {
			⌥ (findʲ ≠ Rⁱ.s) { ω = ⦾; @ }
			p = i
			i = next(R, i)
		}
		⌥ (ω) {
			⧖ (x <= p) Rˣ.s = '', x++
			Rᵖ.s = replace
		} ⎇ i = x
	}
}


