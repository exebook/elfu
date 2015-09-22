fs = ≣ 'fs'

color = function(c) { return '\u001b[3'+c+'m'}
colorEnd = function() { return '\u001b(B\u001b[m'}

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

repl = ➮ repl s a b {
	x ∆ 0
	x1 ∆ s≀(a, x)
	⌥ (x1 < 0) $ s
	R ∆ ''	L ∆ s↥	AL ∆ a↥
	⧖ (x < L) {
		o ∆ s ⩪(x, x1-x)
//		o ∆ s⋃(x, x1)
		R += o
		R += b
		x = x1 + AL
		x1 = s ≀(a, x)
		⌥ (x1 < 0) @
	}
	R += s⋃x
	$ R
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
}

process_stdout_write_multi = ➮ {
	a ∆ Array.prototype.join.apply(arguments, [' '])
	process.stdout.write(a)
}
