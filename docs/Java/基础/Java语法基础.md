# Java基础

## 关键词 throw & throws

`throw` 用来主动抛出错误。

> 程序会在某个错误抛出后立刻停止向下的执行，错误会一直向上传递直到被匹配的 `try-catch` 块捕获，之后程序会从此块开始继续运行；但如果错误一直传递到了程序顶层，则会被默认的 *exception handler* 捕获，然后程序会被终止。

`thorows` 用来修饰方法，表示该方法可能会抛出相应的错误，在被调用的时候需要使用 `try-catch` 块来包裹。

```java
class Main {
    public static void main(String[] args) throws InterruptedException {
        Thread.sleep(10000);
        System.out.println("Hello World");
    }
}
```

参考：[throw and throws in Java - GeeksforGeeks](https://www.geeksforgeeks.org/throw-throws-java/)



## 使用随机数

方法一：

```java
double a = Math.random(); // [0.0-1.0)

double random = Math.random() * 49 + 1; // [1.0,50.0)
int random = (int) (Math.random() * 50 + 1); // [1,50]
```

方法二：

```java
Random rand = new Random();
int value = rand.nextInt(50); // [0-49]
```

参考：[Getting random numbers in Java - Stack Overflow](https://stackoverflow.com/questions/5887709/getting-random-numbers-in-java)



## 【概念】POJO vs JavaBeans

`POJO` *Plain Old Java Object*，就是 Java 普通的类。

`JavaBean` 则多了一些限制：

1. 只能有一个无参构造器
2. 属性都是 *private* 的
3. 通过 *public* 的 *getters / setters* 来访问、修改属性
4. 根据需要应实现**序列化**接口



参考：[What Do POJO and Bean Mean in Java? How Are They Different? | by Vikram Gupta | Javarevisited | Medium](https://medium.com/javarevisited/what-do-pojo-and-bean-mean-in-java-how-are-they-different-b21d276ce1d8)