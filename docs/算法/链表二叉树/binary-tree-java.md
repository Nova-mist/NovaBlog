---
title: binary-tree-java
date: 2022-05-24 15:44:40
tags:
  - 算法
  - Java
---



![GIF 2022-5-14 22-06-30](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/GIF%202022-5-14%2022-06-30.gif)



# 二叉树

## 基础知识

### 分类

满二叉树：深度为k，有2^k-1个节点的二叉树。

完全二叉树：除最底层外，其余每层节点数都达到最大值，并且底层节点都集中在最左边的若干位置。

![image-20220401183725675](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220401183725675.png)

二叉搜索树：从首节点开始看，

-   若左子树不为空，则左子树上所有节点的值均小于它的根结点的值
-   若右子树不为空，则右子树上所有结点的值均大于它的根结点的值
-   其左、右子树也分别为二叉排序树

**二叉搜索树是一个有序树**

![img](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20200806190304693.png)

平衡二叉搜索树：是一颗空树，或者左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一颗平衡二叉树。

---

### 存储方式

-   链式存储，使用指针，链接各个地址的节点。
-   顺序存储，使用数组，内存连续分布。

![image-20220401184828788](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220401184828788.png)

⭐用数组存储的二叉树的遍历规律：**如果父节点的数组下标是 i，那么它的左孩子就是 i \* 2 + 1，右孩子就是 i \* 2 + 2。**

---

### 遍历方式

-   深度优先遍历：先往深走，遇到叶子节点再往回走。
    -   前序遍历（递归法，迭代法）中左右
    -   中序遍历（递归法，迭代法）左中右
    -   后序遍历（递归法，迭代法）左右中
-   广度优先遍历：一层一层的去遍历。
    -   层次遍历（迭代法）

**前中后序的名称，区分的就是中间节点在遍历顺序中的位置。**

![img](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20200806191109896.png)

深度遍历可以借助栈来实现（栈也是一种递归结构），广度遍历一般使用队列来实现（先进后出的结构一层一层的遍历）。

🟠**二叉树中递归的概念很重要**

---

### 代码定义

```java
public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;

    TreeNode() {}
    TreeNode(int val) {
        this.val = val;
    }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
```



<!-- more -->



## 递归遍历

递归算法的三要素：

1.   递归函数的参数和返回值
2.   终止条件
3.   单层递归的逻辑

```java
// 前序遍历·递归·LC144_二叉树的前序遍历
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<Integer>();
        preorder(root, result);
        return result;
    }

    public void preorder(TreeNode root, List<Integer> result) {
        if (root == null) {
            return;
        }
        result.add(root.val);
        preorder(root.left, result);
        preorder(root.right, result);
    }
}
// 中序遍历·递归·LC94_二叉树的中序遍历
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        inorder(root, res);
        return res;
    }

    void inorder(TreeNode root, List<Integer> list) {
        if (root == null) {
            return;
        }
        inorder(root.left, list);
        list.add(root.val);             // 注意这一句
        inorder(root.right, list);
    }
}
// 后序遍历·递归·LC145_二叉树的后序遍历
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        postorder(root, res);
        return res;
    }

    void postorder(TreeNode root, List<Integer> list) {
        if (root == null) {
            return;
        }
        postorder(root.left, list);
        postorder(root.right, list);
        list.add(root.val);             // 注意这一句
    }
}
```



## 迭代遍历

使用栈来实现二叉树的前中后序遍历。

**前序遍历**

栈中最开始是根节点，根节点出栈后，依次将右节点、左节点入栈，按此规律迭代。（后进先出）

**遍历元素和处理元素的顺序是一致的，故代码较简洁。**

🟠空节点不入栈

```java
// 前序遍历顺序：中-左-右，入栈顺序：中-右-左
class Solution {
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null){
            return result;
        }
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        while (!stack.isEmpty()){
            TreeNode node = stack.pop();
            result.add(node.val);
            if (node.right != null){
                stack.push(node.right);
            }
            if (node.left != null){
                stack.push(node.left);
            }
        }
        return result;
    }
}
```

**中序遍历**

先遍历到最底层才开始处理节点，因此需要用指针来遍历节点，用栈来处理节点元素。

🟠指针指向栈中的节点时，各节点的链表关系仍旧存在。

![image-20220401204015404](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220401204015404.png)

```java
// 中序遍历顺序: 左-中-右 入栈顺序： 左-右
class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null){
            return result;
        }
        Stack<TreeNode> stack = new Stack<>();
        TreeNode cur = root;
        while (cur != null || !stack.isEmpty()){
           if (cur != null){
               stack.push(cur);
               cur = cur.left;
           }else{
               cur = stack.pop();
               result.add(cur.val);
               cur = cur.right;
           }
        }
        return result;
    }
}
```

**后序遍历**

先序遍历是**中左右**，后续遍历是**左右中**，只需要调整先序遍历的顺序为**中右左**再反转结果数组就得到了**左右中**。

>   中左右 —> 中右左 —> 左右中

🟠最后要使用反转函数

```java
// 后序遍历顺序 左-右-中 入栈顺序：中-左-右 出栈顺序：中-右-左， 最后翻转结果
class Solution {
    public List<Integer> postorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null){
            return result;
        }
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        while (!stack.isEmpty()){
            TreeNode node = stack.pop();
            result.add(node.val);
            if (node.left != null){
                stack.push(node.left);
            }
            if (node.right != null){
                stack.push(node.right);
            }
        }
        Collections.reverse(result);
        return result;
    }
}
```

---

![image-20220401205026148](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220401205026148.png)

⭐Java 和 C++ 的比较：

-   Java 中返回的是列表集合，C++ 中返回的是向量容器。
-   Java 中通过对象的引用来替代指针，没有星号。
-   栈的相应函数用法不同。



## 同一迭代法

针对前中后序遍历写出统一风格的代码。

⭐由于中序遍历时，遍历节点和处理节点的顺序不一致，所以使用**标记法**：将要处理的节点放入栈后，再放入一个空指针作为标记。

弹出栈顶的节点，再依次放入右节点、中节点追加空节点、左节点。（如果左右节点为空则不入栈）

**弹出追加的空节点作为处理节点的标志。**

![中序遍历迭代（统一写法）](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/008eGmZEly1gnbmq3btubg30em09ue82.gif)

**中序遍历**

```java
if (node != null) {
    st.pop(); // 将该节点弹出，避免重复操作，下面再将右中左节点添加到栈中
    if (node.right!=null) st.push(node.right);  // 添加右节点（空节点不入栈）
    st.push(node);                          // 添加中节点
    st.push(null); // 中节点访问过，但是还没有处理，加入空节点做为标记。
    if (node.left!=null) st.push(node.left);    // 添加左节点（空节点不入栈）
}
```

**前序遍历**

```java
public class PreorderTraversalUnity {
    public static void main(String[] args) {
        // 层序遍历
        /*
                          4
                   1              6
               0       2      5       7
            -1  -1  -1  3  -1  -1  -1  8
         */
        int[] vec = new int[]{4, 1, 6, 0, 2, 5, 7, -1, -1, -1, 3, -1, -1, -1, 8};
        TreeNode root = TreeUtils.CreateBinaryTree(vec);
        // TreeUtils.PrintBinaryTree(root);
        List<Integer> result = preorderTraversal(root);
        for (Integer i : result) {
            System.out.print(i + " ");
        }
    }
    public static List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new LinkedList<>();
        // 底层的实现方式任意 顺序存储 链式存储
        // List<Integer> result = new ArrayList<>();
        Stack<TreeNode> st = new Stack<>();
        if (root == null) {
            return result;
        }
        // 启动迭代
        st.push(root);
        while (!st.empty()) {
            TreeNode node = st.peek(); // 指向栈顶的中节点 不弹出
            if (node != null) {
                st.pop(); // 弹出中节点
                if (node.right != null) { // 添加右节点（空节点不入栈）
                    st.push(node.right);
                }
                if (node.left != null) { // 添加左节点（空节点不入栈）
                    st.push(node.left);
                }
                st.push(node); // 添加中节点
                st.push(null); // 追加空间点作为标记 表示中节点访问过但没有处理
            } else { // 遇到空节点 开始处理
                st.pop(); // 弹出NULL
                node = st.pop();
                result.add(node.val);
            }
        }
        return result;
    }
}
```

**后序遍历**

```java
if (node != null) {
    st.pop(); // 将该节点弹出，避免重复操作，下面再将右中左节点添加到栈中
    st.push(node);                          // 添加中节点
    st.push(null); // 中节点访问过，但是还没有处理，加入空节点做为标记。
    if (node.right!=null) st.push(node.right);  // 添加右节点（空节点不入栈）
    if (node.left!=null) st.push(node.left);    // 添加左节点（空节点不入栈）       
}
```

代码框架相同，只有放入左中右节点的顺序发生变化。

⭐作为结果返回的列表集合，底层的实现方式不影响代码结构，顺序存储 `ArrayList` 、链式存储 `LinkedList` 。



## 层序遍历

### 模板

层序遍历使用先进先出的队列来实现。

>   队列先进先出，广度优先遍历；栈先进后出深度优先遍历。

![image-20220409224351540](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220409224351540.png)

```java
public class LevelOrder {
    public static void main(String[] args) {
        int[] vec = new int[]{4, 1, 6, 0, 2, 5, 7, -1, -1, -1, 3, -1, -1, -1, 8};
        TreeNode root = TreeUtils.CreateBinaryTree(vec);
        // 层序遍历
        List<List<Integer>> res = levelOrder(root);
        System.out.println(res);
    }

    public static List<List<Integer>> resList = new ArrayList<>();
    public static List<List<Integer>> levelOrder(TreeNode root) {
        resList = new ArrayList<>(); // 防止多次调用重复添加
        // levelOrderFunc(root);
        levelOrderFunc2(root, 0);

        return resList;
    }
    /*
    使用队列的层序遍历 迭代方式 BFS 广度优先遍历
     */
    public static void levelOrderFunc(TreeNode node) {
        if (node == null) {
            return;
        }
        Queue<TreeNode> que = new LinkedList<>();
        que.offer(node); // 先插入要处理的节点

        while (!que.isEmpty()) { // 队列非空则开始处理最前面的节点
            List<Integer> itemList = new ArrayList<>();
            int len = que.size();
            for (int i = 0; i < len; i++) {
                TreeNode tmpNode = que.poll(); // 弹出队首节点
                itemList.add(tmpNode.val);
                // 插入左右节点
                if (tmpNode.left != null) {
                    que.offer(tmpNode.left);
                }
                if (tmpNode.right != null) {
                    que.offer(tmpNode.right);
                }
            }
            // 将单层结果添加到总结果中
            resList.add(itemList);
        }
    }

    /*
    递归方式 DFS 深度优先遍历
     */
    public static void levelOrderFunc2(TreeNode node, Integer deep) {
        if (node == null) {
            return;
        }
        // 每次递归增加的层级
        deep++;
        if (resList.size() < deep) {
            List<Integer> item = new ArrayList<>();
            resList.add(item); // 先添加空的列表
        }
        // 借助层数作为结果列表的索引
        resList.get(deep-1).add(node.val);
        levelOrderFunc2(node.left, deep);
        levelOrderFunc2(node.right, deep);
    }
}
```

---

### 自底向上遍历

只需要最后将结果列表反转。

```c++
// c++
reverse(result.begin(), result.end());
```

```java
// java
List<List<Integer>> result = new ArrayList<>();
for (int i = list.size() - 1; i >= 0; i-- ) {
    result.add(list.get(i));
}
```

---

### 右视图

>   给定一棵二叉树，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

只需要判断是否遍历到单层的最后的元素，放入结果数组。

```java
if (node.left != null) {
    que.add(node.left);
}
if (node.right != null) {
    que.add(node.right);
}
if (i == size - 1) {
    list.add(node.val);
}
```

---

### 层平均值

在处理节点的时候加上求和的逻辑。

```java
/*
    返回每层的平均值
    使用队列的迭代法
     */
public static List<Double> averageOfLevels(TreeNode root) {
    List<Double> list = new ArrayList<>();
    Deque<TreeNode> que = new LinkedList<>();

    if (root == null) {
        return list;
    }
    que.offer(root);
    while (!que.isEmpty()) {
        int size = que.size();
        double levelSum = 0.0;
        for (int i = 0; i < size; i++) {
            TreeNode node = que.poll();
            // 每层的加和处理
            levelSum += node.val;
            // 插入左右节点
            if (node.left != null) {
                que.add(node.left);
            }
            if (node.right != null) {
                que.add(node.right);
            }
        }
        list.add(levelSum / size);
    }
    return list;
}
```

---

### N叉树层序遍历

改动在插入子节点部分。

```java
class Node {
    public int val;
    public List<Node> children;
    public Node() {}
    public Node(int val) {
        this.val = val;
    }
    public Node(int val, List<Node> children) {
        this.val = val;
        this.children = children;
    }
}
```

```java
itemList.add(node.val);
// 插入子节点
List<Node> children = node.children;
if (children == null | children.size() == 0) {
    continue;
}
for (Node child : children) {
    if (child != null) {
        que.offer(child);
    }
}
```

---

### 每层最大值

添加判断最大值的逻辑。

```c++
// c++
maxValue = node->val > maxValue ? node->val : maxValue;
if (node->left) que.push(node->left);
if (node->right) que.push(node->right);
```

```java
/*
    返回每层最大值的列表
     */
public static List<Integer> maxValues(TreeNode root) {
    List<Integer> maxValueList = new ArrayList<>();
    Queue<TreeNode> que = new LinkedList<>();
    if (root == null) {
        return maxValueList;
    }
    que.offer(root);

    while (!que.isEmpty()) {
        int len = que.size();
        List<Integer> levelValues = new ArrayList<>();
        for (int i = 0; i < len; i++) {
            TreeNode node = que.poll();
            // 值放入要处理的列表
            levelValues.add(node.val);
            // 插入左右节点
            if (node.left != null) {
                que.offer(node.left);
            }
            if (node.right != null) {
                que.offer(node.right);
            }
        }
        // 使用包函数取最大
        maxValueList.add(Collections.max(levelValues));
    }
    return maxValueList;
}
```

---

### 填充每个节点的下一个右侧节点指针

![116.填充每个节点的下一个右侧节点指针](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20210203152044855.jpg)

给一个完美二叉树，填充每个节点的next指针，指向下一个右侧节点，找不到设为NULL。

在单层遍历的时候记录本层头部节点，在遍历的时候让前一个节点指向本节点。

```java
class Solution {
    public TreeNode connect(TreeNode root) {
        Queue<TreeNode> que = new LinkedList<TreeNode>();
        if (root == null) return root;
        que.add(root);
        
        while (que.size() != 0) {
            int size = que.size();
            // 辅助节点
            TreeNode pre;
            TreeNode cur;
            for (int i = 0; i < size; i++) {
                if (i == 0) { // 处理最左节点
                    pre = que.poll();
                    cur = pre;
                } else { // 其他节点
                    cur = que.poll();
                    // 指针向后移动
                    pre.next = cur;
                    pre = pre.next;
                }
                if (cur.left != null) que.add(cur.left);
           		if (cur.right != null) que.add(cur.right);
            }
           	pre.next = null; // 本层最后一个节点指向NULL
        }
        // 返回也是根节点
        return root;
    }
}
```

---

### 二叉树最大深度

>   二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

**最大深度就是二叉树的层数，使用迭代法层序遍历。**

```java
class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null)   return 0;
        Queue<TreeNode> que = new LinkedList<>();
        que.offer(root);
        int depth = 0;
        while (!que.isEmpty())
        {
            int len = que.size();
            while (len > 0)
            {
                TreeNode node = que.poll();
                if (node.left != null)  que.offer(node.left);
                if (node.right != null) que.offer(node.right);
                len--;
            }
            depth++;
        }
        return depth;
    }
}
```

**前序遍历**

```java
class Solution {
public int result;
public void getDepth(TreeNode node, int depth) {
        result = depth > result ? depth : result; // 中

        if (node.left == null && node.right == null) return ;

        if (node.left) { // 左
            depth++;    // 深度+1
            getDepth(node.left, depth);
            depth--;    // 回溯，深度-1
        }
        if (node->right) { // 右
            depth++;    // 深度+1
            getDepth(node.right, depth);
            depth--;    // 回溯，深度-1
        }
        return ;
    }
public 	int maxDepth(TreeNode root) {
        result = 0;
        if (root == null) return result;
        getDepth(root, 1);
        return result;
    }
};
```



---

### 二叉树最小深度

**当节点的左右子节点都为空时，说明遍历到了最低点。**

只需在最大深度基础上增加左右子节点的判断。

```java
class Solution {
    public int minDepth(TreeNode root) {
        if (root == null) return 0;
        Queue<TreeNode> que = new LinkedList<>();
        que.offer(root);
        int depth = 0;
        while (que.size() != 0) {
            int size = que.size();
            // 在处理前递增
            depth++;
			for (int i = 0; i < size; i++) {
                cur = que.poll();
                // 如果当前节点的左右孩子都为空，直接返回最小深度
                if (cur.left == null && cur.right == null) {
                    return depth;
                }
                if (cur.left != null) que.offer(cur.left);
                if (cur.right != null) que.offer(cur.right);
            }
        } // end while
        return depth;        
    }
}
```



## 翻转二叉树

在遍历的时候翻转每一个节点的左右孩子。

前序遍历、后序遍历、层序遍历。**中序遍历会把某些节点的孩子翻转两次，只能使用统一形式用栈来遍历。**

### 递归法

1.   确定递归函数的参数和返回值
2.   确定终止条件：节点为空
3.   确定单层递归的逻辑：先交换左右子节点，再反转左右子树

```java
// DFS递归
public static TreeNode invertTree(TreeNode root) {
    if (root == null) {
        return root;
    }
    // swap
    swapChildren(root);
    invertTree(root.left);
    invertTree(root.right);
    return root;
}

public static void  swapChildren(TreeNode root) {
    TreeNode tmp = root.left;
    root.left = root.right;
    root.right = tmp;
}
```

### 迭代法

```java
//BFS 层序
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) {return null;}
        ArrayDeque<TreeNode> deque = new ArrayDeque<>();
        deque.offer(root);
        while (!deque.isEmpty()) {
            int size = deque.size();
            while (size-- > 0) {
                TreeNode node = deque.poll();
                swap(node);
                if (node.left != null) {deque.offer(node.left);}
                if (node.right != null) {deque.offer(node.right);}
            }
        }
        return root;
    }

    public void swap(TreeNode root) {
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;
    }
}
```



## 对称二叉树

![image-20220410195033266](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220410195033266.png)

比较根节点的左子树和右子树是否相互翻转。

后序遍历两棵树，遍历顺序分别为左右中、右左中。

### 递归法

1.   确定递归函数的参数和返回值
2.   确定终止条件：
     -   左右节点都为空，对称，返回 true
     -   左节点为空，右节点不为空，不对称，返回 false
     -   左不为空，右为空，不对称 返回 false
     -   左右都不为空，比较节点数值，不相同 false，相同 true
3.   单层递归的逻辑：左右节点都不为空，且数值相同的情况
     -   比较二叉树外侧是否对称：传入的是左节点的左孩子，右节点的右孩子。
     -   比较内测是否对称，传入左节点的右孩子，右节点的左孩子。
     -   如果左右都对称就返回true ，有一侧不对称就返回false 。

```java
/**
     * 递归法
     */
public boolean isSymmetric1(TreeNode root) {
    return compare(root.left, root.right);
}

private boolean compare(TreeNode left, TreeNode right) {

    if (left == null || right != null) {
        return false;
    }
    if (left == null && right == null) {
        return true;
    }
    if (left.val != right.val) {
        return false;
    }
    // 比较外侧
    boolean compareOutside = compare(left.left, right.right);
    // 比较内侧
    boolean compareInside = compare(left.right, right.left);
    return compareOutside && compareInside;
}
```

**相同二叉树只需要改动为比较同样的左右节点**

### 迭代法

![image-20220410210106808](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220410210106808.png)

```java
// 使用双端队列，相当于两个栈
public boolean isSymmetric(TreeNode root) {
    Deque<TreeNode> deque = new LinkedList<>();
    deque.offerFirst(root.left);
    deque.offerLast(root.right);
    while (!deque.isEmpty()) {
        TreeNode leftNode = deque.pollFirst();
        TreeNode rightNode = deque.pollLast();
        if (leftNode == null && rightNode == null) {
            continue;
        }
        if (leftNode == null || rightNode == null || leftNode.val != rightNode.val) {
            return false;
        }
        deque.offerFirst(leftNode.left);
        deque.offerFirst(leftNode.right);
        deque.offerFirst(rightNode.right);
        deque.offerFirst(rightNode.left);
    }
    return true;
}
```

```java
// 使用普通队列
public boolean isSymmetric(TreeNode root) {
    Queue<TreeNode> deque = new LinkedList<>();
    deque.offer(root.left);
    deque.offer(root.right);
    while (!deque.isEmpty()) {
        TreeNode leftNode = deque.poll();
        TreeNode rightNode = deque.poll();
        if (leftNode == null && rightNode == null) {
            continue;
        }
        if (leftNode == null || rightNode == null || leftNode.val != rightNode.val) {
            return false;
        }
        // 这里顺序与使用Deque不同
        deque.offer(leftNode.left);
        deque.offer(rightNode.right);
        deque.offer(leftNode.right);
        deque.offer(rightNode.left);
    }
    return true;
}
```



## 最大深度

### 迭代法

层序遍历

### 递归法

前序遍历、后序遍历。

1.   确定递归函数的参数和返回值：参数就是传入树的根节点，返回就返回这棵树的深度，所以返回值为int类型。
2.   终止条件：空节点
3.   单层递归逻辑：取左右子树最大深度＋1

```java
class solution {
    /**
     * 递归法 后序遍历
     */
    public int maxdepth(treenode root) {
        if (root == null) {
            return 0;
        }
        int leftdepth = maxdepth(root.left);
        int rightdepth = maxdepth(root.right);
        return math.max(leftdepth, rightdepth) + 1;

    }
}
```

```java
// n叉树最大深度
class Solution {
    /*递归法，后序遍历求root节点的高度*/
    public int maxDepth(Node root) {
        if (root == null) return 0;

        int depth = 0;
        if (root.children != null){
            for (Node child : root.children){
                depth = Math.max(depth, maxDepth(child));
            }
        }

        return depth + 1; //中节点
    }  
}
```

## 最小深度

```java
class Solution {
    /**
     * 递归法，相比求MaxDepth要复杂点
     * 因为最小深度是从根节点到最近**叶子节点**的最短路径上的节点数量
     */
    public int minDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftDepth = minDepth(root.left); // 左
        int rightDepth = minDepth(root.right); // 右
        // 中
        // 左子树空 右子树非空 此时并不是最低点 需要j
        if (root.left == null) {
            return rightDepth + 1;
        }
        if (root.right == null) {
            return leftDepth + 1;
        }
        // 左右结点都不为null
        return Math.min(leftDepth, rightDepth) + 1;
    }
}
```



## 二叉树节点个数

### 普通二叉树

递归解法

```java
class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftNum = countNodes(root.left); // 左
        int rightNum = countNodes(root.right); // 右
        int treeNum = leftNum + rightNum + 1; // 中
        return treeNum;
    }
}
```

层序遍历迭代法

```java
class Solution {
    public int countNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }
        Queue<TreeNode> que = new LinkedList<>();
        que.offer(root);
        int res = 0; // 节点个数
        while (!que.isEmpty()) {
            int size = que.size();
            while (size > 0) {
                TreeNode cur = que.poll)(); // 弹出节点
                res++;
                if (cur.left != null) {
                    que.offer(cur.left);
                }
                if (cur.right != null) {
                    que.offer(cur.right);
                }
                size--;
            }
        }
        return res;
    }
}
```

### 完全二叉树

两种情况：

1.   满二叉树
2.   最后一层叶子节点没有满

>   如果整个树不是满二叉树，就递归其左右孩子，直到遇到满二叉树为止，用公式计算这个子树（满二叉树）的节点数量。

**递归法**

```java
class Solution {
    /**
     * 针对完全二叉树的解法
     *
     * 满二叉树的结点数为：2^depth - 1
     */
    public int countNodes(TreeNode root) {
        if(root == null) {
            return 0;
        }
        int leftDepth = getDepth(root.left);
        int rightDepth = getDepth(root.right);
        if (leftDepth == rightDepth) {// 左子树是满二叉树
            // 2^leftDepth其实是 （2^leftDepth - 1） + 1 ，左子树 + 根结点
            return (1 << leftDepth) + countNodes(root.right);
        } else {// 右子树是满二叉树
            return (1 << rightDepth) + countNodes(root.left);
        }
    }

    private int getDepth(TreeNode root) {
        int depth = 0;
        while (root != null) {
            root = root.left;
            depth++;
        }
        return depth;
    }
}
```

![image-20220412202638502](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220412202638502.png)



## 平衡二叉树

**平衡二叉树：一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过1。**

-   二叉树节点的深度：指从根节点到该节点的最长简单路径边的条数。
-   二叉树节点的高度：指从该节点到叶子节点的最长简单路径边的条数。

![image-20220412202816402](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220412202816402.png)

求深度可以从上到下去查 所以需要前序遍历（中左右），而高度只能从下到上去查，所以只能后序遍历（左右中）

**根节点的高度就是树的最大深度**

### 递归法

```java
public class BalancedTree {
    public static void main(String[] args) {
        int[] vec = new int[]{4, 1, 6, 0, 2, 5, 7, -1, -1, -1, 3, -1, -1, -1, 8};
        TreeNode root = TreeUtils.CreateBinaryTree(vec);
		System.out.println(isBalanced(root));
    }
    public static boolean isBalanced(TreeNode root) {
        return getHeight(root) != -1;
    }
    private static int getHeight(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftHeight = getHeight(root.left);
        // 子树已经不是平衡树
        if (leftHeight == -1) {
            return -1;
        }
        int rightHeight = getHeight(root.right);
        if (rightHeight == -1) {
            return -1;
        }

        // 左右子树高度差大于1 不是平衡树
        if (Math.abs(leftHeight - rightHeight) > 1) {
            return -1;
        }
        // 返回此子树高度
        return Math.max(leftHeight, rightHeight) + 1;

    }
}
```

---

### TODO:迭代法





## 二叉树路径

给定一个二叉树，返回所有从根节点到叶子节点的路径。

![257.二叉树的所有路径](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20210204151702443.png)

**回溯和递归都是相伴相生的。**

### 递归

1.   递归函数函数参数以及返回值：根节点，记录每一条路径的paths和存放结果集的result.

     ```java
     private void traversal(TreeNode root, List<Integer> paths, List<String> res);
     ```

2.   终止条件：找到叶子节点，左右孩子都为空。

     ```java
     if (root.left == null && root.right == null) {
         // 终止处理逻辑 把路径放入result
     }
     ```

3.   单层递归逻辑：

     -   中间节点放入paths
     -   判断cur是否为空，再进行递归。
     -   与递归在同个括号里的回溯，删除节点。

```java
/*
    递归法 回溯
     */
public static List<String> binaryTreePaths(TreeNode root) {
    List<String> res = new ArrayList<>();
    if (root == null) {
        return res;
    }
    List<Integer> paths = new ArrayList<>();
    traversal(root, paths, res);
    return res;
}
private static void traversal(TreeNode root, List<Integer> paths, List<String> res) {
    paths.add(root.val);
    // 到达叶子节点 处理输出路径
    if (root.left == null && root.right == null) {
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < paths.size() - 1; i++) {
            // 拼接输出字符串
            sb.append(paths.get(i)).append("->");
        }
        // 最后的节点字符
        sb.append(paths.get(paths.size() - 1));
        res.add(sb.toString());
        return;
    }
    if (root.left != null) {
        traversal(root.left, paths, res);
        paths.remove(paths.size() - 1); // 回溯
    }
    if (root.right != null) {
        traversal(root.right, paths, res);
        paths.remove(paths.size() - 1); // 回溯
    }
}
```

---

### 迭代法

使用前序遍历的迭代方式来模拟遍历路径的过程。

**关键在于反复入栈的结果字符串**

```java
class Solution {
    /**
     * 迭代法
     */
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> result = new ArrayList<>();
        if (root == null)
            return result;
        Stack<Object> stack = new Stack<>();
        // 节点和路径同时入栈
        stack.push(root);
        stack.push(root.val + "");
        while (!stack.isEmpty()) {
            // 节点和路径同时出栈
            String path = (String) stack.pop();
            TreeNode node = (TreeNode) stack.pop();
            // 若找到叶子节点
            if (node.left == null && node.right == null) {
                result.add(path);
            }
            //右子节点不为空
            if (node.right != null) {
                stack.push(node.right);
                stack.push(path + "->" + node.right.val);
            }
            //左子节点不为空
            if (node.left != null) {
                stack.push(node.left);
                stack.push(path + "->" + node.left.val);
            }
        }
        return result;
    }
}
```



## 左叶子之和

**判断左叶子**

```java
if (root.left != null && root.left.left == null && root.left.right == null) {
    // ...
}
```

### 递归

```java
class Solution {
    public int sumOfLeftLeaves(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftValue = sumOfLeftLeaves(root.left); // 左
        int rightValue = sumOfLeftLeaves（root.right); // 右
        int midValue = 0;
        if (root.left != null && root.left.left == null && root.left.right == null) {
            midValue = root.left.value;
        }
        int sum = midValue + leftValue + rightValue; // 中
        return sum;
    }
}
```

### 迭代

```java
// 层序遍历迭代法
class Solution {
    public int sumOfLeftLeaves(TreeNode root) {
        int sum = 0;
        if (root == null) return 0;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            while (size -- > 0) {
                TreeNode node = queue.poll();
                if (node.left != null) { // 左节点不为空
                    queue.offer(node.left);
                    if (node.left.left == null && node.left.right == null){ // 左叶子节点
                        sum += node.left.val;
                    }
                }
                if (node.right != null) queue.offer(node.right);
            }
        }
        return sum;
    }
}
```



## 树左下角的值

### 迭代法层序遍历

```java
class Solution {
    public int findBottomLeftValue(TreeNode root) {
        Queue<TreeNode> que = new LinkedList<>();
        que.offer(root);
        int res = 0;
		while (!que.isEmpty()) {
			int size = que.size();
            for (int i = 0; i < size; i++) {
                TreeNode cur = que.poll();
                if (i == 0) {
                    res = cur.val; // 更新左下角的值
                }
                if (cur.left != null) {
                    que.offer(cur.left);
                }
                if (cur.right != null) {
                    que.offer(cur.right);
                }
            }
        }
        return res;
    }
}
```



## 路径总和

给定一个二叉树和一个目标和，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和。

![112.路径总和](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/2021020316051216.png)

### 递归

1.   **递归函数需要返回值 boolean**
2.   终止条件：
     -   遇到叶子节点，计数递减为0
     -   遇到叶子节点未找到合适路径
3.   单层递归的逻辑：空节点不遍历

```java
class Solution {
    public boolean haspathSum(TreeNode root, int targetSum) {
        if (root == null) {
            return false;
        }
        targetSum -= root.val;
        // 遇到叶子节点
        if (root.left == null && root.right == null) {
			// 是否递减为0
            // 最开始的返回 true
            return targetSum == 0;
        }
        if (root.left != null) {
            boolean left = haspathSum(root.left, targetSum);
            if (left) {
                // 找到符合的路径
                return true;
            }
        }
        if (root.right != null) {
            boolean right = haspathSum(root.right, targetSum);
            if (right) {
                // 找到符合的路径
                return true;
            }
        }
        // 左右子树都没找到 回溯
        return false;
    }
}
```



## 构造二叉树

-   前序和中序可以唯一确定一颗二叉树
-   后序和中序可以唯一确定一颗二叉树

**前序和后序不能唯一确定一棵二叉树！**，因为没有中序遍历无法确定左右部分，也就是无法分割。

![image-20220413222019128](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220413222019128.png)

### 思路

以后序数组的最后一个元素为切割点，先切中序数组，根据中序数组，反过来在切后序数组。

来看一下一共分几步：

-   第一步：如果数组大小为零的话，说明是空节点了。
-   第二步：如果不为空，那么取后序数组最后一个元素作为节点元素。
-   第三步：找到后序数组最后一个元素在中序数组的位置，作为切割点
-   第四步：切割中序数组，切成中序左数组和中序右数组 （顺序别搞反了，一定是先切中序数组）
-   第五步：切割后序数组，切成后序左数组和后序右数组
-   第六步：递归处理左区间和右区间

### 后序中序

🟠**通过下标索引直接在原数组上操作。**

```java
/*
    中序后续构造二叉树
     */
public static TreeNode buildTreeByInorderAndPostorder(int[] inorder, int[] postorder) {
    return buildTree(inorder, 0, inorder.length, postorder, 0, postorder.length);

}
/*
    inLeft inRight postLeft postRight 数组的区间索引 左闭右开
     */
private static TreeNode buildTree(int[] inorder, int inLeft, int inRight, int[] postorder, int postLeft,
                                  int postRight) {
    // 没有元素
    if (inRight - inLeft < 1) {
        return null;
    }
    // 只有一个元素
    if (inRight - inLeft == 1) {
        return new TreeNode(inorder[inLeft]);
    }
    // 后序数组里最后一个就是根节点
    int rootVal = postorder[postRight - 1];
    TreeNode root = new TreeNode(rootVal);
    int rootIndex = 0;
    // 根据节点的值找到该值在中序数组inorder里的位置
    for (int i = inLeft; i < inRight; i++) {
        if (inorder[i] == rootVal) {
            rootIndex = i;
            break;
        }
    }

    // 切割中序数组
    // 中序左区间
    int leftInorderBegin = inLeft;
    int leftInorderEnd = rootIndex;
    // 中序右区间
    int rightInorderBegin = rootIndex + 1; // 跳过切割的节点
    int rightInorderEnd = inRight;

    // 切割后序数组
    // 后序左区间
    int leftPostorderBegin = postLeft;
    int leftPostorderEnd = postLeft + (rootIndex - inLeft);
    // 后序右区间
    int rightPostorderBegin = postLeft + (rootIndex - inLeft);
    int rightPostorderEnd = postRight - 1; // 排除最后一个元素 已用的根节点

    // 调试
    System.out.println("leftInorder:");
    for (int i = leftInorderBegin; i < leftInorderEnd; i++) {
        System.out.print(inorder[i] + " ");
    }
    System.out.println();

    System.out.println("rightInorder:");
    for (int i = rightInorderBegin; i < rightInorderEnd; i++) {
        System.out.print(inorder[i] + " ");
    }
    System.out.println();

    System.out.println("leftPostorder:");
    for (int i = leftPostorderBegin; i < leftPostorderEnd; i++) {
        System.out.print(postorder[i] + " ");
    }
    System.out.println();

    System.out.println("rightPostorder:");
    for (int i = rightPostorderBegin; i < rightPostorderEnd; i++) {
        System.out.print(postorder[i] + " ");
    }
    System.out.println();


    // 根据rootIndex划分左右子树
    root.left = buildTree(inorder, leftInorderBegin, leftInorderEnd,
                          postorder, leftPostorderBegin, leftPostorderEnd);
    root.right = buildTree(inorder, rightInorderBegin, rightInorderEnd,
                           postorder, rightPostorderBegin, rightPostorderEnd);
    return root;
}

}
```

---

### 前序中序

```java
class Solution {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        return helper(preorder, 0, preorder.length - 1, inorder, 0, inorder.length - 1);
    }

    public TreeNode helper(int[] preorder, int preLeft, int preRight,
                           int[] inorder, int inLeft, int inRight) {
        // 递归终止条件
        if (inLeft > inRight || preLeft > preRight) return null;

        // val 为前序遍历第一个的值，也即是根节点的值
        // idx 为根据根节点的值来找中序遍历的下标
        int idx = inLeft, val = preorder[preLeft];
        TreeNode root = new TreeNode(val);
        for (int i = inLeft; i <= inRight; i++) {
            if (inorder[i] == val) {
                idx = i;
                break;
            }
        }

        // 根据 idx 来递归找左右子树
        root.left = helper(preorder, preLeft + 1, preLeft + (idx - inLeft),
                           inorder, inLeft, idx - 1);
        root.right = helper(preorder, preLeft + (idx - inLeft) + 1, preRight,
                            inorder, idx + 1, inRight);
        return root;
    }
}
```



## 最大二叉树

给定一个不含重复元素的整数数组。一个以此数组构建的最大二叉树定义如下：

-   二叉树的根是数组中的最大元素。
-   左子树是通过数组中最大值左边部分构造出的最大二叉树。
-   右子树是通过数组中最大值右边部分构造出的最大二叉树。

通过给定的数组构建最大二叉树，并且输出这个树的根节点。

![image-20220414103516751](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220414103516751.png)

### 前序遍历 递归

-   确定递归函数的参数和返回值：传入数组，返回根节点的引用。
-   终止条件：传入数组的大小为1，构造并返回一个节点。
-   单层递归逻辑：
    -   找到数组中最大的值和对应下标，最大值构造根节点，下标用来分割数组。
    -   最大值所在的下标左区间构造左子树
    -   最大值所在的下标右区间 构造右子树

```java
class Solution {
    public TreeNode constructMaximumBinaryTree(int[] nums) {
        return constructMaximumBinaryTree1(nums, 0, nums.length);
    }

    public TreeNode constructMaximumBinaryTree1(int[] nums, int leftIndex, int rightIndex) {
        if (rightIndex - leftIndex < 1) {
            return null;
        }
        if (rightIndex - leftIndex == 1) {
            return new TreeNode(nums[leftIndex]);
        }
        int maxIndex = 0 // 最大值所在位置
        int maxVal = 0 // 最大值
        for (int i = leftIndex; i < rightIndex; i++) {
            if (nums[i] > maxVal) {
                maxVal = nums[i];
                maxIndex = i;
            }
        }
        TreeNode root = new TreeNode(maxVal);
        // 根据maxIndex划分左右子树
        root.left = constructMaximumBinaryTree(nums, leftIndex, maxIndex);
        root.left = constructMaximumBinaryTree(nums, maxIndex + 1, rightIndex);
        return root;
    }
}
```



## 合并二叉树

![617.合并二叉树](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20210204153634809.png)

**和遍历一个树的逻辑相同。**

将Tree2覆盖到Tree1上。

### 前序遍历 递归

```java
class Solution {
    public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
        if (root1 == null) {
            return root2;
        }
        if (root2 == null) {
            return root1;
        }
        TreeNode cur = new TreeNode(root1.val + root2.val);
        cur.left = mergeTrees(root1.left, root2.left);
        cur.right = mergeTrees(root1.right, root2.right);
        return cur;
    }
}
```

---

### 层序遍历 迭代

```java
// 使用队列
class Solution {
	public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
        if (root1 == null) {
            return root2;
        }
        if (root2 == null) {
            return root1;
        }
        Queue<TreeNode> que = new LinkedList<>();
        que.offer(root1);
        que.offer(root2);
        while (!que.isEmpty()) {
            TreeNode node1 = que.poll();
            TreeNode node2 = que.poll();
            // 合并值
            node1.val = node1.val + node2.val;
            // 如果两棵树左节点都不为空 加入队列
            if (node1.left != null && node2.left != null) {
                que.offer(node1.left);
                que.offer(node2.left);
            }
            // 如果两棵树右节点都不为空 加入队列
            if (node1.right != null && node2.right != null) {
                que.offer(node1.right);
                que.offer(node2.right);
            }
            // 若node1的左节点为空，直接赋值
            if (node1.left == null && node2.left != null) {
                node1.left = node2.left;
            }
            // 若node1的右节点为空，直接赋值
            if (node1.right == null && node2.right != null) {
                node1.right = node2.right;
            }
        }
        return root1;
    }
}
```



## 二叉搜索树的搜索

二叉搜索树是一个有序树：

-   若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
-   若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
-   它的左、右子树也分别为二叉搜索树

**二叉搜索树的节点是有序的，根据大小的比较就可以确定方向。**

![二叉搜索树](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20200812190213280.png)

### 递归

```java
class Solution {
    // 递归，普通二叉树
    public TreeNode searchBST(TreeNode root, int val) {
        if (root == null || root.val == val) {
            return root;
        }
        TreeNode left = searchBST(root.left, val);
        if (left != null) {
            return left;
        }
        return searchBST(root.right, val);
    }
}

class Solution {
    // 递归，利用二叉搜索树特点，优化
    public TreeNode searchBST(TreeNode root, int val) {
        if (root == null || root.val == val) {
            return root;
        }
        if (val < root.val) {
            return searchBST(root.left, val);
        } else {
            return searchBST(root.right, val);
        }
    }
}
```

---

### 迭代法

```java
class Solution {
    // 迭代，普通二叉树
    // 使用栈的层序遍历 注意先放入右节点再放入左节点
    public TreeNode searchBST(TreeNode root, int val) {
        if (root == null || root.val == val) {
            return root;
        }
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode cur = stack.pop();
            if (cur.val == val) {
                return cur;
            }
            if (cur.right != null) {
                stack.push(cur.right);
            }
            if (cur.left != null) {
                stack.push(cur.left);
            }
        }
        return null;
    }
}
```

**可以利用二叉搜索树的特点，不使用栈。**

```java
class Solution {
	while (root != null) {
        if (val < root.val) {
            root = root.left;
        } else if (val > root.val) {
            root = root.right;
        } else {
            // 找到
            return root;
        }
    }
    return null;
}
```



## 验证二叉搜索树

### 有序数组

**二叉搜索树的中序遍历是递增序列。**

只需要将二叉搜索树转换为有序数组再判断递增性。

```java
class Solution {
	private List<Integer> result = new LinkedList<>();
	public boolean isValidBST(TreeNode root) {
        traversal(root);
        // 判断有序
        for (int i = 1; i < result.size(); i++) {
            if (result[i] <= result[i - 1]) {
                return false;
            }
        }
        return true;
    }
    private void traversal(TreeNode root) {
        if (root == null) {
            return;
        }
        traversal(root.left);
        list.add(root.val); // 将二叉树转换为有序数组
        traversal(root.right);
    }
}
```

### 递归

直接在中序遍历的过程中比较。

```java
class Solution {
    // 递归
    TreeNode max;
    public boolean isValidBST(TreeNode root) {
        if (root == null) {
            return true;
        }
        // 左
        boolean left = isValidBST(root.left);
        if (!left) {
            return false;
        }
        // 中
        if (max != null && root.val <= max.val) {
            return false;
        }
        max = root;
        // 右
        boolean right = isValidBST(root.right);
        return right;
    }
}
```

---

### 迭代

```java
class Solution {
    // 迭代
    public boolean isValidBST(TreeNode root) {
        if (root == null) {
            return true;
        }
        Stack<TreeNode> stack = new Stack<>();
        TreeNode pre = null;
        while (root != null || !stack.isEmpty()) {
            // 达到树的左下角
            while (root != null) {
                stack.push(root);
                root = root.left;// 左
            }
            // 中，处理
            TreeNode pop = stack.pop();
            if (pre != null && pop.val <= pre.val) {
                return false;
            }
            pre = pop;

            root = pop.right;// 右
        }
        return true;
    }
}
```



## 二叉搜索树的最小绝对差

![530二叉搜索树的最小绝对差](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20201014223400123.png)

**相当于在一个有序数组上求差值。**

把二叉搜索树转换成有序数组，再遍历一遍数组。

```java
class Solution {
	private List<Integer> result = new LinkedList<>();
	public int getMinimumDifference(TreeNode root) {
        traversal(root);
        // 至少有两个节点
        if (result.size() < 2) return 0;
        // 最小差值
        int minDiffer = Integer.MAX_VALUE
        for (int i = 1; i < result.size(); i++) {
            minDiffer = Math.min(minDiffer, result[i] - result[i-1];
        }
        return result;
    }
    private void traversal(TreeNode root) {
        if (root == null) {
            return;
        }
        traversal(root.left);
        list.add(root.val); // 将二叉树转换为有序数组
        traversal(root.right);
    }
}
```



## 二叉搜索树中的众数

给定一个有相同值的二叉搜索树（BST），找出 BST 中的所有众数（出现频率最高的元素）。

假定 BST 有如下定义：

-   结点左子树中所含结点的值小于等于当前结点的值
-   结点右子树中所含结点的值大于等于当前结点的值
-   左子树和右子树都是二叉搜索树

### 暴力法

普通二叉树也适用。任意方式遍历树，用map统计频率，取高频元素的集合。

```java
public class CountMapTree {
    public static void main(String[] args) {
        int[] vec = new int[]{4, 2, 6, 0, 2, 3, 2, 3, 3, -1, 3, -1, -1, -1, 2};
        TreeNode root = TreeUtils.CreateBinaryTree(vec);
        int[] res = new CountMapTree().countMap(root);
        for (int r : res) {
            System.out.print(r + " ");
        }
    }
    public int[] countMap(TreeNode root) {
        Map<Integer, Integer> map = new HashMap<>();
        List<Integer> list = new ArrayList<>();
        if (root == null) {
            return list.stream().mapToInt(Integer::intValue).toArray();
        }
        // 获取频率
        searchBST(root, map);
        // 根据出现的次数 值 从高到低排序
        List<Map.Entry<Integer, Integer>> mapList = map.entrySet().stream()
            .sorted((c1, c2) -> c2.getValue().compareTo(c1.getValue()))
            .collect(Collectors.toList());
        // 频率最高的加入list
        list.add(mapList.get(0).getKey());
        // 如果前几个出现次数相同
        for (int i = 1; i < mapList.size(); i++) {
            if (mapList.get(i).getValue() == mapList.get(i-1).getValue()) {
                System.out.println("ddd");
                list.add((mapList.get(i).getKey()));
            } else {
                break;
            }
        }
        return list.stream().mapToInt(Integer::intValue).toArray();
    }

    void searchBST(TreeNode cur, Map<Integer, Integer> map) {
        if (cur == null) {
            return;
        }
        map.put(cur.val, map.getOrDefault(cur.val, 0) + 1);
        searchBST(cur.left, map);
        searchBST(cur.right, map);
    }
}
```





## 二叉搜索树中的插入操作

![image-20220415093157053](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220415093157053.png)

只要遍历二叉搜索树，找到空节点插入元素就可以了。

### 递归

-   递归函数参数以及返回值：**利用返回值完成新加入的节点与其父节点的赋值操作**。
-   终止条件：找到遍历的节点为null的时候，就是要插入节点的位置了，并把插入的节点返回。
-   单层逻辑：根据插入数值的方向决定递归方向。

```java
class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
        if (root == null) {
            // 节点为空就在此插入 即创建节点并返回
            return new TreeNode(val);
        }
        // 无先后区分
        if (root.val < val) { // 递归创建右子树
            root.right = insertIntoBST(root.right, val);
        }
        if (root.val > val) { // 递归创建左子树
            root.right = insertIntoBST(root.right, val);
        }
    }
}
```

---

### 迭代

```java
class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
        if (root == null) {
            return new TreeNode(val);
        }
        TreeNode cur = root;
        TreeNode pre = root; // 记录上一个节点
        while (root != null) {
            pre = root;
            // 迭代的方向
            if (root.val > val) {
                root = root.left;
            } else if (root.val < val) {
                root = root.right;
            }
        }
        // 此时找到空节点 确定子搜索树的结构
        if (pre.val > val) {
            pre.left = new TreeNode(val);
        } else {
            pre.right = new TreeNode(val);
        }
    }
}
```



## 删除二叉搜索树中的节点

![450.删除二叉搜索树中的节点](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20201020171048265.png)

给定一个二叉搜索树的根节点 root 和一个值 key，删除二叉搜索树中的 key 对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。

### 递归

-   通过递归返回值删除节点
-   终止条件：遇到空返回，没找到删除的节点。
-   单层递归的逻辑：
    1.   没找到删除的节点，遍历到空节点直接返回
    2.   删除节点的左孩子空，右孩子不空，删除节点，右孩子补位，返回右孩子为根节点
    3.   删除节点的右孩子空，左孩子不空，删除节点，右孩子补位，返回右孩子为根节点
    4.   左右都不为空，删除节点的左子树放在删除节点右子树的左下角，返回删除节点右孩子为新的根节点

![image-20220415114134431](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220415114134431.png)

### 递归法

```java
class Solution {
    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return root;
        // 找到删除节点
        if (root.val == key) {
            // 左孩子空，右孩子不空
            if (root.left == null) {
                return root.right;
            } else if (root.right == null) {
                // 右孩子空，左孩子不空
                return root.left;
            } else {
                // 左右都不为空
                TreeNode cur = root.right;
                while (cur.left != null) {
                    // 做到左下角节点
                    cur = cur.left;
                }
                cur.left = root.left;
                root = root. right;
                return root;
            } // out else
        }
        // 没找到删除节点 根据值确定方向
        if (root.val > key) {
            root.left = deleteNode(root.left, key);
        }
        if (root.val < key) {
            root.right = deleteNode(root.right, key);
        }
        return root;
    }
}
```



## 修剪二叉树

>   给定一个二叉搜索树，同时给定最小边界L 和最大边界 R。通过修剪二叉搜索树，使得所有节点的值在[L, R]中 (R>=L) 。你可能需要改变树的根节点，所以结果应当返回修剪好的二叉搜索树的新的根节点。

![669.修剪二叉搜索树](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20210204155302751.png)

![669.修剪二叉搜索树1](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20210204155327203.png)

### 递归

-   通过递归函数的返回值来移除节点
-   终止条件：遇到空节点返回，修剪的操作并不是在终止条件上进行
-   单层递归逻辑：
    -   如果root（当前节点）的元素小于low的数值，那么应该递归右子树，并返回右子树符合条件的头结点。
    -   如果root(当前节点)的元素大于high的，那么应该递归左子树，并返回左子树符合条件的头结点。
    -   将下一层处理完左子树的结果赋给root.left，处理完右子树的结果赋给root.right。

```java
class Solution {
    public TreeNode trimBST(TreeNode root, int low, int high) {
        if (root == null) {
            return null;
        }
        if (root.val < low) {
            return trimBST(root.right, low, high);
        }
        if (root.val > high) {
            return trimBST(root.left, low, high);
        }
        // root在范围内
        root.left = trimBST(root.left, low, high);
        root.right = trimBST(root.right, low, high);
        return root;
    }
}
```



## 有序数组转换为二叉搜索树

**本质就是寻找分割点，分割点作为当前节点，然后递归左区间和右区间**。

![108.将有序数组转换为二叉搜索树](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/108.%E5%B0%86%E6%9C%89%E5%BA%8F%E6%95%B0%E7%BB%84%E8%BD%AC%E6%8D%A2%E4%B8%BA%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91.png)

### 递归：左闭右开

```java
class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return sortedArrayToBST(nums, 0, nums.length);
    }
    public TreeNode sortedArrayTOBST(int[] nums, int left, int right) {
        if (left >= right) {
            return null;
        }
        if (right - left == 1) {
            return new TreeNode(nums[left]);
        }
        // 从中点开始 自然是平衡的树
        int mid = left + (right - left) / 2;
        TreeNode root = new TreeNode(nums[mid]);
        root.left = sortedArrayToBST(nums, left, mid);  // 左闭右开
        root.right = sortedArrayToBST(nums, mid + 1, right); // 跳过中点
        return root;
    }
}
```



## 把二叉搜索树转换为累加树

>   给出二叉 搜索 树的根节点，该树的节点值各不相同，请你将其转换为累加树（Greater Sum Tree），使每个节点 node 的新值等于原树中大于或等于 node.val 的值之和。

![538.把二叉搜索树转换为累加树](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20201023160751832.png)

相当于给一个有序数组，求从后到前的累加数组。

二叉搜索树是有序的。

树中的累加顺序是**右中左**，只需要反向中序遍历**右中左**，然后顺序累加。

### 递归法

```java
class Solution {
    int sum;
    public TreeNode convertBST(TreeNode root) {
    	sum = 0;
        convertBST1(root);
        return root;
    }
    // 右中左的顺序遍历 累加
    public void convertBST1(TreeNode root) {
        if (root == null) {
            return;
        }
        convertBST1(root.right);
        sum += root.val;
        root.val = sum;
        convertBST1(root.left);
    }
}
```
