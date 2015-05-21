#Elfu - hosti lammen

Elfu is highly experimental symbolic language. UNICODE contains thousands and thousands of symbols, why not use them?

- Elfu stands for elvish functional language or elvish numeric gongfu.
- Elfu in elvish is called *hosti lammen*, or *computing language*.
- Elfu is Javascript compatible, you mix Javascript and Elfu in Elfu file.
- Elfu file extension is **.yy** *(this is elvish)*
- Elfu is written in Javascript itself.
- To type symbols we use TAB completion feature of the editor.
- Most of symbols are just replaced with their Javascript counterparts.
- Some symbols are parsed in a special way, like `➮` or `⬌`.
- Editors known to be Elfu-friendly are Sublime Text, Geany, Deodar.
- If your computer does not show all symbols, there is a font file *[elfu.ttf][100]*.
- Elfu only uses Unicode standard symbols.
- Elfu is *mostly* reversable, in other words you can convert .yy->.js and .js->.yy. *Mostly*.
[100]: http://exebook.github.io/fonts/elfu.ttf

# Contents
 - [Screenshot][1]
 - [Syntax][2]
 - [Usage][3]
 - [Dotcall syntax][4]
 - [Feedback][5]
 
[1]: https://github.com/exebook/elfu/blob/master/README.md#screenshot
[2]: https://github.com/exebook/elfu/blob/master/README.md#syntax
[3]: https://github.com/exebook/elfu/blob/master/README.md#usage
[4]: https://github.com/exebook/elfu/blob/master/README.md#dotcall-syntax
[5]: https://github.com/exebook/elfu/blob/master/README.md#feedback

#Screenshot
Here is how Elfu looks in author's editor:
![screenshot](http://exebook.github.io/pics/elfu1.png)

#Syntax

---
#####function definition `➮`
- typed as `fu|TAB`.
- Elfu translator will replace `➮` with `function`. 
- you can avoid `(`, `)` and `,` in argument declaration.
- if you omit any arguments, arguments `a` `b` `c` are default.
- use `➮f(){}` syntax to declare a function without arguments.
- `➮ {}` is a lambda with default arguments *a, b, c*.

```javascript
➮ compare (a, b) { console.log(a == b) }
➮ compare a b { console.log(a == b) }
➮ compare { console.log(a == b) }
[1,2,3].forEach(➮ { console.log(a) })

```

---
##### return statement `$`
 - `$` is replaced with `return`.

```javascript
➮ four { $ 2 + 2 }
```

---
##### while and for statements `⧖` and `⧗`
 - `⧖` is replaced with `while`.
 - `⧗` is replaced with `for`.
 - typed as `wh|TAB`, `fo|TAB`.
 
```javascript
⧖ (true) step()
⧗ (var i = 0; i < 3; i++) step()
```

---
##### break and continue statements `@`
 - `@` is replaced with `break`.
 - `♻` is replaced with `continue`.

```javascript
⧖ (true) {
	step()
	if (again()) ♻
	if (finished()) @
}
```

---
##### each looping `⬌` and `⬍`
 - `⬌` typed as `ea|TAB`.
 - compiles to `for (var i = 0; i < obj.length; i++)`.
 - just type `i ⬌ obj`, it converts to the above.
 - `⬍` typed as `fe|TAB`.`
 - simply converts to `.forEach`.

```javascript
var a = [1,2,3]
i ⬌ a console.log(a[i])
```

```javascript
A ∆ [1,2,3,4]
A ⬍ (➮ { ロ a ; })
```

---
##### console.log `ロ`
 - typed as `lo|TAB`
 - `ロ` is Chinese/Japanese character for *mouth*.
 - tired typing console.log hundreds times a day?
 - `ロ` takes everything until the end of line or `;` as arguments.
 - make sure you add ';' if your code continues on this line.

```javascript
ロ 'hello world!'
ロ 'numbers are:', 1, 2, 3
if (true) ロ 'here'
➮ compare { ロ a == b; }
```

---
##### if, else, elseif ⌥ ⎇ ⥹
 - typed as `if|TAB`, `el|TAB`, `ei|TAB`.
 - `⌥` is replaced with `if`.
 - `⎇` is replaced with `else`.
 - `⥹` is replaced with `else if`.
 
```javascript
⌥ (x == 1) ロ 'GREAT'
⥹ (x == 2) ロ 'OK'
⎇ ロ 'WRONG'
``` 
 
---
##### var and def ∇ ∆ 
 - typed as `va|TAB`, `de|TAB`.
 - `∇` is replaced with `var`.
 - `∆ x` is translated to `var x =`.
 - `∆` reads as *is defined as* or just *define*.
 - `∆` supposed to be *delta*, but in fact it is a simplified form of a math symbol `≜` -- *definition* or *is defined as*.
 
```javascript
x ∆ 100
⧗ (∇ i = 0; i < x; i++)
```

---
##### stack operations `⬊` `⬈` `⬋` `⬉`
 - `⬊` `⬈` are typed as `pu|TAB` and `po|TAB`.
 - `⬊` is for `.push` and `⬈` is for `.pop`.
 - you can omit `.`, `(` and `)`.
 - `⬋` `⬉` are typed as `Pu|TAB` and `Po|TAB`.
 - `⬋` is for `.shift` and `⬉` is for `.unshift`.
 - mnemonically `shift()` is `pop()` from the other side.
 - mnemonically `unshift()` is `push()` from the other side.
 - add `(` and `)` if you push an expression.

```javascript
A ∆ []
A ⬊ 1
A ⬊ (2 + 2)
// A = [1, 4]
ロ A ⬈ ; // 4

```
---
##### superscript indexing `Xⁱ`
 - aⁱ translates to `a[i]`.
 - a⁰ translates to `a[0]`.
 - aⁱ⁰ translates to `a[i][0]`.
 - typed as `.i|TAB` or `.1|TAB`.
 - super-script index can only be single character.
 - supported are all lowercase latin characters and digits 0-9.
 - do not try to use UPPERCASE characters.
 - do not try to use multicharacter variables like `count`.

```javascript
A = [1,2,3]
i ⬌ A ロ Aⁱ
```

```javascript
B = [[1,111],[2,222],[3,333]]
i ⬌ B ロ Bⁱ¹
```

---
##### `this` and `undefined` are `⚫` `⚪` `∅`
 - `⚫` is translated to `this.`.
 - `⚪` is translated to `this`.
 - `∅` is translated to `undefined`.
 - `⚫` typed as `th|TAB`.
 - `⚪` typed as `this|TAB`.
 - `∅` typed as `un|TAB`.

```javascript
➮ f {
	⌥ (⚫name == ∅) ロ 'no name'
	⎇ ロ ⚫name
}
f()
⚫name = 'f1'
f.bind(⚪)()
```

---
##### comparison operators `≟` and `≠`
 - typed as `eq|TAB` and `ne|TAB`.
 - `≟` converts to `==`.
 - `≠` converts to `!=`.

```javascript
⌥ (x ≟ 2) ロ 'two'
⌥ (x ≠ 2) ロ 'not two'
```

---
##### clean and visible semicolon `⦙`
 - since elfu code is so condensed, many expressions fit on the same line, to improve readability of such dense code, cleaner version of semicolon `⦙` was introduced.
 - typed as `sc|TAB`.
 - `⦙` and `;` both can be used.
 
```javascript
ロ 2+2 ⦙ ロ 3+3 ⦙ ロ 4+4 ; ロ 5+5
```

---
##### `delete` and `new` are `⏀` and `⟡`
 - `⏀` typed as `dl|TAB`.
 - `⟡` typed as `new|TAB`.
 
```javascript
➮ f { ⚫name = 'f1' }
a ∆ ⟡ f
ロ 'name =', a.name
⏀ a ⦙ a = ∅
```

---
##### length of an array or a string `↥` 
 - typed as `.le|TAB`.
 - `↥` is translated to `.length`.
 - do not type '.' before `↥`, it is implied.
 
```javascript
A ∆ [1,2,3]
s ∆ 'hello'
ロ s↥, A↥
```

```javascript
x ∆ 0
⧖ (x < s↥) { ロ sˣ ⦙ x++ }
```

---
##### require directive ≣
 - typed as `re|TAB`.
 - `≣` is replaced with `require`.
 - you can use `(` and `)` or avoid them.
 
```javascript
fs ∆ ≣ 'fs'
spawn ∆ ≣ ('child_process').spawn
```

---
#####Math functions `⍽` `⬠` `⚂`
 - `⚂` is typed as `ra|TAB`.
 - `⚂` is converted to `Math.random()`
 - `⬠` is typed as `ro|TAB`.
 - `⬠` is converted to `Math.round()`
 - `⍽` is typed as `fl|TAB`.
 - `⍽` is converted to `Math.floor()`
 - `⬠` and `⍽` can omit `(` and `)` for simple expressions.
 
```javascript
⧗ (i ∆ 0 ⦙ i < 20; i++) ロ ⬠ (⚂ * 1000000)
```

```javascript
∇ a = 0.5
ロ ⬠ a, ⍽ a
```

---
##### infinite loop `∞` 
 - typed as `in|TAB`.
 - '∞' is replaced with `while(true)`.
 - sometimes you just need an infinite loop.
 - or you need a loop whose logic is more complex than `for` or `while`.
 
```javascript
	∞ step() // infinite
```

```javascript
	x ∆ 0
	∞ {
		x += ⚂ * 2
		⌥ (x ≟ 5) @
		⌥ (x ≟ 7) @
		⌥ (x > 10) @
		ロ x
	}
```

---
##### time operations `⌛` `⌚` `⚡`
 - `⌛` is converted to `setTimeout`.
 - `⌚` is converted to `setInterval`.
 - `⌿⌛` is converted to `clearTimeout`.
 - `⌿⌚` is converted to `clearInterval`.
 - `⚡` is converted to `(new Date().getTime())`.
 - `⚡` gives you millisecond tick.
 - `⌛` is typed as `st|TAB`.
 - `⌚` is typed as `si|TAB`.
 - `⚡` is typed as `tt|TAB` *(mnemonic: time tick)*.
 - `⌿⌛` is typed as `ct|TAB`.
 - `⌿⌚` is typed as `ci|TAB`.

```javascript
ロ 'please wait two seconds'
⌛(➮ {ロ 'ready';}, 2000)
```

```javascript
T ∆ ⚡ ⦙ s ∆ ''
⧖ (s↥ < 1000000) s += 'a'
ロ 'benchmark: ', ⚡ - T, 'ms'
```

--- node.js `fs` functions `⛁`, `⛃`
#####
 - `⛁` is replaced with `fs.readFileSync`.
 - `⛃` is replaced with `fs.writeFileSync`.
 - `⛁` is typed `fsrs|TAB`.
 - `⛃` is typed `fsws|TAB`.

```javascript
```

---
##### str serialization with `⌶` `⫴` `≂`.
 - `⌶` is typed as `sp|TAB`.
 - `⫴` is typed as `jo|TAB`.
 - `≂` is typed as `ts|TAB`.
 - `⌶` is compiled as `.split`
 - `⫴` is compiled as `.join`
 - you can omit `(` and `)` for simple expressions with `⌶`, `⫴` and `≂`.
 - `≂` is converted to `.toString`

```javascript
// replace all occurences of "-" with "+"
ロ '1-2-3-4-5' ⌶ '-' ⫴ '+'
// same with ( and )
s ∆ '-+'
ロ '1-2-3-4-5' ⌶ (s⁰) ⫴ (s¹)
```

```javascript
x ∆ 123.456
ロ 'length of string representation of number', x, 'is', x≂↥	
```

```javascript
fs ∆ ≣ 'fs'
ロ 'Readme contains: ' + ⛁ ('README.md') ≂ ⌶ '\n' ↥ + ' lines'
```

---
##### booleans `⦿` and `⦾`
 - `⦿` is replaced with `true`.
 - `⦾` is replaced with `false`.
 - `⦿` is typed as `tr|TAB`.
 - `⦾` is typed as `fa|TAB`.

```javascript
	a ∆ ⦿
	⌥ (a) a = ⦾
	b ∆ { initialized: ⦾ }
```

---
##### last item of a string or an array `ꕉ` `↟`
 - `ꕉ` is typed as `.la|TAB`.
 - `↟` is typed as `.lx|TAB`.
 - `ꕉ` is used to access the last item of an array or a string.
 - `ꕉ` is compiled to `[x.length - 1]`, so `xꕉ` becomes `x[x.length - 1]`.
 - `x↟` is compiled to `(x.length - 1)`.

```javascript
A ∆ ['X','Y']
➮ appendAndReturnIndex { A ⬊ a ⦙ $ A↟ }
z ∆ appendAndReturnIndex('Z')
ロ 'inserted', Aᶻ, 'at:', z
```

```javascript
A ∆ ['hey', 'there', '.', '.', 'how', 'are', 'are', 'you', '.']
➮ removeDoubles {
	R ∆ []
	i ⬌ a {
		⌥ (aⁱ ≟ Rꕉ) ♻
		R ⬊ (aⁱ)
	}
	$ R
}
ロ removeDoubles(A) ⫴ ' '
// hey there . how are you .
```

---
##### finding occurence in a string or array with `≀` `≀≀`
 - `≀` is typed as `io|TAB`.
 - `≀≀` is typed as `lio|TAB` or `io|TABio|TAB`.
 - `≀` is replaced with `.indexOf`.
 - `≀≀` is replaced with `.lastIndexOf`.
 - `(` and `)` can be used or omited.

```javascript
s ∆ 'hello world!'
ロ  s ≀ 'world', s ≀ ('o'), s ≀≀ 'o'
// 6 4 7
```

---
##### array utilities `⋃` `⨄` `ꔬ` `⧉` `ꗚ` `❄`, string and character utilities `△` `◬` `⩪`
 - `⋃` is typed as `sl|TAB`.
 - `⨄` is typed as `pl|TAB`.
 - `ꔬ` is typed as `fi|TAB`.
 - `⧉` is typed as `ma|TAB`.
 - `ꗚ` is typed as `aa|TAB`.
 - `❄` is typed as `so|TAB`.
 - `⋃` is replaced with `.slice`.
 - `⨄` is replaced with `.splice`.
 - `ꔬ` is replaced with `.filter`.
 - `⧉` is replaced with `.map`.
 - `ꗚ` is replaced with `.concat`.
 - `❄` is replaced with `.sort`.
 - `◬` is typed as `cc|TAB`.
 - `△` is typed as `ca|TAB`.
 - `⩪` is typed as `su|TAB`.
 - `◬` is replaced with `.charCodeAt`.
 - `△` is replaced with `.charAt`.
 - `⩪` is replaced with `.substr`.

```javascript
➮ numbersOnly { $ a ⌶ '' ꔬ (➮ { $ a◬(0) <= 57 }) }
ロ numbersOnly('a1b2c4d8q11')
```

```javascript
// same as above. but sorted
➮ numbersOnly { $ a ⌶ '' ꔬ (➮ { $ a◬(0) <= 57 }) }
ロ numbersOnly('a1b2c4d8q11')❄ (➮ { $a - b })
```

---
##### symbolic variables
 - there are three types of symbolic variables.
 - the goal is to provide more condense, formula-like notation.
 - `α` `γ` `β` ... `ζ` are *greek letters*.
 - Javascript supports greek letters, no translation is needed.
 - Typing in greek: alf=α bet=β gam=γ del=δ eps=ε zet=ζ eta=η tet=θ iot=ι kap=κ lam=λ muu=μ nuu=ν xii=ξ pii=π roo=ρ sig=σ tau=τ ups=υ fii=φ chi=χ psi=ψ ome=ω.
 
```javascript
∇ α = 10, δ = 5
α += δ
ロ 'alfa plus delta is:', α
```

 - `ⓐ` `ⓑ` `ⓒ` ... `ⓩ` are *encircled letters*. 
 - encircled letters are typed `ooa|TAB`, `oob|TAB`, `ooz|TAB` etc.
 - they are useful if you are out of latin letters.
 - internally they are represented as `_oo_0` to `_oo_26`.

```javascript
∇ ⓐ = 0, ⓩ = 26
ロ ⓐ, ⓩ
```
 - `❶` `❷` `①` `②` are `tags` or `labels`, they have special syntax.
 - `❶` is a *label definition*, `❶ 5` equals to `;var var0 = 5`.
 - `①` is a *label reference*, or usage, `ロ ①` will convert to `console.log(var0)`.

```javascript
❶ 'hello' ❷ 'world'
ロ ①, ②
```

#Usage
 - install with **npm**, `[sudo] npm i -g elfu`.
 - `yy <program>` run the `.yy` program.
 - `yyj program.yy` convert `program.yy` to Javascript. Data is written to standart outout.
 - `jyy program.js` convert Javascript to Elfu.
 - `require('elfu'); require('example.yy')` you can require modules written in Elfu.


#Dotcall syntax
 - Elfu supports *dotcall* syntax.
 - dotcall is callback hell remedy.
 - read [dotcall README][101] for details.

[101]: https://github.com/exebook/dotcall

#Feedback
 - post your ideas and other feedback in *issues* on github page.
 - Github page is https://github.com/exebook/elfu.
 - author's email: `exebook gmail com`
 - author's VK page: http://vk.com/chucknorrisgriboedov
 