# 特性与语法

## Async Await

**简化异步执行代码**

1. 创建异步执行的函数

```js
function sendRequest() {
    return new Promise(function(resolve, reject) {
        // Promise完成任务后调用 resolve 函数
        // 没有完成调用 reject 函数
        setTimeout(function() {
            // 2秒后执行
            resolve("kikukaji");
            // 抛出错误的情况
            // reject("Request rejected due to server error");
        }, 2000);
    });
}
```

2. 版本一：使用 `then` 来调用回调函数

```js
let promise = sendRequest();
promise.then(function(username) {
    console.log(username);
});
```

3. 🟢版本二：使用 `async` 和 `await`，并用 `try-catch` 来捕获错误信息。

```js
async function getUsername() {
    try {
        // await 关键字用来等待 promise 完成任务
     let username = await sendRequest();
  console.log(username);
    } catch (message) {
        console.log(`Error: ${message}`);
    }
}

getUsername();
```

4. 🟢版本三：使用 `fetch` 来请求实际数据并转换成 json 格式。

```js
async function getUsername() {
    try {
     let username = await fetch("https://api.sampleapis.com/coffee/hot");
        username = await username.json();
  console.log(username);
    } catch (message) {
        console.log(`Error: ${message}`);
    }
}

getUsername();
```

## Vue Refs

创建响应式且可变的 ref 对象。

```js
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

## Arrow function

Arrow functions don't have their own bindings to `this` , `arguments` or `super`.

[Arrow function expressions - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#syntax)

### syntax

```js
param => expression

(param1, paramN) => expression

param => {
  const a = 1;
  return a + param;
}

(param1, paramN) => {
  const a = 1;
  return a + param1 + paramN;
}

// return an object literal expression
params => ({ foo: "a" })

// default parameters
(a=400, b=20, c) => expression

// destructing within params
([a, b] = [10, 20]) => a + b;  // result is 30
({ a, b } = { a: 10, b: 20 }) => a + b; // result is 30

// rest parameters (accept indefinite number)
(a, b, ...r) => expression
```

### examples

```js
const max = (a, b) => a > b ? a : b;

const arr = [5, 6, 13, 0, 1, 18, 23];
// reduce() accepts a function as an accumulator
const sum = arr.reduce((a, b) => a + b);
// 66

const even = arr.filter(v => v % 2 == 0);
// [6, 0, 18]

const double = arr.map(v => v * 2);
// [10, 12, 26, 0, 2, 36, 46]
```

## Destructuring assignment

🟢Unpack values from arrays, or properties from objects, into distinct variables.

### examples

#### array

**swapping variables**

```js
let a = 1;
let b = 3;

[a, b] = [b, a];
console.log(a); // 3
console.log(b); // 1

const arr = [1, 2, 3];
[arr[2], arr[1]] = [arr[1], arr[2]];
console.log(arr); // [1, 3, 2]
```

**deal with returned array from a function**

```js
function f() {
  return [1, 2, 3];
}

const [a, b] = f();
console.log(a); // 1
console.log(b); // 2

const [a, , b] = f();
console.log(a); // 1
console.log(b); // 3

const [c] = f();
console.log(c); // 1
```

**Using array destructuring on any iterable**

```js
const [a, b] = new Map([[1, 2], [3, 4]]);
console.log(a, b); // [1, 2] [3, 4]

// non-iterables cannot be destructured as arrays
const obj = { 0: "a", 1: "b", length: 2 };
const [a, b] = obj;
// TypeError: obj is not iterable
```

#### object

```js
const user = {
  id: 42,
  isVerified: true,
};

const { id, isVerified } = user;

console.log(id); // 42
console.log(isVerified); // true
```

**Assigning to new variable names**

```js
const o = { p: 42, q: true };
const { p: foo, q: bar } = o;

console.log(foo); // 42
console.log(bar); // true
```

**Combined Array and Object Destructuring**

```js
const props = [
  { id: 1, name: 'Fizz'},
  { id: 2, name: 'Buzz'},
  { id: 3, name: 'FizzBuzz'}
];

const [,, { name }] = props;

console.log(name); // "FizzBuzz"
```

🟠**For of iteration and destructuring**

```js
const people = [
  {
    name: 'Mike Smith',
    family: {
      mother: 'Jane Smith',
      father: 'Harry Smith',
      sister: 'Samantha Smith',
    },
    age: 35,
  },
  {
    name: 'Tom Jones',
    family: {
      mother: 'Norah Jones',
      father: 'Richard Jones',
      brother: 'Howard Jones',
    },
    age: 25,
  }
];

for (const { name: n, family: { father: f } } of people) {
    console.log('Name: ' + n + ', Father: ' + f);
}

// "Name: Mike Smith, Father: Harry Smith"
// "Name: Tom Jones, Father: Richard Jones"
```

## 生成数组序列

[JavaScript 中生成数组序列的几种方法 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/505000959)

## 对象数组排序

[javascript - How to sort an object array by date property? - Stack Overflow](https://stackoverflow.com/questions/10123953/how-to-sort-an-object-array-by-date-property)

```js
array.sort(function(a,b){
  // Turn your strings into dates, and then subtract them
  // to get a value that is either negative, positive, or zero.
  return new Date(b.date) - new Date(a.date);
});
```

## reduce() 数组累加器

```js
const array1 = [1, 2, 3, 4];

// 0 + 1 + 2 + 3 + 4
const initialValue = 0;
const sumWithInitial = array1.reduce(
  (previousValue, currentValue) => previousValue + currentValue,
  initialValue
);

console.log(sumWithInitial);
// expected output: 10
```

最开始的 `previousValue` 值为0，之后的值是每次做运算的结果。

参考：

- [js中的reduce()函数讲解_javascript技巧_脚本之家 (jb51.net)](https://www.jb51.net/article/154881.htm)
- [Array.prototype.reduce() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
