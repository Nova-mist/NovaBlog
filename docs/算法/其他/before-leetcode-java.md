---
title: 算法前概
date: 2022-05-24 15:56:54
tags:
  - Java
  - 算法
---



## 概念

顺序存储：存储空间连续，遍历容易，修改复杂。

链式存储：存储空间不连续，遍历复杂，修改容易。

>   Redis 提供列表、字符串、集合等等几种常用数据结构，但是对于每种数据结构，底层的存储方式都至少有两种，以便于根据存储数据的实际情况使用合适的存储方式。



<!-- more -->



### 遍历框架

数组遍历框架，线性迭代结构：

```java
public static void traverse(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        // 迭代访问 arr[i]
    }
}
```

链表遍历框架，迭代和递归结构：

```java
class ListNode {
    int val;
    ListNode next;
}
void traverse1(ListNode head) {
    for (ListNode p = head; p != null; p = p.next) {
        // 迭代访问 p.val
    }
}
void traverse2(ListNode head) {
    // 递归访问 head.val
    traverse2(head.next);
}
```

**二叉树遍历框架，非线性递归结构：**

```java
class TreeNode {
    int val;
    TreeNode left, right;
}
void traverse(TreeNode root) {
    // 前序遍历的逻辑部分
    // ...
    traverse(root.left);
    // 中序遍历的逻辑部分
    // ...
    traverse(root.right);
    // 后序遍历的逻辑部分
    // ...
}
```

N叉树遍历框架：

```java
class TreeNode {
    int val;
    TreeNode[] children;
}
void traverse(TreeNode root) {
    for (TreeNode child : root.children) {
        traverse(child);
    }
}
```

### 算法本质

>   算法的本质是穷举，而且有两个关键点：无遗漏、无冗余。

**数组/单链表系列**

双指针法相关的技巧：

-   二分搜索，两端向中心的双指针。
-   滑动窗口，快慢指针之间形成滑动的窗口。
-   判断、寻找回文串技巧
-   前缀和技巧
-   查分数组技巧

**二叉树系列算法**

二叉树的递归解法的两种思路：

-   遍历一遍二叉树，回溯算法核心框架。
-   分解问题，动态规划核心框架。

>   动态规划、回溯算法（DFS）、分治、BFS。
>
>   图论基础 和 环判断和拓扑排序 就用到了 DFS 算法；再比如 Dijkstra 算法模板，就是改造版 BFS 算法加上一个类似 dp table 的数组。

### 二叉树求最大深度两种思路

**回溯算法思想，与全排列问题相似。**

```java
// 记录最大深度
int res = 0;
int depth = 0;
// 主函数
int maxDepth(TreeNode root) {
    traverse(root);
    return res;
}
// 二叉树遍历框架
void traverse(TreeNode root) {
    if (root == null) {
        // 到达叶子节点
        res = Math.max(res, depth);
        return;
    }
    // 前序遍历位置
    depth++;
    traverse(root.left);
    traverse(root.right);
    // 后序遍历位置
    depth--;
}
```

**动态规划思想，与凑零钱的暴力穷举法类似。**

```java
// 输入根节点，返回这棵二叉树的最大深度
int maxDepth2(TreeNode root) {
    if (root == null) {
        return 0;
    }
    // 递归计算左右子树的最大深度
    int leftMax = maxDepth2(root.left);
    int rightMax = maxDepth2(root.right);
    // 整棵树的最大深度
    int res = Math.max(leftMax, rightMax) + 1;

    return res;
}
```

### 二叉树前序遍历的重写

![img](https://labuladong.gitee.io/algo/images/%e4%ba%8c%e5%8f%89%e6%a0%91%e7%b3%bb%e5%88%972/1.jpeg)

```java
public class Preorder {
    List<Integer> res = new LinkedList<>();

    // 返回前序遍历结果
    List<Integer> preorder(TreeNode root) {
        traverse(root);
        return res;
    }
    // 二叉树前序遍历
    void traverse(TreeNode root) {
        if (root == null) {
            return;
        }
        // 前序遍历位置
        res.add(root.val);
        traverse(root.left);
        traverse(root.right);
    }

    // 分解问题 动态规划的思想
    // 定义：输入一棵二叉树的根节点，返回这棵树的前序遍历结果
    List<Integer> preorder2(TreeNode root) {
        List<Integer> res = new LinkedList<>();
        if (root == null) {
            return res;
        }
        // 前序遍历的结果，root.val 在第一个
        res.add(root.val);
        // 后面接着左子树的前序遍历结果
        res.addAll(preorder2(root.left));
        // 最后接着右子树的前序遍历结果
        res.addAll(preorder2(root.right));
        return res;
    }
}
```



### 二叉树层序遍历

BFS算法核心框架就是根据二叉树的层序遍历。

```java
// 输入一棵二叉树的根节点，层序遍历这颗二叉树
Queue<TreeNode> levelTraverse(TreeNode root) {
    if (root == null) {
        return null;
    }
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);

    int depth = 1;
    // 自上而下遍历二叉树的每一层
    while (!q.isEmpty()) {
        int size = q.size();
        // 从左到右遍历每一层的每个节点
        for (int i = 0; i < size; i++) {
            // 父节点出列 子节点入列
            TreeNode cur = q.poll();
            if (cur.left != null) {
                q.offer(cur.left);
            }
            if (cur.right != null) {
                q.offer(cur.right);
            }
        }
        depth++;
    }
    return q;
}
```



## 编程素养

### 代码风格

| 小驼峰命名法 camel case | 变量、方法名 int myAge |
| ----------------------- | ---------------------- |
| 大驼峰 Pascal           | 类名、接口名 MyAge     |

### 核心代码模式和ACM模式

力扣的题目使用核心代码模式，要处理的数据都已经放入容器，可以直接编写逻辑。

POJ、牛客网的题目使用ACM格式，代码需要能够在本地运行，要引入库，构造输入、输出用例。

### ACM模式构建二叉树

🟡确定唯一二叉树的序列组合：

-   中序、后序
-   中序、前序

**二叉树的存储方式：**

-   链式存储
-   顺序存储

![img](https://code-thinking-1253855093.file.myqcloud.com/pics/20210914223147.png)

>   **如果父节点的数组下标是i，那么它的左孩子下标就是i \* 2 + 1，右孩子下标就是 i \* 2 + 2**。
