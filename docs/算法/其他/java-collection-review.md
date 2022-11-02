---
title: 复习Java集合
date: 2022-03-25 19:31:03
tags:
  - Java
  - 算法
---



# 复习Java集合

参考Java核心技术、~~Java编程思想~~。

![blog-image-20220325-1648208416](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/blog-image-20220325-1648208416.jpg)

<!-- more -->

## 集合接口

> 如何使用标准库中的集合类。

**Java集合类库将集合的接口与实现分离。**

例如一个队列接口可以简单写为：

```java
interface Queue<E> {
    void add(E element);
    E remove();
    int size();
}
```

而队列的实现通常有两种实现方式：

1. 使用循环数组
2. 使用链表

![image-20220324160211150](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220324160211150.png)

⭐如果需要一个循环数组队列，可以使用ArrayDeque类；如果需要一个链表队列，可以使用LinkedList类，实现了Queue接口。

**当在程序中使用队列时，不需要关心具体使用了哪种实现。**

⭐在构建集合对象时，可以使用接口类型存放集合的引用，这样只需要在构建集合对象处更改实现类，而不需要更改后面的逻辑部分。

```java
// 只需要修改调用构造器的地方就能更改具体实现
Queue<Customer> expressLane = new CircularArrayQueue<Customer>(100);
expressLane.add(new Customer("Harry"));

Queue<Customer> expressLane = new LinkedListQueue<Customer>();
expressLane.add(new Customer("Harry"));
```

---

**集合接口和迭代器接口**

集合类的基本接口是Collection接口

```java
public interface Collection<E> {
    boolean add(E element);
    Iterator<E> iterator();
    // ...
}
```

iterator方法返回一个实现了Iterator接口的对象，可以使用此迭代器对象依次访问集合中的元素。

Iterator接口：

```java
public interface Iterator<E> {
    E next();
    boolean hasNext();
    void remove();
}
```

依次访问集合中的元素：

```java
Collection<String> c = "Hello";
Iterator<String> iter = c.iterator();
while (iter.hasNext()) {
    String element = iter.next();
    // do sth.
}
```

**现在通常使用 for each 循环来遍历集合**

⭐for each 循环可以与任何实现了Iterable接口的对象一起工作，因为Collection接口扩展了Iterable接口，标准类库中的任何集合都可以使用 for each 循环。

Iterable接口：

```java
public interface Iterable<E> {
    Iterator<E> iterator();
}
```

❗C++的标准模板库中，迭代器根据数组索引建模，给定一个迭代器就可以查看指定位置上的元素 vec[i] ，并且不需要查找元素就可以将迭代器向前移动一个位置，就像数组一样。而在Java中，查找操作与位置变更紧密相连——**查找一个元素的唯一方法是调用next**，在执行查找操作的同时迭代器的位置随之向前移动。

Collection和Iterator都是**泛型接口**，可以编写任何集合类型的使用方法。

AbstractCollection类实现了Collection接口的一些常用方法如contains，只剩下了一些基础的抽象方法如size、Iterator。因此一个具体的集合类只需要实现或重写AbstractCollection类的部分方法。

![image-20220324165832044](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220324165832044.png)

## 具体的集合

![image-20220324170015477](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220324170015477.png)

> 除了以 Map 结尾的类之外，其他类都实现了 Collection 接口。

### 链表

**Java中的LinkedList是双向的。**

一个删除的示例：

```java
// LinkedList 实现了 List
List<String> staff = new LinkedList<>();
staff.add("A");
staff.add("B");
staff.add("C");
Iterator iter = staff.iterator();
String first = (String) iter.next();
String second = (String) iter.next();
iter.remove(); // remove last visited element -- second B
iter.next();
iter.remove(); // remove C
```

⭐只有对自然有序的集合使用迭代器来添加元素才有实际意义。链表是一个有序集合，set 类型则完全无序。因此add方法的实现不在 Iterator 接口而是在子接口 ListIterator 中。

```java
interface ListIterator<E> extends Iterator<E> {
    void add(E element);
    void set(E elemnet);
    // ...
}
```

**如果需要添加元素或修改元素，就要使用 ListIterator，从前后两个方向遍历链表中的元素。**

❗如果迭代器发现它的集合被另一个迭代器修改了，或是被该集合自身的方法修改了，就会抛出一个ConcurrentModificationException异常。

```java
// 异常测试
List<String> list = new LinkedList<>();
list.add("Hello");
list.add("World");
ListIterator<String> iter1 = list.listIterator();
ListIterator<String> iter2 = list.listIterator();
iter1.next();
iter1.remove();
iter2.next(); // throws ConcurrentModificationException
```

避免抛出异常的原则：

- 唯一的能写的迭代器只能与多个只读的迭代器共存。

检测到并发修改的方法：

- 每个迭代器维护一个独立的计数器，在每个迭代方法的开始处检查是否与集合的改写操作计数的值相同，不一致抛出 ConcurrentModificationException 异常。

**链表不支持快速地随机访问，只能从头遍历来访问特定元素，并且 LinkedList 对象根本不做任何缓存位置信息的操作。**

❗一个效率极低的遍历链表的方法：

```java
// 每次查找都要从头部或尾部重新开始搜索
for (int i = 0; i < list.size(); i++) {
    list.get(i);
    // do sth.
}
```

⭐Java 迭代器指向两个元素之间的位置，而列表迭代器接口 ListIterator 有一个返回当前位置的索引的方法，所以可以产生两个索引：nextIndex 方法返回下一次调用 next 方法时返回元素的整数索引，previousIndex 方法返回下一次调用 previous 方法时返回元素的整数索引，它们之间相差1。

**打印集合中的元素，可以调用 AbstractCollection 类中的 toString 方法。**

![image-20220324193330116](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220324193330116.png)

![image-20220324193920207](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220324193920207.png)

### 数组列表

List 接口用于描述一个有序集合。

**有两种访问元素的协议**：

1. 迭代器方法
2. get、set方法随机访问每个元素，不适用于链表，适合数组列表。

ArrayLIst 类也实现了 List 接口，封装了一个动态再分配的对象数组。

### 散列集

散列表（hash table）为每个对象计算一个散列码（hash code），具有不同数据域的对象将产生不同的散列码。

**在 Java 中，散列表用链表数组实现。**

![image-20220324195138954](C:\Users\ysama\AppData\Roaming\Typora\typora-user-images\image-20220324195138954.png)

散列表可以用于实现 set 类型，set 是没有重复元素的元素集合，set 的 add 方法首先在集中查找要添加的对象，如果不存在就添加。

⭐Java 集合类库提供了一个 HashSet 类，实现了基于散列表的集。

**散列集迭代次随机访问所有的桶。**

```java
Set<String> words = new HashSet<>();
Scanner sc = new Scanner(System.in);
while(sc.hasNext()) {
    String word = sc.next();
    words.add(word);
}
for (String word : words) {
    System.out.println(word);
}
```

```bash
javac SetTest.java
java SetTest < words.txt
```

### 树集

**TreeSet 类与散列集十分类似，但是一个有序集合，可以自动对元素进行排序。**

❗排序是用树结构完成的（红黑树），每次将一个元素添加到树中时，都被放置在正确的排序位置上，因此迭代器总是能按排好的顺序访问每个元素。

**排序中的比较**

方法一：**指定单一规则**，插入树集的元素实现 Comparable 接口自定义排列顺序

```java
public interface Comparable<T> {
    int compareTo(T other);
    /*
    a == b 返回 0
    a在b之前 返回负数
    a在b之后 返回正数
    */
}
class Item implements Comparable<Item> {
    public int compareTo(Item other) {
        return partNumber - other.partNumber;
    }
}
```

方法二：**定制一个比较器**，将 Comparator 对象传递给TreeSet 构造器来告诉树集使用不同的比较方法

```java
// 匿名类
SortedSet<Item> sortByStr = new TreeSet<Item>(new Comparator<Item> {
    public int compare(Item a, Item b) {
        String strA = a.getStr();
        String strB = b.getStr();
        return strA.compareTo(strB);
    }
});
```

### 队列与双端队列

队列可以有效地在尾部添加一个元素，在头部删除一个元素。

**双端队列可以在头部和尾部同时添加或删除元素，但不支持在队列中添加元素。**

⭐双端队列接口 Deque 由 ArrayDeque 和 LinkedList 类实现，这两个类都提供了双端队列，并且可以增加队列的长度。

![image-20220324205700760](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220324205700760.png)

### 优先级队列

Priority Queue 中的元素可以按照任意顺序输入，并按照排序的顺序进行检索。**调用 remove 方法总会获得当前优先级队列中最小的元素。**

❗优先级队列使用堆，用迭代的方式获取最小的元素，并没有对元素进行排序。

> 堆实际上是一个可以自我调整的二叉树。

### 映射表

映射表（map）用来存放键值对，有了键就能够查找到值。

**Java类库中的 HashMap 和 TreeMap 都实现了 Map 接口。**

散列映射表对键进行**散列**，树映射表用键的整体顺序对元素进行**比较排序**，两种映射表都无法对与键关联的值进行操作。

一个示例：

```java
// HashMap implements Map
Map<String, Employee> staff = new HashMap<String, Employee>();
Employee harry = new Employee("Harry Poter");
staff.put("1", harry);
// get harry
Object e = staff.get("1");
```

**键是唯一的。**

⭐put 方法会返回用这个键参数存储的上一个值，如果对同一个键调用两次 put 方法，第二个值会取代第一个值，而第一个值被 put 方法返回。

返回键集、值集合（不是set可重复）、键值对集的方法：

```java
Set<K> keySet()

Collection<K> values()

Set<Map, Entry<K, V>> entrySet()
```

❗如果想要同时查看键与值，可以通过枚举各个条目（entries）查看，以避免对值进行查找。

```java
for (Map.Entry<String, Employee> entry : staff.entrySet()) {
    String key = entry.getKey();
    Employee value = entry.getValue();
}
```

![image-20220325184928557](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220325184928557.png)

## 集合框架

**集合框架的接口**

![image-20220325185547514](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220325185547514.png)

抽象类实现了集合接口的大部分方法，具体的实现类只需要扩展抽象类。

**集合框架中的类**

![image-20220325185711894](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220325185711894.png)

**轻量级包装器**

Arrays 类的静态方法 asList 返回一个包装了普通 Java 数组的 List 包装器。这个方法可以将数组传递给一个期望得到列表或集合变元的方法。

```java
// 传递一个数组
Item[] items = new Item[10];
List<Item> itemList = Arrays.asList(items);
// 传递可变数量参数
List<String> names = Arrays.asList("Amy", "Bob", "Cate");
```

❗返回的对象不是 ArrayList，而是一个视图对象，只带有访问底层数组的 get 和 set 方法，改变数组大小的所有方法（add、remove）都会抛出 UnsupportedOperationException 异常。**但可以通过这个视图对象创建新的ArrayList。**

```java
List<String> name = Arrays.asList("Amy", "Bob", "Cate");
List<String> names = new LinkedList<>(name);
names.add(1, "hhh");
for (String str : names) {
    System.out.println(str);
}
```
