context = {}

➮ findName {
	⌥ ⬤a ≠ 'object' {
		$ findName(context, a)
	}
	⌥ a[b] { $a }
	⧗ (∇ i in a) {
		⌥ ⬤a[i] ≟ 'object' {
			t ∆ findName(a[i], b)
			⌥ t[b] { $t }
		}
	}
}

➮ stroi {
	A ∆ __argarr
	o ∆ context
	⧗(i ∆ 0; i < A↥-1; i++) {
		n ∆ A[i]
		⌥ o[n] ≟ ∅ { o[n] = {} }
		o = o[n]
	}
	$ o
}

 x = 1
 a b = 2
//ロ a
//ロ x
//ロ a b
//ロ .b
//ロ context
//
ロ 'find b=', findName('b')
