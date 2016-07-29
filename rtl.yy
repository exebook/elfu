fs = ≣ 'fs'

//color = function(c) { return '\u001b[3'+c+'m'}
colorEnd = ➮ { $'\u001b(B\u001b[m'}
color = ➮ {
	❰a ≟ ∅❱ $ colorEnd()
	$'\u001b[38;5;'+a+'m'
}

uncolor = ➮ uncolor {
	R ∆ ''
	a = repl(a, '\u001b[1G', '')
	a = repl(a, '\u001b[3G', '')
	a = repl(a, '\u001b[0J', '')
	a = repl(a, '\u001b(B\u001b[m', '')
	i ⬌ a {
		❰aⁱ ≟ '\u001b'❱
			❰a[i+1] ≟ '[' && a[i+2] ≟ '3' && a[i+3] ≟ '8'❱
				⧖ (aⁱ ≠ 'm' && i < a↥) { i++ }
				❰aⁱ ≟ ∅❱ @
			◇
				R += '%'
				⁋
		◇
			R += aⁱ
			⁋

	}
	$ R
}

⌥ process.stdout._handle {
	H ∆ process.stdout._handle
	⌥ H && H.setBlocking {
		H.setBlocking(true)
		// http://stackoverflow.com/questions/38085746
	}
}

timeLimit = ➮ timeLimit {
	⌥ (arguments.callee.t ≟ ∅) {
		arguments.callee.t = ⚡
		$ ⦿
	}
	⌥ (arguments.callee.t + a > ⚡) $ ⦾
	arguments.callee.t = ⚡
	$ ⦿
}

//➮ repl { $ a ⌶ b ⫴ c }

module.exports.repl = repl = ➮ repl s a b {
	❰arguments↥ > 3❱
		A ∆ __argarr
		x ∆ 1
		⧖ x < A↥ {
			s = arguments.callee(s, A[x], A[x+1])
			x += 2
		}
		$ s
		⁋
	x ∆ 0
	x1 ∆ s≀(a, x)
	⌥ (x1 < 0) $ s
	R ∆ ''	L ∆ s↥	AL ∆ a↥
	⧖ (x < L) {
		o ∆ s ⩪(x, x1-x)
		R += o
		R += b
		x = x1 + AL
		x1 = s ≀(a, x)
		⌥ (x1 < 0) @
	}
	R += s⋃x
	$ R
}


String.prototype.re = ➮ re a b {
	"use strict"
	s ∆ ⚪
	❰arguments↥ > 2❱
		A ∆ __argarr
		x ∆ 0
		⧖ x < A↥ {
			s = repl(s, A[x], A[x+1])
			x += 2
		}
		$ s
		⁋
	$ repl(s, a, b)
}

sysexe = ➮ sysexe cmd arg f {
	⌥ (⬤arg.map ≠ 'function') {
		ロ 'arguments must be []'
		⚑
	}
	L ∆ ''
	spawn ∆ ≣('child_process').spawn
	x ∆ spawn(cmd, arg)
	➮ d { L += a≂ }
	x.stdout.on('data', d) 
	x.stderr.on('data', d)
	x.on('close', ➮{ f(L ⌶ '\n', a) })
	$ x
}

process_stdout_write_multi = ➮ {
	a ∆ Array.prototype.join.apply(arguments, [' '])
	process.stdout.write(a)
}

isArray = ➮ isArray { $ a.map ≟ Array.prototype.map }

literate = ➮ - a f {
	// callback: f(parent object, index/name, value, kind)
	⌥ ⬤ a ≟ 'object' {
		⌥ a.map {
			i ► a {
				⌥ ⬤i ≟ 'object' {
					f(a, i_, i, 'arr')
					arguments.callee(i, f)
				}
				⥹ ⬤i ≟ 'string' || ⬤i ≟ 'number' {
					f(a, i_, i, ⬤i)
				}
			}
		}
		⎇ {
			K ∆ ⚷a
			k ► K { 
				⌥ ⬤ aᵏ ≟ 'object' {
					o ∆ aᵏ
					f(a, k, o, 'obj')
					arguments.callee(o, f)
				}
				⥹ ⬤ k ≟ 'string' || ⬤k ≟ 'number' {
					f(a, k, aᵏ, ⬤k)
				}
			}
		}
	}
}

yyd_get_terminal_width = ➮ {
	$ ★(⛁'/var/tmp/yyd.term.width' ≂)
}

__args = ➮ __args required optional {
	R ∆ {}
	x ∆ 2
	i ► required {
		X ∆ process.argv[x++]
		❰X ≟ ∅❱
			ロ 'arguments required: ' required ⫴ ', '
			⚑ ⁋
		Rⁱ = X
	}
	❰optional❱
		i ► optional {
			X ∆ process.argv[x++]
			❰X❱ Rⁱ = X
		}
		⁋
	$ R
}

function stdinReadSync() {
    var b = new Buffer(1024)
    var data = ''

    while (true) {
        var n = fs.readSync(process.stdin.fd, b, 0, b.length)
        if (!n) break
        data += b.toString(null, 0, n)
    }
    return data
}

