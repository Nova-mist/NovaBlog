---
title: 数组-链表-字符串
date: 2022-07-11 10:34:41
tags:
  - 算法
  - Java
---



看代码随想录数组、链表、字符串部分的笔记。

[toc]

<!-- more -->



## 数组

> 在C++中二维数组在地址空间上是连续的。
>
> Java是没有指针的，同时也不对程序员暴露其元素的地址，寻址操作完全交给虚拟机。



### 二分查找

[704. 二分查找 - 力扣（LeetCode）](https://leetcode.cn/problems/binary-search/)

**🟢左闭右闭**

🟠向右边找 mid + 1，向左边找 mid - 1，移动多一格。

```java
class Solution {
    public int search(int[] nums, int target) {
        // 左闭右闭
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else if (nums[mid] > target) {
                right = mid - 1;
            }
        }
        return -1;
    }
}
```



---

### 移除元素

**暴力法**

🟠index在后面整体前移的时候也要减1

```java
class Solution {
    public int removeElement(int[] nums, int val) {
        int size = nums.length;
        for (int i = 0; i < size; i++) {
            // 找到值就前移
            if (nums[i] == val) {
                for (int j = i; j < size - 1; j++) {
                    nums[j] = nums[j + 1];
                }
                // i也要前移
                i--;
                size--;
            }
        }
        return size;
    }
}
```

**双指针法**

```java
class Solution {
    public int removeElement(int[] nums, int val) {
        // 双指针法
        int left = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] != val) {
                nums[left] = nums[right];
                left++;
            }
        }
        // 存在最右边都是val的情况所以只返回最左
        return left;
    }
}
```



---

### 有序数组的平法

[977. 有序数组的平方 - 力扣（LeetCode）](https://leetcode.cn/problems/squares-of-a-sorted-array/submissions/)

**双指针法**

🟠result[size--] 的递减是后执行。

```java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int size = nums.length;
        int left = 0, right = size - 1;
        int[] result = new int[size];
        // 存在相等的情况
        while (left <= right) {
            if (nums[left] * nums[left] < nums[right] * nums[right]) {
                result[--size] = nums[right] * nums[right];
                right--;
            } else {
                result[--size] = nums[left] * nums[left];
                left++;
            }
        }
        return result;
    }
}
```



---

### 长度最小的子数组

[209. 长度最小的子数组 - 力扣（LeetCode）](https://leetcode.cn/problems/minimum-size-subarray-sum/submissions/)

**暴力解法**

**🟠初始最大值的处理** Integer.MAX_VALUE

**取最小的方法** Math.min(result, right - left + 1);

```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int result = Integer.MAX_VALUE;;
        int sum = 0;
        int len = 0; // 子序列长度
        for (int i= 0; i < nums.length; i++) {
            sum = 0;
            for (int j = i; j < nums.length; j++) {
                sum += nums[j];
                // 符合条件
                if (sum >= target) {
                    len = j - i + 1;
                    // 取最小长度
                    result = result < len ? result : len;
                    break;
                }
            }
        }
        return result == Integer.MAX_VALUE ? 0 : result;
    }
}
```

**滑动窗口法**

<img src="https://code-thinking.cdn.bcebos.com/gifs/209.%E9%95%BF%E5%BA%A6%E6%9C%80%E5%B0%8F%E7%9A%84%E5%AD%90%E6%95%B0%E7%BB%84.gif" alt="209.长度最小的子数组" style="zoom: 67%;" />

**🟠注意窗口两侧移动的条件**

```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int result = Integer.MAX_VALUE;;
        int sum = 0;
        // 滑动窗口
        int left = 0;
        for (int right= 0; right < nums.length; right++) {
            sum += nums[right];
            while (sum >= target) {
                // 已满足条件
                result = Math.min(result, right - left + 1);
                sum -= nums[left];
                left++;
            }
        }
        return result == Integer.MAX_VALUE ? 0 : result;
    }
}
```

**时间复杂度是O(n)**

---

### 螺旋矩阵

[59. 螺旋矩阵 II - 力扣（LeetCode）](https://leetcode.cn/problems/spiral-matrix-ii/)

🟠左开右闭，奇偶情况中心数的处理。

```java
class Solution {
    public int[][] generateMatrix(int n) {
        // 左闭右开 按层模拟
        int left = 0, right = n-1, top = 0, bottom = n-1;
        int num = 1;
        int[][] res = new int[n][n];
        int c, r;
        // 继续填充的条件
        // 奇数最中间的数字的情况  偶数会被覆盖
        res[bottom/2][right/2] = n * n;
        while (left < right && top < bottom) {
            c = left;
            r = top;
            // 列向右
            while (r < right) {
                res[c][r] = num;
                num++;
                r++;
            }
            // 行向下
            while (c < bottom) {
                res[c][r] = num;
                num++;
                c++;
            }
            // 返回
            while (r > left) {
                res[c][r] = num;
                num++;
                r--;
            }
            while (c > top) {
                res[c][r] = num;
                num++;
                c--;
            }
            // 缩圈
            left++;
            right--;
            top++;
            bottom--;
        }
        return res;
    }
}
```



## 链表

### 基础

- 单链表
- 双链表
- 循环链表

==定义链表==

链表的操作：

- 删除节点
- 添加节点

**时间复杂度**：

|      | 插入/删除 | 查询 | 适用场景                         |
| ---- | --------- | ---- | -------------------------------- |
| 数组 | O(n)      | O(1) | 数据量固定，频繁查询，较少增删   |
| 链表 | O(1)      | O(n) | 数据量不固定，频繁增删，较少查询 |

---

### 移除链表元素

[203. 移除链表元素 - 力扣（LeetCode）](https://leetcode.cn/problems/remove-linked-list-elements/)

🟠虚拟头结点统一操作

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        if (head == null) {
            return head;
        }
        // 存在删除头结点的情况 设置虚拟节点 统一操作
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
        return dummy.next;
    }
}
```



---

### 设计链表

[707. 设计链表 - 力扣（LeetCode）](https://leetcode.cn/problems/design-linked-list/submissions/)

**🟠单链表的实现**

边界条件的处理。

使用了虚拟节点，i <= index for 循环找到的是 index +1节点；i < index，增删的时候找到的是要处理位置的**前一个节点**。

```java
class MyLinkedList {
    // 元素个数
    int size;
    // 虚拟头结点
    ListNode head;

    public MyLinkedList() {
        size = 0;
        head = new ListNode(0);
    }
    
    public int get(int index) {
        // index非法 返回-1
        if (index < 0 || index >=size) {
            return -1;
        }
        // 指向虚拟头结点
        ListNode cur = head;
        // 查找第index+1节点
        for (int i = 0; i <= index; i++) {
            cur = cur.next;
        }
        return cur.val;
    }
    
    public void addAtHead(int val) {
        addAtIndex(0, val);
    }
    
    public void addAtTail(int val) {
        // 其实是在第size个位置插入 0 1 ... [size]
        addAtIndex(size, val);
    }
    
    public void addAtIndex(int index, int val) {
        // 超过大小无法插入
        if (index > size) {
            return;
        }
        // 小于0在头部插入
        if (index < 0) {
            index = 0;
        }
        // 找到要出入节点的前一个位置
        ListNode pre = head;
        for (int i = 0; i < index; i++) {
            pre = pre.next;
        }
        ListNode cur = new ListNode(val);
        // 注意顺序
        cur.next = pre.next;
        pre.next = cur;

        size++;
    }
    
    public void deleteAtIndex(int index) {
        if (index >= size || index < 0) {
            return;
        }
        // 找到要删除的前一个位置
        ListNode pre = head;
        for (int i = 0; i < index; i++) {
            pre = pre.next;
        }
        ListNode cur = pre.next;
        pre.next = cur.next;

        size--;
    }
}

/**
 * Your MyLinkedList object will be instantiated and called as such:
 * MyLinkedList obj = new MyLinkedList();
 * int param_1 = obj.get(index);
 * obj.addAtHead(val);
 * obj.addAtTail(val);
 * obj.addAtIndex(index,val);
 * obj.deleteAtIndex(index);
 */
```

==TODO：双链表的实现==

---

### 反转链表

[206. 反转链表 - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-linked-list/)

<img src="https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20210218090901207.png" alt="206_反转链表" style="zoom:67%;" />

<img src="https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/008eGmZEly1gnrf1oboupg30gy0c44qp.gif" alt="img" style="zoom: 67%;" />

🟠画图，注意指针移动顺序，需要保存原位置。

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode pre = null;
        ListNode cur = head;
        while (cur != null) {
            // 保存指向的下一个位置再修改
            ListNode tmp = cur.next;
            cur.next = pre;
            // 注意顺序 否则要再使用一个变量保存原位置
            pre = cur;
            cur = tmp;
        }
        return pre;
    }
}
```



---

### 🟡两两交换链表中的节点

[24. 两两交换链表中的节点 - 力扣（LeetCode）](https://leetcode.cn/problems/swap-nodes-in-pairs/)

![image-20220527122257503](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220527122257503.png)

**🟠使用虚拟头结点**

通过更改指针移动顺序，不用再增加一个缓存变量。

不要操作dummy节点，并且最后不能返回变幻后的head节点。

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode swapPairs(ListNode head) {
        // 虚拟头结点
        ListNode dummy = new ListNode(-1, head);
        ListNode pre = dummy;
        

        while (pre.next != null && pre.next.next != null) {
            ListNode cur = pre.next;
            ListNode tmp = cur.next;
            // 交换
            pre.next = tmp;
            cur.next = tmp.next;
            tmp.next = cur;
            // 向后移动
            pre = pre.next.next;  
        }
        // head也会变化 所以使用dummy
        return dummy.next;
    }
}
```



---

### 删除链表的倒数第N个节点

[19. 删除链表的倒数第 N 个结点 - 力扣（LeetCode）](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

🟠**使用虚拟头结点，最后要返回dummy.next，因为存在头结点改变的情况。**

**注意，倒数第n个结点，双指针法拉开距离，删除慢结点。**

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // 虚拟头结点
        ListNode dummy = new ListNode(-1, head);
        // 双指针法
        ListNode slow = dummy;
        ListNode fast = slow;
        // 先移动快的n步
        while (n-- > 0) {
            fast = fast.next;
        }
        // 慢指针的前一个结点
        ListNode pre = null;
        // 同时移动直到快指针指向空
        while (fast != null) {
            pre = slow;
            slow = slow.next;
            fast = fast.next;
        }
        // 删除
        pre.next = slow.next;
        return dummy.next;
    }
}
```



---

### 链表相交

[面试题 02.07. 链表相交 - 力扣（LeetCode）](https://leetcode.cn/problems/intersection-of-two-linked-lists-lcci/)

**🟠使用哈希表**

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        Set<ListNode> set = new HashSet<ListNode>();
        ListNode temp = headA;
        while (temp != null) {
            set.add(temp);
            temp = temp.next;
        }
        // 如过已经在set中就返回
        temp = headB;
        while (temp != null) {
            if (set.contains(temp)) {
                return temp;
            }
            temp = temp.next;
        }
        return null;
    }
}
```

**双指针法处理环形链表**

🟠**画图**

![image-20220528164208004](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220528164208004.png)

![image-20220528165445815](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220528165445815.png)

```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        while (headA == null || headB == null) {
            return null;
        }
        ListNode curA = headA;
        ListNode curB = headB;
        // 环形遍历
        while (curA != curB) {
            curA = (curA == null) ?  headB : curA.next;
            curB = (curB == null) ?  headA : curB.next;
        }
        return curA;        
    }
}
```



---

### 环形链表

**哈希表法**

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode detectCycle(ListNode head) {
        Set<ListNode> set = new HashSet<ListNode>();
        ListNode temp = head;
        while (temp != null) {
            if (set.contains(temp)) {
                return temp;
            } else {
                set.add(temp);
            }
            temp = temp.next;
        }
        return null;
    }
}
```

**双指针法**

🟠通过数学推导，从相遇点到入环点的距离加上 n-1*n*−1 圈的环长，恰好等于从链表头部到入环点的距离。

```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        // 非空
        if (head == null) {
            return null;
        }
        ListNode slow = head, fast = head;
        // fast指针走两步 slow走一步
        while (fast != null) {
            if (fast.next != null) {
                fast = fast.next.next;
            } else { // 非环
                return null;
            }
            slow = slow.next;
            // 在环中相遇 根据数学推导寻找环入口
            if (fast == slow) {
                fast = head;
                while (fast != slow) {
                    // 开始各走一步
                    fast = fast.next;
                    slow = slow.next;
                }
                return fast;
            }
        }
        return null;
    }
}
```



## 字符串

## 备注

使用内置函数

TODO：StringBuilder





### 翻转字符串

[344. 反转字符串 - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-string/)

双指针法

```java
class Solution {
    public void reverseString(char[] s) {
        int l = 0;
        int r = s.length - 1;
        while (l < r) {
            char tmp = s[l];
            s[l] = s[r];
            s[r] = tmp;
            l++;
            r--;
        }
    }
}
```

[541. 反转字符串 II - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-string-ii/submissions/)

```java
class Solution {
    public String reverseStr(String s, int k) {
        char[] arr = s.toCharArray();
        int n = arr.length;
        for (int i = 0; i < n; i += 2 * k) {
            // 剩余字符的情况
            reverse(arr, i, Math.min(i + k, n) - 1);
        }
        return new String(arr);
        
    }
    // 翻转指定序列的字符 0 ~ length-1
    public void reverse(char[] arr, int left, int right) {
        while (left < right) {
            char tmp = arr[left];
            arr[left] = arr[right];
            arr[right] = tmp;
            left++;
            right--;
        }
    }
}
```



---

### 替换空格

🟠使用了 StringBuilder

```java
class Solution {
    public String replaceSpace(String s) {
        if (s == null) {
            return null;
        }
        // 使用StringBuilder在复制的过程中判断
        StringBuilder sb = new StringBuilder();
        
        for (char c : s.toCharArray()) {
            if (c == ' ') {
                sb.append("%20");
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
```

**双指针法**

注意行首是空格的情况。

1. 先遍历一次进行扩容。
2. 双指针法，分别指向原末尾和扩容后的末尾，自后向前遍历处理，不是空格就复制，是空格就右指针多移动两位。

```java
class Solution {
    public String replaceSpace(String s) {
        if (s == null) {
            return null;
        }
        // 扩充空间 " " -> "%20"
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            if (c == ' ') {
                sb.append("  ");
            }
        }
        // 没有空格的情况
        if (sb.length() == 0) {
            return s;
        }
        // 双指针法
        int left = s.length() - 1; // 指向原字符串的尾部位置
        s += sb.toString();
        int right = s.length() - 1; // 扩容后的尾部
        char[] array = s.toCharArray();
        // 行首是空格的情况
        while (left >= 0) {
            // 遇到空格进行替换
            if (array[left] == ' ') {
                array[right--] = '0';
                array[right--] = '2';
                array[right] = '%';
            } else { // 不是空格的复制
                array[right] = array[left];
            }
            left--;
            right--;
        }

        return new String(array);
    }
```



---

### 翻转字符串里的单词

[151. 颠倒字符串中的单词 - 力扣（LeetCode）](https://leetcode.cn/problems/reverse-words-in-a-string/submissions/)

🟠使用了内置函数：

- s.trim()
- Arrays.asList() String变李彪
- s.split()
- Collections.reverse() **集合中的元素翻转**
- String.join(" ", list) **列表变字符串**

```java
class Solution {
    public String reverseWords(String s) {
        // 去除开头末尾空白字符
        s = s.trim();
        // 分割单词
        List<String> list = Arrays.asList(s.split("\\s+"));
        Collections.reverse(list);
        return String.join(" ", list);
    }
}
```

**双端队列**

🟠加入队列的操作是在下一次的循环，需要在跳出循环后再执行一次。

```java
class Solution {
    public String reverseWords(String s) {
        // 去除开头末尾空白字符
        int l = 0;
        int r = s.length() - 1;
        while (l <= r && s.charAt(l) == ' ') {
            l++;
        }
        while (l <= r && s.charAt(r) == ' ') {
            r--;
        }
        // 使用双端队列
        StringBuilder word = new StringBuilder();
        Deque<String> deq = new ArrayDeque<String>();

        while (l <= r) {
            // 从左遍历处理
            char c = s.charAt(l);
            if (c != ' ') {
                word.append(c);
            } else if (word.length() != 0) {
                // 插入到队列头部
                deq.offerFirst(word.toString());
                word.setLength(0);
            }
            l++;
        }
        deq.offerFirst(word.toString());
        return String.join(" ", deq);
    }
}
```



---

### 左旋转字符串

[剑指 Offer 58 - II. 左旋转字符串 - 力扣（LeetCode）](https://leetcode.cn/problems/zuo-xuan-zhuan-zi-fu-chuan-lcof/submissions/)

🟠**先各自翻转部分，再翻转整体**

sb.subSequence() **左闭右开，返回String**

```java
class Solution {
    public String reverseLeftWords(String s, int n) {
        // 先翻转局部再反转整体
        StringBuilder sb = new StringBuilder(s);
        StringBuilder l = new StringBuilder(sb.subSequence(0, n));
        l = l.reverse();
        StringBuilder r = new StringBuilder(sb.subSequence(n, s.length()));
        r = r.reverse();
        sb = (l.append(r)).reverse();
        return sb.toString();
    }
}
```

🟠StringBuilder的 charAt() 和 setCharAt 方法

```java
class Solution {
    public String reverseLeftWords(String s, int n) {
        // 先翻转局部再反转整体
        int len = s.length();
        StringBuilder sb = new StringBuilder(s);
        reverse(sb, 0, n-1);
        reverse(sb, n, len-1);
        reverse(sb, 0, len-1);
        return sb.toString();
    }
    public void reverse(StringBuilder sb, int start, int end) {
        // 翻转字符串
        while (start < end) {
            char temp = sb.charAt(start);
            sb.setCharAt(start, sb.charAt(end));
            sb.setCharAt(end, temp);
            start++;
            end--;
        }
    }
}
```



---

### TODO：KMP
