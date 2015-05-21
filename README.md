#elfu

Elfu is highly experimental symbolic language. UNICODE contains thousands and thousands of symbols, why not use them?

- Elfu stands for elvish functional language or elvish numeric gongfu.
- Elfu in elvish is pronounced *hosti lammen*.
- Elfu is Javascript compatible, you can just use Javascript in Elfu file.
- Elfu is written in Javascript itself.
- Elfu file extension is **.yy** *(this is elvish)*
- To type symbols we use TAB completion feature of the editor.
- Most of symbols are just replaced with their Javascript counterparts.
- Some symbols are parsed in a special way, like `➮` or `⬌`.
- Editors known to be Elfu-friendly are Sublime Text, Geany, Deodar.
- If your computer does not show all symbols, there is a font file *elfu.ttf*.

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
##### break statement `@`
 - `@` is replaced with `break`.

```javascript
⧖ (true) {
	step()
	if (finished()) @
}
```

---
##### each looping `⬌`
 - typed as `ea|TAB`.
 - enough typing `for (var i = 0; i < obj.length; i++)`.
 - just type `i ⬌ obj`, it converts to the above.

```javascript
var a = [1,2,3]
i ⬌ a console.log(a[i])
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
 - ≣ is replaced with `require`.
 - you can use `(` and `)` or avoid them.
 
```javascript
fs ∆ ≣ 'fs'
spawn ∆ ≣ ('child_process').spawn
```

---
#####Math functions `⍽` `⬠` `⚂`
 - `⚂` is typed as `ra|TAB`.
 - `⚂` is converted to Math.random()
 - `⬠` is typed as `ro|TAB`.
 - `⬠` is converted to Math.round()
 - `⍽` is typed as `fl|TAB`.
 - `⍽` is converted to Math.floor()
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

---
#####
 - 

```javascript
```

---
#####
 - 

```javascript
```

---
#####
 - 

```javascript
```

---
#####
 - 

```javascript
```












 