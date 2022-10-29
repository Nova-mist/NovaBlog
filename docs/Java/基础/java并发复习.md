# 并发

## 概念

### 进程与线程

- 进程是程序运行**资源分配**的最小单位，分为系统进程和用户进程。
- 线程是**CPU调度**的最小单位，必须依赖与进程存在。（操作系统调度的最小单位）

**进程是多个线程的容器。**

**安全性：**

- 进程之间相互独立
- 同一个进程里面的多线程资源共享

---

### 并发与并行

- 并行：进程产生的总线程数小于CPU的核心数，则不同进程的线程可以分配给不同的CPU来运行。**各个进程是真正地同时运行。**
- 并发：进程分配的线程数大于CPU的核心线程数。**一个核心同时运行多个进程，涉及调度。**

## Thread

### 四种实现方法

1. 继承Thread

   ```java
   public class myThread extends Thread {
       @Override
       public void run(){
           super.run();
           // do sth.
       }
   }
   public class ThreadTest {
       psvm {
           myThread thread = new myThread();
           thread.start();
       }
   }
    
   // 匿名类写法
   new Thread() {
       @Override
       public void run() {
           // do sth.
       }
   }.start();
   ```

2. 实现Runnable接口

   ```java
   public class myThread implements Runnable {
       @Override
       public void run(){
           // do sth.
       }
   }
   public class ThreadTest {
       psvm {
           myThread thread = new myThread();
           new Thread(thread).start();
       }
   }
   ```

3. 实现Callable接口，实现 `call()` 方法可以返回结果。

   ```java
   public class myThread implements Callable<String> {
       @Override
       public String call() throws Exception {
           // do sth.
           return "Hello";
       }
   }
   public class ThreadTest {
       psvm {
           myThread thread = new myThread();
           FutureTask<String> futuretask = new FutureTask<String>(thread);
           new Thread(futuretask).start();
           // 只有主线程调用get方法才会继续往下面执行
           try {
               System.out.println("Return result: " + futuretask.get());
           } catch (InterruptedException e) {
               e.printStackTrace();
           } catch (ExecutionException e) {
               e.printStackTrace();
           }
       }
   }
   ```

4. 使用 Java8 引入的 lambda 语法。

```java
public class Main {
    public static void main(String[] args) throws InterruptedException{
        Thread t = new Thread( () -> {
            System.out.println(Thread.currentThread().getName() + " running...");
        });

        t.start();
        t.join();

        System.out.println("Main exit...");
    }
}
```

---

### 中断

1. Thread.stop() 强迫停止一个线程，不安全。
2. Thread.interrupt() 中断

> Java 中断机制是一种协作机制，也就是说通过中断并不能直接终止另一个程序，而需要被中断的线程自己处理中断。**不一定能成功。**

- public static boolean interrupted() 测试当前线程是否已经中断，**线程的中断状态由该方法清除**。连续两次调用总返回 false。
- public bollean isInterrupted() 测试当前线程是否已经中断，不改变中断状态。
- public void interrupt() 中断线程，**唯一可以将中断状态设置为true的方法**。

---

### 守护线程

```java
public final void setDaemon(boolean on); // 在启动线程前调用
```

**相当于后台运行程序，进程结束，守护线程自然而然地就会结束，不管其处于什么状态。**

Java的垃圾回收就是一个守护线程，另外可以用于背景音乐的播放，文字编辑器中的自动语法检查、自动保存

---

### 线程组

**线程组和线程池的区别：**

> 线程组是为了方便线程的管理，线程池是为了管理线程的生命周期，复用线程，减少创建销毁线程的开销。

---

### ThreadLocal

`Thread`对象代表一个线程，我们可以在代码中调用`Thread.currentThread()`获取当前线程。

打印当前线程名字 `Thread.currentThread().getName()`

使用 ThreadLocal 在一个线程中传递同一个对象。

```java
// 实例初始化
static ThreadLocal<User> threadLocalUser = new ThreadLocal<>();

void processUser(user) {
    try {
        threadLocalUser.set(user);
        step1();
        step2();
    } finally {
        threadLocalUser.remove();
    }
}

void step1() {
    User u = threadLocalUser.get();
    log();
    printUser();
}

void log() {
    User u = threadLocalUser.get();
    println(u.name);
}

void step2() {
    User u = threadLocalUser.get();
    checkUser(u.id);
}
```

❓可以通过 `AutoCloseable` 接口配合 `try (resource) {...}`结构，让编译器自动为我们关闭。

---

### 异常处理

1. checked exception --> try-catch
2. unchecked exception --> setUncaughtExceptionHandler()
    异常发生时传入UncaughtExceptionHandler参数的uncaughtException方法会被调用

**handle unchecked exception**:

- 定义一个类实现UncaughtExceptionHandler接口，在实现的 uncaughtException(Thread t, Throwable e) 方法里包含对异常处理的逻辑和步骤。
- 定义线程执行和逻辑。
- 在 thread.start() 前加入 thread.setUncaughtExceptionHandler()

## 线程安全的集合类

- Hashtable
- ConcurrentHashMap 使用了代码块锁而不是方法锁
- CopyOnWrite 在复制的副本中添加元素后再将原容器的引用指向新的容器
  适合**读多写少**的并发场景：白名单黑名单、商品类目地访问和更新。
  **数据一致性问题**
- StringBuffer & StringBuilder
  直接使用 `+` 拼接字符串会建立很多String型对象，会对服务器资源和性能造成影响。
  - StringBuffer线程安全。
  - StringBuilder线程不安全，没有加**synchronized**锁，但效率和性能高。

## Thread安全

CPU读取数据顺序：寄存器 -> 高速缓存 -> 内存

JMM (Java Memory Model) 规定了 JVM 有主内存和工作内存。

- 主内存就是Java堆内存，存放程序中所有的类实例、静态数据等变量，由多个线程共享。
- 工作内存存放的是该线程从主内存中拷贝过来的变量以及访问方法所获取的局部变量，每个线程私有。
- **每个线程对变量的操作都是先从主内存将其拷贝到工作内存再进行操作。**
- 多个线程需要通过主内存间接通信

线程操作某个对象时：

1. 从主存复制变量到当前工作内存 (read and load)
2. 执行代码，改变共享变量值 (use and assign)
3. 用工作内存数据刷新主存相关内容 (store and write)

**产生时序性问题**

==要保证锁定一定会被释放，就必须将 unlock() 放到 finally{} 中==

---

### 隐式锁

使用`synchronized`解决了多线程同步访问共享变量的正确性问题。但是，它的缺点是带来了性能下降。因为`synchronized`代码块无法并发执行。此外，加锁和解锁需要消耗一定的时间，所以，`synchronized`会降低程序的执行效率。

🟠资源消耗：同步方法体 > 方法内代码块 > 对象锁

```java
// 对象锁
private byte[] lock = new byte[1];
public void method() {
    synchronized(lock) {
        // do sth.
    }
}
```

```java
// 同步方法体
public synchronized void add(int n) {
    count += n; 
}
// 方法内代码块
public void add(int n) {
    synchronized(this) {
        count += n;
    }
}
```

🟠对一个静态方法添加`synchronized`修饰符，锁住的是该类的`Class`实例。

任何一个类都有一个由JVM自动创建的`Class`实例。

```java
public synchronized static void test(int n) {
    
}
// 等同于
public class Counter {
    public static void test(int n) {
        synchronized(Counter.class) {
            // ...
        }
    }
}
```

### 显示锁Lock

**ReentrantLock应该作为全局变量**

```java
private final ReentrantLock lock = new ReentrantLock();
public void method() {
    lock.lock();
    try {
        // do sth.
    } finally {
        lock.unlock();
    }
}
```

---

### 显示锁ReadWriteLock

ReadWriteLock接口提供了 readLock 和 writeLock 两种锁的机制。

**一个资源能够被多个读线程访问或者被一个写线程访问。**

- 默认非公平锁
- 重入性：写线程获取写锁后可以再次获取读取锁
- 降级锁：get WriteLock -> get ReadLock -> Release WriteLock
- 支持获取锁期间被中断
- 条件变量：Condition写入锁支持，读取锁不支持。

```java
private final Map<String, Object> map = new HashMap<String, Object>(); // 数据缓存
private final ReentrantReadWriteLock rwlock = new ReentrantReadWriteLock();
public Object readWrite(String id) {
    Object value = null;
    rwlock.readLock().lock(); // 开启读锁，从缓存中去取
    try {
        value = map.get(id);
        if (value == null) { // 如果缓存没有数据，释放读锁，上写锁
            rwlock.readLock().unlock();
            rwlock.writeLock().lock();
            try {
                if (value == null) {
                    value = "aaa";
                }
            } finally {
                rwlock.writeLock().unlock(); // 释放写锁
            }
            rwlock.readLock().lock(); // 上读锁
        } // close if
    } finally {
        rwlock.readLock().unlock(); // 释放读锁
    }
    return value; 
}
```

---

### 显示锁StampedLock

读取悲观锁：在读取之前一定要判断一下数据有没有正在被更改。

读取乐观锁：在读取之前不需要判断数据的一致性，只在提交操作时检查是否违反数据完整性。

---

### 单例模式写法

**线程安全高性能的写法：**

```java
// method 1
class Singleton {
    private static volatile Singleton instance;
    private static byte[] lock = new byte[0];
    private Singleton() {
    }
    public static synchronized Singleton getInstance() {
        if (instance == null) {
            synchronized(lock) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        } // close if
        return instance;
    }
}
// method 2
class Singleton {
    private static volatile Singleton instance;
    private static ReentrantLock lock = new ReentrantLock();
    private Singleton() {
    }
    public static Singleton getInstance() {
        if (instance == null) {
            lock.lock();
            if (instance == null) {
                instance = new Singleton();
            }
            lock.unlock();
        } // close if
        return instance;
    }
}

// method 3
public class InstanceFactory {
    private static class InstanceHolder {
        public static Instance instance = new Instance();
    }
    public static Instance getInstance() {
        return InstanceHolder.instance; // InstanceHolder类被初始化
    }
}
```

---

### volatile

[volatile Keyword in Java - GeeksforGeeks](https://www.geeksforgeeks.org/volatile-keyword-in-java/)

> “volatile” tells the compiler that the value of a variable must never be cached as its value may change outside of the scope of the program itself.

🟠锁和同步的两大特性：

- 互斥性（原子性） Mutual Exclusion，只能有一个线程执行代码块。
- 可见性 Visibility，一个线程对共享数据的修改对其他线程可见。

**Synchronized** 保证了互斥性和可见性。

**Volatile** 只保证了可见性，让变量不会被缓存，读写直接与主内存交互。

## tips

对于执行时间长的子线程，要在线程 start 之后使用 `thread.join()` ，阻塞主线程直到子线程结束。

### 多线程i++

[Thread Safety and how to achieve it in Java - GeeksforGeeks](https://www.geeksforgeeks.org/thread-safety-and-how-to-achieve-it-in-java/)

2021版Java多线程教程41：什么是原子性？i++是原子操作吗？ - 知乎 <https://www.zhihu.com/zvideo/1381705619834052608>

[volatile 关键字能保证数据的可见性,但不能保证数据的原子性](https://blog.csdn.net/yudianxiaoxiao/article/details/107592452)

- **通过 `Thread.sleep` 休眠来让原子性问题显而易见**
- volatile 不能确保原子性。虽然直接与主内存交互，但也是同时修改。
- synchronized 同步可以解决原子性问题。
- 使用原子类 AtomicInteger 可以解决原子性问题。

---

### 死锁

[Java Thread Deadlock and Livelock | Baeldung](https://www.baeldung.com/java-deadlock-livelock)

**避免死锁：**

1. 避免一个线程获取多个锁，如果有多个要确保获取的顺序是相同的（没有依赖循环）
2. 每个锁只占用一个资源
3. 使用定时锁 `lock.tryLock(timeout)` 代替内部锁

---

### 活锁

多个线程持续切换状态，总是因为不满足条件而无法执行任务。

例子：有两个线程和两把锁，每个线程都需要**固定顺序的两把锁**才能执行任务，当只得到一把的时候会释放锁并重新尝试获取。

**避免活锁：**

- 按随机的顺序来获取锁，让竞争公平。
