fs = ≣ 'fs'

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
