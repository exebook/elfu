#Elfu
### Elfu is a radical syntax sugaring for JavaScript.

Elfu expands Dotcall github.com/exebook/dotcall, the callback hell remedy. Below you can find the original documentation for Dotcall.

### NO DOCS YET FOR ELFU SCRIPT

#Dotcall
###Dotcall is a callback hell remedy.

Instead of building complex async ladders, you can write your code in a manner similar to conventional synchronous style.

The theory behind it is this:

 - Most of the time the result of an asynchronous functions is not used, and after it was called, the upper functions also exits immediately. Although sometimes the upper function can do something after it called the first `async(callback)`, usually it does nothing and returns. Sometimes the asynchronous function could return something useful, but most of the time it just returns `undefined` and the real stuff is returned with `callback(result)`.
 - When the above situation is true, the special syntax sugar can be applied.


The syntax of `dotcall` is very simple, when the call's brace is preceeded with a dot `.(`, then the call is converted (hence the name):

```javascript
var a = f.()
console.log(a)
```

Is replaced with
```javascript
f(function(DOTCALL1) { var a = DOTCALL1
    console.log(a)
})
```

###New: loops with for.() and while.()

You can use `for.()` and `while.()` syntax. `break` statement is supported. Nesting loops are not tested, they will probably not work. You can use very long loops, there will be no stack overflow, because async calls are made with `setImmediate`.

```javascript
function bar(s,f) {
	setTimeout(function() {
		console.log('bar'+s)
		f()
	}, 200)
}

function main() {
	for.(var i = 0; i < 5; i++) {
		bar.('X'::2)
	}
	console.log('AFTER')
}
```

the above loop is translated to this:

```javascript
function main() {
   var i = 0; function DOTCALL2(DOTCALL3) {
        if ((i < 5) == false) { DOTCALL3(); return }
        bar('X', function (DOTCALL5,DOTCALL6) { DOTCALL6
     i++; setImmediate(DOTCALL2, DOTCALL3)
   }) }
   DOTCALL2(function() {
   console.log('AFTER')
})}

```
In case your callback uses more than one parameter, there is an extended syntax, called **double colon** syntax.
```javascript
redis.set.('a', 12345)
redis.get.('a' :: err, data)
if (err) console.log(err)
console.log(data) // outputs 12345
```

Another case of **double colon** notation is to specify the useful argument number like this:
```javascript
redis.set.('a', 12345)
console.log(redis.get.('a' :: 2))
```
the above outputs `12345`, because Redis function `get(err, data)` uses `data` as a second parameter

###Usage tips
 - beware of using `this`, because it will be bound to silently created functions, use known patterns like `var me = this` and then use `me` instead.
 - remember that new visibility block is created after each `.(`
 - `return` can be used to abort your block of functions, but remember that although the execution will not happen after the line with `return`, the `return` is actually rather just an exit, returning values from nested hell entries is way too tricky.
 - do not be afraid of strange error messages returned by Node.js if you made a typo. They will not necessarily point you at the line where the typo was just made. You will need to understand what's going on wrong.
 - if you want to see the intermediate output either use node+chrome debugger tools or enable saving the intermediate result to a file in `dotcall.js` manually

###install with npm
```javascript
npm install elfu
```

###install with git
```javascript
git clone https://github.com/exebook/elfu.git
```

### require() syntax:
```
require('dotcall')
require('./sample.dc')
```

###console invocation:
```
node .call.js sample.dc
```

###Complete minimalistic example `sample.dc`:
```javascript
function foo(f) {
	setTimeout(function() { f(true) }, 200)
}

function bar(x, f) {
	setTimeout(function() { f(500 + x) }, 200)
}

 function main() {
	if (foo.()) {
		var d = bar.(55)
		console.log(d)// outputs 555
	}
}
main()
```

###Minimalistic Redis example:
```javascript
var redis = require("redis").createClient()

function main() {
	redis.set.('a', 555)
	redis.get.('a' :: e, d)
	console.log(d)
	if (d == '555') {
		redis.set.('b', parseInt(d) + 1)
		var d = redis.get.('b' :: 2)
		console.log(d)
		redis.del.('a')
		redis.del.('b')
		redis.quit()
	} else {
		redis.quit()
	}
}

main()
```

###extension handling
By default **dotcall** require() will only handle `.dc` file extension, leaving normal `.js` intact. But if you want you can tell it to handle any extension you want like this:

```javascript
var dotcall = require('dotcall')
dotcall.handleExt('.js')
require('./sample.js') // now .js is handled with dotcall, beware
```

###implementation details
**dotcall** does not use any established lexers or parsers, instead it has a very simple lexer, and then does some logic with the array of returned tokens.

###files
 - .README.md - this readme
 - dotcall.js - the file you require()
 - dcconvert.js - actual conversion functions
 - sample.dc - minimalist sample
 - redis.dc - example of some calls to Redis DB
 - .call.js - console node wrapper
 - testapp.js - example of require('dotcall')
 
 ##further reading
 
 https://bjouhier.wordpress.com/2012/03/11/fibers-and-threads-in-node-js-what-for/
 