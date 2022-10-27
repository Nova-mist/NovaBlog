---
title: stack-queue
date: 2022-07-11 09:25:35
tags:
  - 算法
  - Java
---

# 栈与队列

![blog-image-20220711-1657502994](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/blog-image-20220711-1657502994.png)学习代码随想录的笔记。

<!-- more -->

## 基础

- 栈，先进后出。
- 队列，先进先出。

栈的底层实现是数组、链表等结构，对外提供统一的接口。

**方法对比**

[Stack (Java Platform SE 8 ) (oracle.com)](https://docs.oracle.com/javase/8/docs/api/java/util/Stack.html)

Deque双向队列默认操作队首？

| Stack   | Queue                 | Deque                                                        |
| ------- | --------------------- | ------------------------------------------------------------ |
| push    | offer / add(满了报错) | offer = push = addFirst = **offerFirst / offerLast**         |
| pop     | poll                  | poll = **pollFirst** = pop = removeFirst / removeLast = **pollLast** |
| peek    | peek                  | peek = **peekFirst = getFirst / peekLast = getLast**         |
| isEmpty | isEmpty               |                                                              |

## 用栈实现队列

[232. 用栈实现队列 - 力扣（LeetCode）](https://leetcode.cn/problems/implement-queue-using-stacks/)

🟠用两个栈来模拟队列。关键在于如果out栈为空，则将in栈元素放入out栈。

![232.用栈实现队列版本2](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/232.%E7%94%A8%E6%A0%88%E5%AE%9E%E7%8E%B0%E9%98%9F%E5%88%97%E7%89%88%E6%9C%AC2.gif)

Peek获取顶层元素不弹出，pop弹出并返回。

```java
class MyQueue {

    Stack<Integer> stackIn;
    Stack<Integer> stackOut;

    /** Initialize your data structure here. */
    public MyQueue() {
        stackIn = new Stack<>(); // 负责进栈
        stackOut = new Stack<>(); // 负责出栈
    }
    
    /** Push element x to the back of queue. */
    public void push(int x) {
        stackIn.push(x);
    }
    
    /** Removes the element from in front of queue and returns that element. */
    public int pop() {    
        dumpstackIn();
        return stackOut.pop();
    }
    
    /** Get the front element. */
    public int peek() {
        dumpstackIn();
        return stackOut.peek();
    }
    
    /** Returns whether the queue is empty. */
    public boolean empty() {
        return stackIn.isEmpty() && stackOut.isEmpty();
    }

    // 如果stackOut为空，那么将stackIn中的元素全部放到stackOut中
    private void dumpstackIn(){
        if (!stackOut.isEmpty()) return; 
        while (!stackIn.isEmpty()){
                stackOut.push(stackIn.pop());
        }
    }
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * MyQueue obj = new MyQueue();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.peek();
 * boolean param_4 = obj.empty();
 */
```



---

## 用队列实现栈

[225. 用队列实现栈 - 力扣（LeetCode）](https://leetcode.cn/problems/implement-stack-using-queues/)

🟠用两个队列实现。 通过空的辅助队列来插入元素，并最插入另一个队列的旧元素，并互换队列位置。

![fig1](https://assets.leetcode-cn.com/solution-static/225/225_fig1.gif)

```java
class MyStack {
    Queue<Integer> que1;
    Queue<Integer> que2; // 辅助队列
    public MyStack() {
        que1 = new LinkedList<>();
        que2 = new LinkedList<>();
    }
    
     /** Push element x onto stack. */
    public void push(int x) {
        que2.offer(x);
        while (!que1.isEmpty()) {
            que2.offer(que1.poll());
        }
        // 互换
        Queue<Integer> queTmp = que1;
        que1 = que2;
        que2 = queTmp;
    }
    
    /** Removes the element on top of the stack and returns that element. */
    public int pop() {
        return que1.poll();
    }
    
    /** Get the top element. */
    public int top() {
        return que1.peek();
    }
    
    /** Returns whether the stack is empty. */
    public boolean empty() {
        return que1.isEmpty();
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * MyStack obj = new MyStack();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.top();
 * boolean param_4 = obj.empty();
 */
```

方法二：使用一个队列，在插入的时候将旧的元素移到队尾。

```java
class MyStack {
    // 只使用一个队列
    Queue<Integer> que;
    public MyStack() {
        que = new LinkedList<>();
    }
    
    public void push(int x) {
        // 插入新元素后将旧元素移到队尾
        int n = que.size();
        que.offer(x);
        while (n-->0) {
            que.offer(que.poll());
        }
    }
    
    public int pop() {
        return que.poll();
    }
    
    public int top() {
        return que.peek();
    }
    
    public boolean empty() {
        return que.isEmpty();
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * MyStack obj = new MyStack();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.top();
 * boolean param_4 = obj.empty();
 */
```



---

## 有效的括号

[20. 有效的括号 - 力扣（LeetCode）](https://leetcode.cn/problems/valid-parentheses/)

不匹配的情况：

1. 左边括号多余。
2. 符号不匹配。
3. 右边括号多余。

遍历的return FALSE：

1. 遍历完，栈不为空。
2. 遍历中没有匹配的字符。
3. 遍历中，栈为空，仍有未匹配的字符。

🟠匹配左括号的时候，将对应的右括号，后续只需要判断栈顶与当前括号相同。

**注意** `Stack<Character>` 声明栈的方式

```java
class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') {
                stack.push(')');
            } else if (c == '{') {
                stack.push('}');
            } else if (c == '[') {
                stack.push(']');
            } else if (!stack.isEmpty() && stack.peek() == c ) {
                // 匹配的情况
                stack.pop();
            } else {
                // 不匹配的情况二三：右边符号多余、符号不匹配
                return false;
            }
        }
        // 不匹配的情况一：左边符号多余
        return stack.isEmpty();
    }
}
```

方法二：使用hashmap做匹配

🟠注意栈和队列的声明方式不同

Stack -> new Stack<>
Queue -> new LinkedList<>

💥**Map的简写方式**

```java
class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        Map<Character, Character> pairs = new HashMap<>() {{
            // 简写
            put(')', '(');
            put(']', '[');
            put('}', '{');
        }};
        for (char c : s.toCharArray()) {
            // 左括号则入栈
            if (!pairs.containsKey(c)) {
                stack.push(c);
            } else if (!stack.isEmpty() && stack.peek() == pairs.get(c)) {
                stack.pop();
            } else {
                // 不匹配的情况二三：右边符号多余、符号不匹配
                return false;
            }
        }
         // 不匹配的情况一：左边符号多余
        return stack.isEmpty();
    }
}
```

**同样的逻辑**

```java
for (int i = 0; i < n; i++) {
  char ch = s.charAt(i);
  if (pairs.containsKey(ch)) {
    if (stack.isEmpty() || stack.peek() != pairs.get(ch)) {
      return false;
    }
    stack.pop();
  } else {
    stack.push(ch);
  }
}
```



---

## 删除字符串中的所有相邻重复项

[1047. 删除字符串中的所有相邻重复项 - 力扣（LeetCode）](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/)

方法一：依次遍历，栈中没有就push，匹配就pop。

使用Deque不用翻转字符串。

```java
class Solution {
    public String removeDuplicates(String s) {
        Stack<Character> stack = new Stack<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (!stack.isEmpty() && stack.peek() == c) {
                stack.pop();
            } else {
                stack.push(c);
            }
        }
        String str = "";
        Collections.reverse(stack);
        while (!stack.isEmpty()) {
            str += stack.pop();
        }
        return str;
    }
}
```

方法二：直接使用字符串进行栈操作

```java
class Solution {
    public String removeDuplicates(String s) {
        StringBuilder res = new StringBuilder();
        int top = -1; // res的长度
        for (char c : s.toCharArray()) {
            if (top >=0 && res.charAt(top) == c) {
                res.deleteCharAt(top);
                top--;
            } else { // 入栈
                res.append(c);
                top++;
            }
        }
        return res.toString();
    }
}
```

🟠方法三：双指针法

**并不是去重**

```java
class Solution {
    public String removeDuplicates(String s) {
        char[] array = s.toCharArray();
        int slow = 0, fast = 0;
        while (fast < s.length()) {
            // 后面的覆盖前面
            array[slow] = array[fast];
            // 重复则回退
            if (slow > 0 && array[slow] == array[slow-1]) {
                slow--;
            } else {
                slow++;
            }
            fast++; // 每次向后移一位
        }
        return new String(array, 0, slow);
    }
}
```



---

## 逆波兰表达式

[150. 逆波兰表达式求值 - 力扣（LeetCode）](https://leetcode.cn/problems/evaluate-reverse-polish-notation/)

**默认有效的逆波兰表达式（后缀表达式）**

> 示例 1：
>
> - 输入: ["2", "1", "+", "3", " * "]
> - 输出: 9
> - 解释: 该算式转化为常见的中缀算术表达式为：((2 + 1) * 3) = 9
>
> 示例 2：
>
> - 输入: ["4", "13", "5", "/", "+"]
> - 输出: 6
> - 解释: 该算式转化为常见的中缀算术表达式为：(4 + (13 / 5)) = 6

🟠字符串变整数：Integer.parseInt 、 Integer.valueOf

"+".equals(tokens[i]) **比较字符串相等**

```java
class Solution {
    public int evalRPN(String[] tokens) {
        Stack<Integer> st = new Stack<>();
        for (int i = 0; i < tokens.length; i++) {
            if ("+".equals(tokens[i])) {
                int num2 = st.pop();
                int num1 = st.pop();
                st.push(num1 + num2);
            } else if ("-".equals(tokens[i])) {
                int num2 = st.pop();
                int num1 = st.pop();
                st.push(num1 - num2);
            } else if ("*".equals(tokens[i])) {
                int num2 = st.pop();
                int num1 = st.pop();
                st.push(num1 * num2);
            } else if ("/".equals(tokens[i])) {
                int num2 = st.pop();
                int num1 = st.pop();
                st.push(num1 / num2);
            }
            else { // 数字入栈
                st.push(Integer.parseInt(tokens[i]));
            }
        }
        return st.pop();
    }
}
```



---

## 滑动窗口最大值

[239. 滑动窗口最大值 - 力扣（LeetCode）](https://leetcode.cn/problems/sliding-window-maximum/)

🟠维护一个deque单向队列（由大到小），调用peek取队首就是最大值。

> 双端单调队列 由小到大
> 处理的是数组下标
> 弹出旧的小元素，添加新的元素。
> 队首元素不在窗口中就弹出

```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        // 维护单调队列 由小到大
        Deque<Integer> deq = new LinkedList<Integer>();
        int n = nums.length;
        int[] res = new int[n - k + 1];

        // 处理的是数组下标
        for (int i = 0; i < nums.length; i++) {
            // 滑动窗口 添加元素
            // 如果要添加的元素大于队尾的 弹出队尾
            while (!deq.isEmpty() && nums[i] >= nums[deq.peekLast()]) {
                deq.pollLast();
            }
            // 移动窗口
            deq.offerLast(i);
            // 队首最大元素不在窗口范围内了
            if (!deq.isEmpty() && (i-k) == deq.peekFirst()) {
                deq.pollFirst();
            }
            // 第一个窗口展开 开始写入结果数组
            if (i >= k - 1) {
                res[i - k + 1] = nums[deq.peekFirst()];
            }
        }
        return res;
    }
}
```



---

## 💥前K个高频元素

[347. 前 K 个高频元素 - 力扣（LeetCode）](https://leetcode.cn/problems/top-k-frequent-elements/)

🟠步骤：

1. 用哈希表记录出现的次数。
2. 用PriorityQueue来排序键值对，保持前k个高频元素。
3. 输出结果。

💥**PriorityQueue 优先级队列**

**map.entrySet() 返回键值对的集合**

**map.getOrDefault(num, 0)** 返回数值或默认

**Set<Map.Entry<Integer, Integer>> entries = map.entrySet();** 键值对集合的声明

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        // 使用哈希表记录出现次数
        Map<Integer, Integer> map = new HashMap<>();
        for (int num : nums) {
            map.put(num, map.getOrDefault(num, 0) + 1);
        }
        // 转化为键值对集合
        Set<Map.Entry<Integer, Integer>> entries  = map.entrySet();
        // 优先级队列
        PriorityQueue<Map.Entry<Integer, Integer>> que = new PriorityQueue<>(
            // 排序的规则
            new Comparator<Map.Entry<Integer, Integer>>() {
                public int compare(Map.Entry<Integer, Integer> m, Map.Entry<Integer, Integer> n) {
                return m.getValue() - n.getValue();
            }
            }
        );
        // 简写
        // PriorityQueue<Map.Entry<Integer, Integer>> queue = new PriorityQueue<>((o1, o2) -> o1.getValue() - o2.getValue());
        // 入队
        for(Map.Entry<Integer, Integer> entry : entries) {
            que.offer(entry);
            // 多了就弹出
            if (que.size() > k) {
                que.poll();
            }
        }
        int[] res = new int[k];
        for (int i = k; i > 0; i--) {
            res[i-1] = que.poll().getKey();
        }
        return res;
    }
}
```

==TODO：比较大小接口的实现，反转int数组，反转Collections==
