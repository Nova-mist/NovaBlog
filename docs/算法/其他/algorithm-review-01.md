---
title: 算法回顾-01 
date: 2021-09-24 15:32:54
tags:
  - 算法
---

![blog-image-21-9-29](https://raw.githubusercontent.com/Nova-mist/HexoBlogResources/main/images/2021/Julyblog-image-21-9-29.jpg)

概念、数组和链表。

<!-- more -->

## 性能分析

### 大O

**大O用来表示上界的**，当用它作为算法的最坏情况运行时间的上界，就是对任意数据输入的运行时间的上界。

**平常使用的O是一般情况下算法的时间复杂度。**

>   **快速排序是O(nlogn)的时间复杂度** 
>
>   一般情况：O(nlogn) 最好情况：O(nlogn) 最坏情况：O(n^2)

**一般情况下都是默认数据规模足够的大，时间复杂度都是省略常数项系数**：

>   O(1)常数阶 < O(logn)对数阶 < O(n)线性阶 < O(n^2)平方阶 < O(n^3)(立方阶) < O(2^n) (指数阶)

也要考虑数据规模很小的情况

---

### 表达式化简

1.  去掉常数项
2.  保留最高项

>   O(2*n^2 + 10*n)
>
>   O(n^2)

---

## 递归的时间复杂度

>   求x的n次方

```java
// O(n)
public static int function1(int x, int n) {
    int result = 1; // 任何数的0次方等于1
    for (int i = 0; i < n; i++) {
        result = result * x;
    }
    return result;
}
```

使用递归算法来降低复杂度，画图分析。

```java
public static int function2(int x, int n) {
    if (n == 0) {
        return 1;
    }
    int t = function2(x, n/2);
    if (n%2 == 1) {
        return t * t * x;
    }
    return t * t;
}
```

![递归算法的时间复杂度](https://img-blog.csdnimg.cn/20201209193909426.png)

**将相同的两次递归合并成一次。**

---

## fabonacci

```java
// O(2^n)
int fibonacci(int i) {
       if(i <= 0) return 0;
       if(i == 1) return 1;
       return fibonacci(i - 1) + fibonacci(i - 2);
}
```

<img src="https://img-blog.csdnimg.cn/20210305093200104.png" alt="递归空间复杂度分析" style="zoom: 50%;" />

```java
// 时间复杂度： O(n)
// 空间复杂度： O(n)
int fibonacci(int first, int second, int n) {
    if (n <= 0) {
        return 0;
    }
    if (n < 3) {
        return 1;
    }
    else if (n == 3) {
        return first + second;
    }
    else {
        return fibonacci(second, first + second, n - 1);
    }
}
```

**递归算法的空间复杂度 = 每次递归的空间复杂度 \* 递归深度**

---

## 二分法递归查找

```java
public static int binarySearch(int[] a, int left, int right, int x) {
    if (right >= 1eft) {
        int mid = left + (right-left) / 2;
        if (a[mid] == x) {
            return mid;
        }
        if (a[mid] > x) {
            return binarySearch(a, left, mid-1, x);
        }
        return binarySearch(a, mid+1, right, x);
    }
    return -1;
}
```

**二分查找的前提**：

1.  数组是有序数组
2.  数组中无重复元素

### 区间的定义

左闭右闭 **[left, right]** 

-   while (left <= right) 要使用 <= ，因为left == right是有意义的，所以使用 <=
-   if (nums[middle] > target) right 要赋值为 middle - 1，因为当前这个nums[middle]一定不是target，那么接下来要查找的左区间结束下标位置就是 middle - 1

左闭右开 **[left, right)** 

-   while (left < right)，这里使用 < ,因为left == right在区间[left, right)是没有意义的
-   if (nums[middle] > target) right 更新为 middle，因为当前nums[middle]不等于target，去左区间继续寻找，而寻找区间是左闭右开区间，所以right更新为middle，即：下一个查询区间不会去比较nums[middle]

---

## 移除元素

[代码随想录 (programmercarl.com)](https://programmercarl.com/0027.移除元素.html#思路)

### 遍历法

两层for循环，一个for循环遍历数组元素 ，第二个for循环更新数组。

-   时间复杂度：O(n^2)
-   空间复杂度：O(1)

### 双指针法

**通过一个快指针和慢指针在一个for循环下完成两个for循环的工作。**

-   时间复杂度：O(n)
-   空间复杂度：O(1)

---

## 有序数组的平方

[代码随想录 (programmercarl.com)](https://programmercarl.com/0977.有序数组的平方.html#双指针法)

**双指针法**

定义一个新数组result，和A数组一样的大小，让k指向result数组终止位置。

如果`A[i] * A[i] < A[j] * A[j]` 那么`result[k--] = A[j] * A[j];` 。

如果`A[i] * A[i] >= A[j] * A[j]` 那么`result[k--] = A[i] * A[i];` 。




## 长度最小的子数组

使用**滑动窗口**。

1. 窗口的结束位置在for循环中移动。
2. 窗口的起始位置在for内部的while循环中判断条件向前移动。

```java
class Solution {
    // 滑动窗口法 O(n)
    public int minSubArrayLen(int s, int[] nums) {
        // 窗口起始位置
        int right = 0;
        int sum = 0;
        int result = Integer.MAX_VALUE; // 结果的序列
        for (int right = 0; right < nums.length; right++) {
            sum += nums[right];
            // 判断条件
            while (sum >= s) {
                // 取最短的长度
                result = Math.min(result, right - left + 1);
                sum -= nums[left];
                left++;
            }
        }
        return result == Integer.MAX_VALUE ? 0 : result;
    }
    // 暴力法 O(n^2)
    public int minSubArrayLen2(int s, int[] nums) {
        int result = Integer.MAX_VALUE;
        int sum = 0;
        for (int i = 0; i <nums.length; i++) {
            sum = 0; // 每次比较时重置
            for (int j = i; j < nums.length; j++) {
                sum += nums[j];
                if (sum >= s) {
                    result = Math.min(result, j - i + 1)；
                    // 找到符合条件就退出
                    break;
                }
            }
        }
        return result == Integer.MAX_VALUE ? 0 : result;
    }
}
```

## 螺旋矩阵

[代码随想录 (programmercarl.com)](https://programmercarl.com/0059.螺旋矩阵II.html#_59-螺旋矩阵ii)

<img src="https://img-blog.csdnimg.cn/2020121623550681.png" alt="螺旋矩阵" style="zoom: 50%;" />

1.  从外向内画
2.  左闭右开区间
3.  循环的条件：圈数
4.  每次子循环的偏移量
5.  中点的处理



## 参数传递

-   传递数组和对象，传递的是地址。
-   传递基本类型和String，传递的是复制。

---

## 链表

<img src="https://img-blog.csdnimg.cn/20200806195200276.png" alt="img" style="zoom: 50%;" />

### 移除链表元素

直接进行删除操作

```java
public ListNode removeElements(ListNode head, int val) {    
    if (head == null) {
        return head;
    }
    // 如果删除头节点
    while (head != null && head.val == val) {
        head = head.next;
    }
    // 删除非头节点
    ListNode pre = head;
    ListNode cur = head.next;
    while (cur != null) {
        if (cur.val == val) {
            pre.next = cur.next;
        } else {
            pre = cur;
        }
        cur = cur.next;
    }
    return head;
}
```

添加虚拟结点使流程统一 **使用方便**

```java
public ListNode removeElements(ListNode head, int val) {    
    if (head == null) {
        return head;
    }
    ListNode dummy = new ListNode(-1, head);
    ListNode pre = dummy;
    ListNode cur = head;
    while (cur != null) {
        if (cur.val == val) {
            pre.next = cur.next;
        } else {
            pre = cur;
        }
        cur = cur.next;
    }
    return head;
}
```

### 设计链表

[代码随想录 (programmercarl.com)](https://programmercarl.com/0707.设计链表.html#代码)

---

### 环形链表

**表示有环**

>   给定一个整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。

```
head = [3,2,0,-4] pos = 1
链表中有一个环，尾部连接到第二个结点
```

**判断是否有环**

**快慢指针法：**

>   从头结点出发，fast指针每次移动两个结点，slow指针每次移动一个节点，如果 fast 和 slow指针在途中相遇 ，说明这个链表有环。

**如果有环，fast相对于slow每次一个结点从后追赶slow。**

<img src="https://tva1.sinaimg.cn/large/008eGmZEly1goo4xglk9yg30fs0b6u0x.gif" alt="141.环形链表"  />

**找到环的入口**

**从头结点出发一个指针，从相遇节点 也出发一个指针，这两个指针每次只走一个节点， 那么当这两个指针相遇的时候就是 环形入口的节点**。

```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            fast = fast.next.next;
            slow = slow.next;
            // 有环
            if (fast == slow) {
                // 从头结点和相遇结点开始
                ListNode index1 = fast;
                ListNode index2 = head;
                while (index1 != index2) {
                    index1 = index1.next;
                    index2 = index2.next;
                }
                return index1;
            } // end if
        } // end while
        return null;
    }
}
```

---

### 链表相交

![面试题02.07.链表相交_2](https://code-thinking.cdn.bcebos.com/pics/%E9%9D%A2%E8%AF%95%E9%A2%9802.07.%E9%93%BE%E8%A1%A8%E7%9B%B8%E4%BA%A4_2.png)

使链表A是长的链表，并移动长度差个距离，两个指针同时遍历，符合条件就返回。

### 反转链表

```java
// 双指针法
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode cur = head;
        ListNode temp = null
        while (cur != null) {
            temp = cur.next; // 保存下一个结点
            cur.next = prev;
            prev = cur;
            cur = temp;
        }
        return prev
    }
}
// 递归
class Solution {
    public ListNode reverseList(ListNode head) {
        return reverse(null, head);
    }
    private ListNode reverse(ListNode prev, ListNode cur) {
        if (cur == null) {
            return prev;
        }
        ListNode temp = null;
        temp = cur.next;
        cur.next = prev;
        prev = cur;
        cur = temp;
        return reverse(prev, cur);
        // return reverse(cur, prev);
        
    }
}
```

---

### 两两交换

![24.两两交换链表中的节点1](https://code-thinking.cdn.bcebos.com/pics/24.%E4%B8%A4%E4%B8%A4%E4%BA%A4%E6%8D%A2%E9%93%BE%E8%A1%A8%E4%B8%AD%E7%9A%84%E8%8A%82%E7%82%B91.png)

```java
class Solution {
    public ListNode swapPairs(ListNode head) {
        // 虚拟头结点
        ListNode dummyNode = new ListNode(0);
        dummyNode.next = head;
        ListNode prev = dummyNode;
        Listnode temp = null;
        while (prev.next != null && prev.next.next != null) {
			temp = head.next.next;
            prev.next = head.next; // 步骤一
            head.next.next = head; // 步骤二
            head.next = temp; // 步骤三
            // 进位
            prev = head;
            head = head.next;
        }
        return dummyNode.next;
    }
}
```

---

### 删除倒数第n个

![img](https://code-thinking.cdn.bcebos.com/pics/19.%E5%88%A0%E9%99%A4%E9%93%BE%E8%A1%A8%E7%9A%84%E5%80%92%E6%95%B0%E7%AC%ACN%E4%B8%AA%E8%8A%82%E7%82%B92.png)

**虚拟头结点，快慢指针。**

fast先走几步，再同时走直到fast符合停止条件，删除结点。

**slow 移动到要删除的前一个结点最方便。**

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummyNode = new ListNode(-1);
        dummyNode.next = head;
        ListNode fast = dummyNode;
        ListNode slow = dummyNode;
        // fast move first
        while (n-- > 0) {
            fast = fast.next;
        }
        // move together
        while (fast.next != null) {
            fast = fast.next;
            slow = slow.next;
        }
        // delete
        // 如果自己释放 增加一个 prev = slow.next
        slow.next = slow.next.next;
        return dummyNode.next;
    }
}
```

