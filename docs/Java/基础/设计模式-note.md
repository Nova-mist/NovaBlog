# 设计模式

## 观察者模式

🟠谁是观察者？观察者是收到通知的对象，可以存在多个。

观察者模式又叫做【发布-订阅】（Publish/Subscribe）模式。

> **观察者模式**定义了一种一对多的依赖方式，让多个观察者对象同时监听某一个主题对象。这个主题对象在状态发生变化时会通知所有观察者对象，使它们能够自动更新自己。

**关键代码：**在抽象类里有一个 ArrayList 存放观察者们。

🟠Java中已经有了对观察者模式的支持：

- 观察者实现Observer接口的 `update` 方法来获取通知
- 通知者（被观察者）继承Observable类来发出通知，使用 `addObserver` 和 `deleteObserver` 来增删观察者 并需要覆盖 `setChanged` 和 `clearChanged` 方法控制通知者是否改变的状态，只有改变了，调用 `notifyObservers` 方法才会主动通知。

`java.util` 包含最基本的 Observer 接口与 Observable 类。

> Observable 是一个类，将关键的方法保护起来。可以扩展 `java.util.Observable` 或自己实现一整套观察者模式。

❓JavaBeans也包含观察者模式。

🟢自己实现需要维护一个ArrayLIst和state的变化。

## 代理模式

> 代理模式（Proxy）为其他对象提供一种代理以控制对这个对象的访问。

🟠Spring AOP就是代理模式。

**关键代码：**实现与被代理类组合。

> **注意事项：**
>
> 1. 和适配器模式的区别：适配器模式主要改变所考虑对象的接口，而代理模式不能改变所代理类的接口。
> 2. 和装饰器模式的区别：装饰器模式为了增强功能，而代理模式是为了加以控制。

应用：

- 远程代理，用本地服务代理远程的服务。
- 虚拟代理，用来存放实例化需要很长时间的真实对象，比如网页中加载的图片。
- 安全代理，用来控制真实对象访问时的权限。
- 智能引用，当调用真实的对象时，代理处理另外一些事情，比如上锁、持久化、记录引用次数来及时释放。

## 适配器模式

> 适配器模式（Adapter）将一个类的接口转换成客户希望的另外一个接口。Adapter模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

🟠jdbc就是使用了适配器模式。

**何时使用：**

1. 系统需要使用现有的类，而此类的接口不符合系统的需要。（**接口不兼容**）
2. 想要建立一个可以重复使用的类，用于与一些彼此之间没有太大关联的一些类，包括一些可能在将来引进的类一起工作，这些源类不一定有一致的接口。

**关键代码：**适配器继承或依赖已有的对象，实现想要的目标接口。

🟠适配器不是在详细设计时添加的，而是解决正在服役的项目的问题。

## 装饰器模式

> 装饰器模式（Decorator）动态地给一个对象添加一些额外的职责，就增加功能来说，装饰器模式相比生成子类更为灵活。

**何时使用：**在不想增加很多子类的情况下扩展类。

**关键代码：** 1、Component 类充当抽象角色，不应该具体实现。 2、修饰类引用和继承 Component 类，具体扩展类重写父类方法。

![image-20220716101556631](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207161016304.png)

## 单例模式

> 单例模式（Singleton）保证一个类仅有一个实例，并提供一个访问它的全局访问点。

**关键代码：**构造函数是私有的。

🟠将控制单例的职责从new的地方转移到构造函数中。

❓**注意事项：**getInstance() 方法中需要使用同步锁 synchronized (Singleton.class) 防止多线程同时进入造成 instance 被多次实例化。

**几种实现方式：**

1. 懒汉式，线程不安全，不支持多线程。

```java
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}  
  
    public static Singleton getInstance() {  
        if (instance == null) {  
            instance = new Singleton();  
        }  
        return instance;  
    }  
}
```

2. 懒汉式，线程安全，效率低

```java
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}  
    public static synchronized Singleton getInstance() {  
        if (instance == null) {  
            instance = new Singleton();  
        }  
        return instance;  
    }  
}
```

3. 🟢饿汉式，线程安全，效率高，占用内存

```java
public class Singleton {  
    private static Singleton instance = new Singleton();  
    private Singleton (){}  
    public static Singleton getInstance() {  
     return instance;  
    }  
}
```

4. 双重校验锁，线程安全，高性能

```java
public class Singleton {  
    private volatile static Singleton singleton;  
    private Singleton (){}  
    public static Singleton getSingleton() {  
    if (singleton == null) {  
        synchronized (Singleton.class) {  
            if (singleton == null) {  
                singleton = new Singleton();  
            }  
        }  
    }  
    return singleton;  
    }  
}
```

5. 登记式/静态内部类，线程安全，懒加载
   Singleton类被装载，instance不一定被初始化

```java
public class Singleton {  
    private static class SingletonHolder {  
    private static final Singleton INSTANCE = new Singleton();  
    }  
    private Singleton (){}  
    public static final Singleton getInstance() {  
        return SingletonHolder.INSTANCE;  
    }  
}
```

## 工厂模式

> 工厂模式（Factory）定义一个创建对象的接口，让其子类自己决定实例化哪一个工厂类，工厂模式使其创建过程延迟到子类进行。

**主要解决：**主要解决接口选择的问题。

**关键代码：**创建过程在其子类执行。

![image-20220716112330638](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207161123081.png)

🟠简单工厂直接将分类的逻辑放在实体类中。也可以分别实现工厂的接口，进一步解耦。

## 抽象工厂模式

> 抽象工厂（Abstract Factory）提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们具体的类。

**关键代码：**在一个工厂里聚合多个同类产品。

🟠所有在用简单工厂的地方，都可以考虑用反射技术+配置文件来替换switch或if，解除分支判断带来的耦合。

![image-20220716154156202](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207161541337.png)

**抽象工厂有多个大类别的产品。**

先获取具体的工厂，再获取具体的产品，最后才调用产品的方法。
