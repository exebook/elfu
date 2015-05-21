# elfu

Elfu is highly experimental symbolic language. UNICODE contains thousands and thousands of symbols, why not use them?

- Elfu stands for elvish functional language or elvish numeric gongfu.
- Elfu in elvish is pronounced *hosti lammen*.
- Elfu is Javascript compatible, you can just use Javascript in Elfu file.
- Elfu file extension is **.yy** *(this is elvish)*
- To type symbols we use TAB completion feature of the editor.

#####function definition ➮
- typed as "fu|TAB"
- Elfu translator will replace `➮` with `function`. 
- You can avoid `(`, `)` and `,` in argument declaration.
- If you omit any arguments, arguments `a` `b` `c` are default.
- Use `➮f(){}` syntax to declare a function without arguments.

```
➮ compare (a, b) { console.log(a == b) }
➮ compare a b { console.log(a == b) }
➮ compare { console.log(a == b) }
```


