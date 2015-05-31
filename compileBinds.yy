fs ∆ ≣ 'fs'
A ∆ ⛁ './binds'
A = A≂⌶↵
b ∆ ⦾   R ∆ []   D ∆ {}   G ∆ []

i ⬌ A { q ∆ Aⁱ ⌶'=' ⦙ D[q⁰] = q¹ } // deodar
i ⬌ A { // sublime
	q ∆ Aⁱ ⌶'=' ⦙ D[q⁰] = q¹
	⌥(q⁰⁰ ∼ .) q⁰ = q⁰⋃1
	R ⬊({trigger: q⁰, contents: q¹ })
}

//
//	⌥ (Aⁱ ≀ ('[Javascript]') ≟ 0) { b = ⦿ ⦙ ♻ }
//	⌥ (Aⁱ ≀ ('[') ≟ 0) { b = ⦾ ⦙ ♻ }
//	⌥ (b && Aⁱ ≀ ('=') > 0) {
//		if (q⁰ ↥ == 1) q⁰ = '.' + q⁰
//		q¹ = q¹.replace(/%cursor%/g,'')
//	}
//
//}


//ロ R ⫴ ('\n')
⛃ (process.env.HOME+ '/.config/sublime-text-3/Packages/Elfu.sublime-completions', '{\t"scope": "source.js - variable.other.js",'
+ '\t"completions":'
+ '\t'
+ ꗌ(R,0,' ')
+ '\t}')
	

fs.writeFileSync(process.env.HOME+'/.deodar/tabsnippets.js', 'module.exports='+JSON.stringify(D))
/*
//./Local/Elfu.sublime-completions
//./Installed Packages/Elfu.sublime-completions
//./Packages/Elfu.sublime-completions
./Packages/User/Elfu.sublime-completions
./Cache/Elfu/Elfu.sublime-completions
./Cache/Color Scheme - Default/Elfu.sublime-completions
//./Cache/JavaScript/Elfu.sublime-completions
*/
