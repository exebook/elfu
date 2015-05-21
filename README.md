#elfu

Elfu is highly experimental symbolic language. UNICODE contains thousands and thousands of symbols, why not use them?

- Elfu stands for elvish functional language or elvish numeric gongfu.
- Elfu in elvish is pronounced *hosti lammen*.
- Elfu is Javascript compatible, you can just use Javascript in Elfu file.
- Elfu file extension is **.yy** *(this is elvish)*
- To type symbols we use TAB completion feature of the editor.
- Most of symbols are just replaced with their Javascript counterparts.
- Some symbols are parsed in a special way, like `➮` or `⬌`.

#####function definition `➮`
- typed as "fu|TAB"
- Elfu translator will replace `➮` with `function`. 
- you can avoid `(`, `)` and `,` in argument declaration.
- if you omit any arguments, arguments `a` `b` `c` are default.
- use `➮f(){}` syntax to declare a function without arguments.

```
➮ compare (a, b) { console.log(a == b) }
➮ compare a b { console.log(a == b) }
➮ compare { console.log(a == b) }
```

##### return statement `$`
 - `$` is replaced with `return`

```
    $ 2 + 2
```

##### each looping `⬌`
 - typed as "ea|TAB"
 - enough typing `for (var i = 0; i < obj.length; i++)`
 - just type `i ⬌ obj`, it converts to the above.

```
	var a = [1,2,3]
	i ⬌ a console.log(a[i])
```

##### console.log `ロ`
 - typed as `lo|TAB`
 - this is Chinese/Japanese character for *mouth*.
 