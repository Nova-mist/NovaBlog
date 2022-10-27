---
title: 动态规划
date: 2022-07-13 23:15:13
tags:
  - Java
  - 算法
---

# 动态规划

背包问题、打家劫舍、股票问题、子序列问题。



看代码随想录的笔记。

☕

<!-- more -->

## 理论基础

动态规划中的每一个状态是有上一个状态推导出来的。

贪心是局部直接选最优。

🟢步骤：

1. 确定dp数组（dp table）以及下标的含义
2. 确定**递推公式**
3. dp数组如何初始化
4. 确定遍历顺序
5. 举例推导dp数组

🟠调试程序的方法：打印dp数组。



## 斐波那契数

[509. 斐波那契数 - 力扣（LeetCode）](https://leetcode.cn/problems/fibonacci-number/)

1. dp[i]的定义为：第i个数的斐波那契数值是dp[i]
2. 递推公式，状态转移方程 dp[i] = dp[i - 1] + dp[i - 2]
3. 初始化，dp[0] = 0, dp[1] = 1
4. 遍历顺序，dp[i]是依赖 dp[i - 1] 和 dp[i - 2]，那么遍历的顺序一定是从前到后遍历的
5. ，0 1 1 2 3 5 8 13 21 34 55

**动态规划**

```java
class Solution {
    public int fib(int n) {
        if (n < 2) {
            return n;
        }
        int[] dp = new int[2];
        dp[0] = 0;
        dp[1] = 1;
        for (int i = 1; i < n; i++) {
            int sum = dp[0] + dp[1];
            dp[0] = dp[1];
            dp[1] = sum;
        }
        return dp[1];
    }
}
```

**递归**

```java
class Solution {
    public int fib(int n) {
        if (n < 2) return n;
        return fib(n - 1) + fib(n - 2);
    }
}
```



## 爬楼梯

[70. 爬楼梯 - 力扣（LeetCode）](https://leetcode.cn/problems/climbing-stairs/)

到第三层楼的状态可以由第二层楼和到第一层楼的状态推导出来。

1. dp[i]： 爬到第i层楼梯，有dp[i]种方法
2. dp[i] = dp[i - 1] + dp[i - 2] 前一个状态的步数再走一步或两步
3. 不考虑dp[0]如果初始化，只初始化dp[1] = 1，dp[2] = 2，然后从i = 3开始递推，这样才符合dp[i]的定义。
4. 遍历顺序，从前向后
5. 举例推导dp数组，n = 5， 1 2 3 5 8

```java
class Solution {
    public int climbStairs(int n) {
        int[] dp = new int[n + 1];
        dp[0] = 1; // dp[0]没有意义 只是为了推出dp[2] = 2
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
}
```

**🟠完全背包思路**

> **改为：一步一个台阶，两个台阶，三个台阶，.......，直到 m个台阶。问有多少种不同的方法可以爬到楼顶呢？**
>
> 1阶，2阶，.... m阶就是物品，楼顶就是背包。
>
> 每一阶可以重复使用，例如跳了1阶，还可以继续跳1阶。
>
> 问跳到楼顶有几种方法其实就是问装满背包有几种方法。

1. dp[i]：爬到有i个台阶的楼顶，有dp[i]种方法。
2. 递推公式，dp[i] += dp[i - j]
3. 初始化，dp[0] 一定为1，其他数值为0
4. 遍历顺序，**1、2 步 和 2、1 步都是上三个台阶，但是这两种方法不一样**，是排序，需要先遍历背包容量再遍历物品。

```java
class Solution {
    public int climbStairs(int n) {
        int[] dp = new int[n + 1];
        int[] weight = {1,2};
        dp[0] = 1;

        for (int i = 0; i <= n; i++) {
            for (int j = 0; j < weight.length; j++) {
                if (i >= weight[j]) {
                    dp[i] += dp[i - weight[j]];
                }
            }
        }
        return dp[n];
    }
}
```



## 使用最小花费爬楼梯

[746. 使用最小花费爬楼梯 - 力扣（LeetCode）](https://leetcode.cn/problems/min-cost-climbing-stairs/)

1. dp[i]的定义：到达第i个台阶所花费的最少体力为dp[i]
2. 递推公式 dp[i] = min(dp[i - 1], dp[i - 2]) + cost[i]
3. 初始化 dp[0] dp[1]
4. 遍历顺序，从前到后
5. 举例推导dp数组

![746.使用最小花费爬楼梯](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/2021010621363669.png)

```java
class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int[] dp = new int[cost.length];
        dp[0] = cost[0];
        dp[1] = cost[1];
        for (int i = 2; i < cost.length; i++) {
            dp[i] = Math.min(dp[i - 1], dp[i - 2]) + cost[i];
        }
        // 最后走一步还是两步去最小花费体力
        return Math.min(dp[cost.length - 1], dp[cost.length - 2]);
    }
}
```

🟠**第一步花费体力。**



## 不同路径

[62. 不同路径 - 力扣（LeetCode）](https://leetcode.cn/problems/unique-paths/)

1. dp\[i][j] ：表示从（0 ，0）出发，到(i, j) 有dp\[i][j]条不同的路径。
2. dp\[i][j] = dp\[i - 1][j] + dp\[i][j - 1]
3. 初始化，dp\[i][0]一定都是1，因为从(0, 0)的位置到(i, 0)的路径只有一条，那么dp\[0][j]也同理。
4. 遍历顺序，从左到右一层一层遍历
5. 推导dp数组

![image-20220630153648692](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220630153648692.png)

```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        // 初始化
        for (int i = 0; i < m; i++) {
            dp[i][0] = 1;
        }
        for (int i = 0; i < n; i++) {
            dp[0][i] = 1;
        }
        // 递推
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        return dp[m - 1][n - 1];
    }
}
```



## 不同路径有障碍

[63. 不同路径 II - 力扣（LeetCode）](https://leetcode.cn/problems/unique-paths-ii/)

**🟠遇到障碍跳过，注意行列**

```java
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int m = obstacleGrid.length, n = obstacleGrid[0].length; // m行n列
        int[][] dp = new int[m][n];

        for(int i = 0; i < m; i++) {
            if (obstacleGrid[i][0] == 1) break;
            dp[i][0] = 1;
        }
        for(int i = 0; i < n; i++) {
            if (obstacleGrid[0][i] == 1) break;
            dp[0][i] = 1;
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                // 遇到障碍跳过
                if (obstacleGrid[i][j] == 1) continue;
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        return dp[m - 1][n - 1];
    }
}
```



## 整数拆分

[343. 整数拆分 - 力扣（LeetCode）](https://leetcode.cn/problems/integer-break/)

1. dp[i]：分拆数字i，可以得到的最大乘积为dp[i]。
2. dp[i] = max({dp[i], (i - j) * j, dp[i - j] * j})
3. 初始化，dp[0] dp[1] 没有意义，只初始化dp[2] = 1
4. 遍历顺序，dp[i] 是依靠 dp[i - j]的状态，所以遍历i一定是从前向后遍历
5. 推导dp数组

![image-20220630160852209](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220630160852209.png)

**🟠两种拆法**

```java
class Solution {
    public int integerBreak(int n) {
        int[] dp = new int[n + 1];
        dp[2] = 1;
        // 从dp[3]开始推导
        for (int i = 3; i <= n; i++) {
            for (int j = 1; j <= i - j; j++) {
                // j * (i - j) 将整数i拆成两个数相乘
                // j * dp[i - j] 将i拆成两个及以上个数再相乘
                dp[i] = Math.max(dp[i], Math.max(j * (i - j), j * dp[i - j]));
            }
        }
        return dp[n];
    }
}
```



## 不同的二叉搜索树

[96. 不同的二叉搜索树 - 力扣（LeetCode）](https://leetcode.cn/problems/unique-binary-search-trees/)

二叉搜索树是一个有序树：

- 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
- 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
- 它的左、右子树也分别为二叉搜索树

**重叠子问题**

dp[3]，就是 元素1为头结点搜索树的数量 + 元素2为头结点搜索树的数量 + 元素3为头结点搜索树的数量

**dp[3] = dp[2] * dp[0] + dp[1] * dp[1] + dp[0] * dp[2]**

1. dp[i] ： 1到i为节点组成的二叉搜索树的个数为dp[i]。
2. 递推公式，dp[i] += dp[j - 1] * dp[i - j]; ，j-1 为j为头结点左子树节点数量，i-j 为以j为头结点右子树节点数量
3. 初始化 dp[0] = 1
4. 遍历i里面每一个数作为头结点的状态，用j来遍历。
5. 举例推导，1 1 2 5 14 42

```java
class Solution {
    public int numTrees(int n) {
        int[] dp = new int[n + 1];
        // 初始化0个节点和1个节点的情况
        dp[0] = 1;
        dp[1] = 1;
        for(int i = 2; i <=n; i++) {
            for (int j = 1; j <= i; j++) {
                // 二叉搜索树
                // 一共有i个节点 根节点j的左子树节点有j-1个 右子树节点有i-j个
                dp[i] += dp[j - 1] * dp[i - j]; 
            }
        }
        return dp[n];
    }
}
```



## 0-1背包理论

> 有n件物品和一个最多能背重量为w 的背包。第i件物品的重量是weight[i]，得到的价值是value[i] 。**每件物品只能用一次**，求解将哪些物品装入背包里物品价值总和最大。

🟢**例子：**背包最大重量为4。

物品为：

|       | 重量 | 价值 |
| ----- | ---- | ---- |
| 物品0 | 1    | 15   |
| 物品1 | 3    | 20   |
| 物品2 | 4    | 30   |

问背包能背的物品最大价值是多少？

### 二维dp数组01背包

1. dp\[i][j] 表示从下标为[0-i]的物品里任意取，放进容量为j的背包，价值总和最大是多少。

![image-20220701160249230](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220701160249230.png)

2. 递归公式：dp\[i][j] = max(dp\[i - 1][j], dp\[i - 1][j - weight[i]] + value[i])
   - **不放物品i**：当物品i的重量大于背包j的重量时，物品i无法放进背包中，所以被背包内的价值依然和前面相同
   - **放物品i**：dp\[i - 1][j - weight[i]] 为背包容量为j - weight[i]的时候不放物品i的最大价值，那么dp\[i - 1][j - weight[i]] + value[i] （物品i的价值），就是背包放物品i得到的最大价值
3. 初始化，dp\[i][0] = 0，状态转移方程需要dp\[0][j] 即背包容量小于编号0的重量，dp\[0][j]为0，否则就是物品0的价值。

![image-20220701161431652](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220701161431652.png)

4. 遍历顺序，先遍历物品再遍历背包重量。
5. 举例推导dp数组

![image-20220701161734535](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220701161734535.png)

**最终结果就是dp\[2][4]**

```java
public class bag {
    public static void main(String[] args) {
        int[] weight = {2, 3, 4};
        int[] value = {15, 20, 30};
        int bagSize = 4;
        testWeightBagProblem(weight, value, bagSize);
    }
    public static void testWeightBagProblem(int[] weight, int[] value, int bagSize) {
        int itemSize = weight.length; // 物品数量
        int initValue = 0; // 初始化价值
        int[][] dp = new int[itemSize][bagSize + 1]; // 容量 0-bagSize

        // 初始化 背包容量为0 价值都为0
        for (int i = 0; i < itemSize; i++) {
            dp[i][0] = initValue;
        }
        // 初始化 第一行物品重量小于背包容量就装入
        for (int j = weight[0]; j <= bagSize; j++) {
            dp[0][j] = value[0];
        }
        // 先遍历物品在遍历背包容量
        for (int i = 1; i < itemSize; i++) {
            for (int j = 1; j <= bagSize; j++) {
                // 背包容量小于当前物品重量 价值不变
                if (j < weight[i]) {
                    dp[i][j] = dp[i - 1][j];
                } else { // j是遍历的背包容量
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);
                }
            }
        }
        // 打印数组
        for (int i = 0; i < itemSize; i++) {
            for (int j = 0; j <= bagSize; j++) {
                System.out.print(dp[i][j] + " ");
            }
            System.out.println("\n");
        }

    }
}
```



### 一维dp数组01背包

使用一维滚动数组，**把dp[i - 1]层拷贝到dp[i]上**

1. 在一维dp数组中，dp[j]表示：容量为j的背包，所背的物品价值可以最大为dp[j]。
2. 递推公式，dp[j] = max(dp[j], dp[j - weight[i]] + value[i])
3. 初始化，么dp[0]是0，由于递推公式中是取最大，所以如果题目给的价值都是正整数那么非0下标都初始化为0
4. 遍历顺序，先遍历物品再遍历背包容量，**遍历背包要倒序遍历确保物品i只被放入一次**

> 从后往前循环，每次取得状态不会和之前取得状态重合，这样每种物品就只取一次了。**可以看第一行初始化的时候**
>
> 对于二维dp，dp\[i][j]都是通过上一层即dp\[i - 1][j]计算而来，本层的dp\[i][j]并不会被覆盖

5. 举例推导dp数组

> 物品0 遍历背包：0 15 15 15 15
>
> 物品1 遍历背包：0 15 15 20 35
>
> 物品2 遍历背包：0 15 15 20 35

```java
public class bag {
    public static void main(String[] args) {
        int[] weight = {1, 3, 4};
        int[] value = {15, 20, 30};
        int bagSize = 4;
        testWeightBagProblem2(weight, value, bagSize);
    }
    // 一维数组
    public static void testWeightBagProblem2(int[] weight, int[] value, int bagSize) {
        int itemSize = weight.length;
        int[] dp = new int[bagSize + 1]; // 已经初始化为0了
        // 先遍历物品再后序遍历背包容量
        for (int i = 0; i < itemSize; i++) {
            for (int j = bagSize; j >= weight[i]; j--) {
                dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i]);
            }
        }
        // 打印数组
        for (int i = 0; i <= bagSize; i++) {
            System.out.print(dp[i] + " ");
        }
    }
}
```



## 分割等和子集

[416. 分割等和子集 - 力扣（LeetCode）](https://leetcode.cn/problems/partition-equal-subset-sum/)

🟠只要找到集合里能够出现 sum / 2 的子集总和，就算是可以分割成两个相同元素和子集了。

**一个商品如果可以重复多次放入是完全背包，而只能放入一次是01背包**

> - 背包的体积为sum / 2
> - 背包要放入的商品（集合里的元素）重量为 元素的数值，价值也为元素的数值
> - 背包如果正好装满，说明找到了总和为 sum / 2 的子集。
> - 背包中每一个元素是不可重复放入。

1. dp[j]表示 背包总容量是j，最大可以凑成j的子集总和为dp[j]。
2. 递推公式：dp[j] = max(dp[j], dp[j - nums[i]] + nums[i])
3. 初始化，dp[0]为0，题目中 只包含正整数的非空数组，所以非0下标的元素初始化为0
4. 遍历顺序，外层正序for，内层倒序for
5. 举例推导dp数组，**如果dp[j] == j 说明，集合中的子集总和正好可以凑成总和j**

```java
class Solution {
    public boolean canPartition(int[] nums) {
        // 求总和
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }
        // 奇数不能平分
        if (sum % 2 == 1) return false;
        int target = sum / 2;
        int[] dp = new int[target + 1]; // 背包容量 0-target
        // 先遍历数再倒序遍历背包容量
        for (int i = 0; i < nums.length; i++) {
            for (int j = target; j >= nums[i]; j--) {
                dp[j] = Math.max(dp[j], dp[j - nums[i]] + nums[i]);
            }
        }
        return dp[target] == target;
    }
}
```



## 最后一块石头的重量 II

[1049. 最后一块石头的重量 II - 力扣（LeetCode）](https://leetcode.cn/problems/last-stone-weight-ii/)

🟠【分割等和子集】是求背包是否正好装满，本题求背包最多能够装多少。

**尽量让石头分成重量相同的两堆，相撞之后剩下的石头最小**

target = sum / 2 因为是向下取整，所以sum - dp[target] 一定是大于等于dp[target]的。

那么相撞之后剩下的最小石头重量就是 (sum - dp[target]) - dp[target]。

1. dp[j]表示容量为j的背包最多可以背dp[j]重量的石头
2. 递推公式，dp[j] = max(dp[j], dp[j - stones[i]] + stones[i])
3. dp数组初始化，target是最大重量的一半，都初始化为0
4. 遍历顺序，先遍历物品再倒序遍历背包容量
5. 举例推导dp数组

> [2,4,1,1] target = 4
>
> store[0] 遍历背包：0 0 2 2 2
>
> store[1] 遍历背包：0 0 2 2 4
>
> store[2] 遍历背包：0 0 2 3 4
>
> store[3] 遍历背包：0 0 2 3 4

```java
class Solution {
    public int lastStoneWeightII(int[] stones) {
        int sum = 0;
        // 求和
        for (int i = 0; i < stones.length; i++) {
            sum += stones[i];
        }
        int target = sum / 2;
        int[] dp = new int[target + 1];
        for (int i = 0; i < stones.length; i++) {
            for (int j = target; j >= stones[i]; j--) {
                dp[j] = Math.max(dp[j], dp[j - stones[i]] + stones[i]);
            }
        }
        return sum - 2 * dp[target];
    }
}
```



## 目标和

[494. 目标和 - 力扣（LeetCode）](https://leetcode.cn/problems/target-sum/)

> 假设加法的总和为x，那么减法对应的总和就是sum - x。
>
> 所以我们要求的是 x - (sum - x) = S
>
> x = (S + sum) / 2
>
> **此时问题就转化为，装满容量为x背包，有几种方法**。

🟠向下取整会导致无解，例如sum 是5，S是2； S的绝对值已经大于sum也无解

**组合问题**

1. dp[j] 表示：填满j（包括j）这么大容积的包，有dp[j]种方法
2. 递推公式，**dp[j] += dp[j - nums[i]]**，不考虑nums[i]的情况下，填满容量为j - nums[i]的背包，有dp[j - nums[i]]种方法。

> - 已经有一个1（nums[i]） 的话，有 dp[4]种方法 凑成 dp[5]。
> - 已经有一个2（nums[i]） 的话，有 dp[3]种方法 凑成 dp[5]。
> - 已经有一个3（nums[i]） 的话，有 dp[2]中方法 凑成 dp[5]
> - 已经有一个4（nums[i]） 的话，有 dp[1]中方法 凑成 dp[5]
> - 已经有一个5 （nums[i]）的话，有 dp[0]中方法 凑成 dp[5]
>
> 本题nums都是1
>
> 那么凑整dp[5]有多少方法呢，也就是把 所有的 dp[j - nums[i]] 累加起来。

3. dp数组初始化，dp[0] = 1，装满容量为0的背包，有1种方法，就是装0件物品。**dp[j]其他下标对应的数值应该初始化为0**
4. 遍历顺序，nums放在外循环，target在内循环，且内循环倒序。
5. 举例推导dp数组

![image-20220701195613705](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220701195613705.png)

```java
class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int sum = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
        }
        if ((target + sum) %2 == 1) return 0; // 向下取整无解
        int size = (target + sum) / 2;
        if (size < 0) size = -size;

        int[] dp = new int[size + 1];
        // 初始化
        dp[0] = 1;
        for (int i = 0; i < nums.length; i++) {
            for (int j = size; j >= nums[i]; j--) {
                dp[j] += dp[j - nums[i]];
            }
        } 
        return dp[size];
    }
}
```



## 一和零

[474. 一和零 - 力扣（LeetCode）](https://leetcode.cn/problems/ones-and-zeroes/)

**strs 数组里的元素就是物品，每个物品都是一个**

**而m 和 n相当于是一个背包，两个维度的背包**。

1. dp\[i][j]：最多有i个0和j个1的strs的最大子集的大小为dp\[i][j]。
2. 递推公式，dp\[i][j] = max(dp\[i][j], dp\[i - zeroNum][j - oneNum] + 1)，字符串的zeroNum和oneNum相当于物品的重量（weight[i]），字符串本身的个数相当于物品的价值（value[i]）。
3. 初始化，都为0
4. 遍历顺序，物品就是strs里的字符串，背包容量就是题目描述中的m和n，先遍历物品再倒序遍历背包容量
5. 举例推导

![image-20220701203546402](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220701203546402.png)

🟠关于递推公式，当前最多能有i个0和j个1，减去本轮str的0和1剩下的容量能容纳str的个数+1

```java
class Solution {
    public int findMaxForm(String[] strs, int m, int n) {
        int[][] dp = new int[m + 1][n + 1]; // i个0和j个1时的最大子集
        int oneNum, zeroNum;
        for (String str : strs) {
            // 遍历每个字符串
            oneNum = 0;
            zeroNum = 0;
            for (char ch : str.toCharArray()) {
                if (ch == '0') {
                    zeroNum++;
                } else {
                    oneNum++;
                }
            }
            // 倒序遍历容量
            for (int i = m; i >= zeroNum; i--) {
                for (int j = n; j >= oneNum; j--) {
                    dp[i][j] = Math.max(dp[i][j], dp[i - zeroNum][j - oneNum] + 1);
                }
            }
        }
        return dp[m][n];
    }
}
```



## 完全背包理论

> 有N件物品和一个最多能背重量为W的背包。第i件物品的重量是weight[i]，得到的价值是value[i] 。**每件物品都有无限个（也就是可以放入背包多次）**，求解将哪些物品装入背包里物品价值总和最大。

🟢背包最大重量为4。

物品为：

|       | 重量 | 价值 |
| ----- | ---- | ---- |
| 物品0 | 1    | 15   |
| 物品1 | 3    | 20   |
| 物品2 | 4    | 30   |

🟠**01背包和完全背包唯一不同就是体现在遍历顺序上**

01背包内嵌的循环是从大到小遍历，为了保证每个物品仅被添加一次。

```java
for(int i = 0; i < weight.size(); i++) { // 遍历物品
    for(int j = bagWeight; j >= weight[i]; j--) { // 遍历背包容量
        dp[j] = max(dp[j], dp[j - weight[i]] + value[i]);
    }
}
```

完全背包的物品是可以添加多次的，所以要从小到大去遍历

```java
// 先遍历物品，再遍历背包
for(int i = 0; i < weight.size(); i++) { // 遍历物品
    for(int j = weight[i]; j <= bagWeight ; j++) { // 遍历背包容量
        dp[j] = max(dp[j], dp[j - weight[i]] + value[i]);
    }
}
```

**在完全背包中，对于一维dp数组来说，其实两个for循环嵌套顺序同样无所谓**

```java
//先遍历物品，再遍历背包
private static void testCompletePack(){
    int[] weight = {1, 3, 4};
    int[] value = {15, 20, 30};
    int bagWeight = 4;
    int[] dp = new int[bagWeight + 1];
    for (int i = 0; i < weight.length; i++){ // 遍历物品
        for (int j = weight[i]; j <= bagWeight; j++){ // 遍历背包容量
            dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i]);
        }
    }
    for (int maxValue : dp){
        System.out.println(maxValue + "   ");
    }
}
```



## 零钱兑换 II

[518. 零钱兑换 II - 力扣（LeetCode）](https://leetcode.cn/problems/coin-change-2/)

凑成总金额的硬币组合数，不排序。

1. dp[j]：凑成总金额j的货币组合数为dp[j]
2. 递推公式，dp[j] += dp[j - coins[i]]
3. dp数组初始化，dp[0] = 1，下标非0的dp[j]初始化为0，这样累计加dp[j - coins[i]]的时候才不会影响真正的dp[j]
4. **遍历顺序，先遍历物品再遍历背包容量——组合，先遍历背包容量再遍历物品——排列**

```java
for (int i = 0; i < coins.size(); i++) { // 遍历物品
    for (int j = coins[i]; j <= amount; j++) { // 遍历背包容量
        dp[j] += dp[j - coins[i]];
    }
}
```

```java
for (int j = 0; j <= amount; j++) { // 遍历背包容量
    for (int i = 0; i < coins.size(); i++) { // 遍历物品
        if (j - coins[i] >= 0) dp[j] += dp[j - coins[i]];
    }
}
```

![image-20220701233245541](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220701233245541.png)

```java
class Solution {
    public int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1]; // 背包容量 0-amount
        dp[0] = 1;
        for (int i = 0; i < coins.length; i++) {
            // 先遍历硬币 依次加入
            for (int j = coins[i]; j <= amount; j++) {
                // 再遍历背包容量 组合没有顺序
                dp[j] += dp[j - coins[i]];
            }
        }
        return dp[amount];
    }
}
```



## 组合总和 Ⅳ

[377. 组合总和 Ⅳ - 力扣（LeetCode）](https://leetcode.cn/problems/combination-sum-iv/)

1. dp[i]: 凑成目标正整数为i的排列个数为dp[i]
2. 递推公式，dp[i] += dp[i - nums[j]]
3. dp[0]要初始化为1，非0下标的dp[i]应该初始为0
4. 遍历顺序，先遍历背包再遍历物品
5. 举例推导dp数组

![image-20220702102025349](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220702102025349.png)

```java
class Solution {
    public int combinationSum4(int[] nums, int target) {
        int[] dp = new int[target + 1];
        dp[0] = 1;
        for (int i = 0; i <= target; i++) {
            // 先遍历背包再遍历物品
            for (int j = 0; j < nums.length; j++) {
                if (i >= nums[j]) {
                    dp[i] += dp[i - nums[j]];
                }
            }
        }
        return dp[target];
    }
}
```



## 零钱兑换

[322. 零钱兑换 - 力扣（LeetCode）](https://leetcode.cn/problems/coin-change/)

1. dp[j]：凑足总额为j所需钱币的最少个数为dp[j]
2. 递推公式，dp[j] = min(dp[j - coins[i]] + 1, dp[j])
3. 凑足总金额为0所需钱币的个数一定是0，那么dp[0] = 0，因为取最小所以下标非0的元素都是应该是最大值。
4. 遍历顺序，排列组合无区别
5. 举例推导dp数组

> 以输入：coins = [1, 2, 5], amount = 5为例
>
> 0 1 1 2 2 1

```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        // 初始化
        for (int i = 0; i < dp.length; i++) {
            dp[i] = Integer.MAX_VALUE;
        }
        dp[0] = 0; // 金额为0时需要硬币数目为0
        // 先遍历硬币再遍历背包
        for (int i = 0; i < coins.length; i++) {
            for (int j = coins[i]; j <= amount; j++) {
                // 只有不是初始最大值才有选择的必要
                if (dp[j - coins[i]] != Integer.MAX_VALUE) {
                    dp[j] = Math.min(dp[j], dp[j - coins[i]] + 1);
                }
            }
        }
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }
}
```



## 完全平方数

[279. 完全平方数 - 力扣（LeetCode）](https://leetcode.cn/problems/perfect-squares/)

**先遍历物品再遍历背包**

```java
class Solution {
    public int numSquares(int n) {
        int[] dp = new int[n + 1];
        for (int i = 0; i < dp.length; i++) {
            dp[i] = Integer.MAX_VALUE;
        }
        dp[0] = 0;
        // 先遍历物品再遍历背包容量
        for (int i = 1; i * i <= n; i++) {
            for (int j = i * i; j <= n; j++) {
                if (dp[j - i * i] != max) {
                    dp[j] = Math.min(dp[j], dp[j - i * i] + 1);
                }
            }
        }
        return dp[n];
    }
}
```

**先遍历背包再遍历物品**

```java
class Solution {
    public int numSquares(int n) {
        int[] dp = new int[n + 1];
        for (int i = 0; i < dp.length; i++) {
            dp[i] = Integer.MAX_VALUE;
        }
        dp[0] = 0;
        // 先遍历背包容量再遍历物品
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j * j <= i; j++) {
                dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
            }
        }
        return dp[n];
    }
}
```



## 单词拆分

[139. 单词拆分 - 力扣（LeetCode）](https://leetcode.cn/problems/word-break/)

单词就是物品，字符串s就是背包，单词能否组成字符串s，就是问物品能不能把背包装满。

拆分时可以重复使用字典中的单词，说明就是一个完全背包

1. dp[i] : 字符串长度为i的话，dp[i]为true，表示可以拆分为一个或多个在字典中出现的单词
2. 递推公式，如果确定dp[j] 是true，且 [j, i] 这个区间的子串出现在字典里，那么dp[i]一定是true。（j < i ）。
3. dp[0]一定要为true
4. 遍历顺序，组合排序没有区别
5. 举例推导

![image-20220702170244942](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220702170244942.png)

🟠遍历物品表现为检索字符串的每一段。

```java
class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        boolean[] valid = new boolean[s.length() + 1];
        // 初始化
        valid[0] = true;
        // 先遍历背包容量再遍历物品
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (wordDict.contains(s.substring(j, i)) && valid[j]) {
                    valid[i] = true;
                }
            }
        }
        return valid[s.length()];
    }
}
```



## 打家劫舍

[198. 打家劫舍 - 力扣（LeetCode）](https://leetcode.cn/problems/house-robber/)

1. dp[i]：考虑下标i（包括i）以内的房屋，最多可以偷窃的金额为dp[i]。
2. 递推公式，**dp[i] = max(dp[i - 2] + nums[i], dp[i - 1])** 只考虑单边
   - 如果偷第i房间，那么dp[i] = dp[i - 2] + nums[i]
   - 如果不偷第i房间，那么dp[i] = dp[i - 1]
3. dp数组初始化，dp[0] 一定是 nums[0]，dp[1]就是nums[0]和nums[1]的最大值
4. 遍历顺序，从前到后
5. 举例推导dp数组

> 输入[2,7,9,3,1]为例。
>
> 2 7 11 11 11

```java
class Solution {
    public int rob(int[] nums) {
        // 如果只有一户
        if (nums.length == 1) {
            return nums[0];
        }
        int[] dp = new int[nums.length];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);
        for(int i = 2; i < nums.length; i++) {
            // 要么偷要么不投
            dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
        }
        // 返回考虑所有房屋的情况下能偷的最高金额
        return dp[nums.length - 1];
    }
}
```



## 打家劫舍 II

[213. 打家劫舍 II - 力扣（LeetCode）](https://leetcode.cn/problems/house-robber-ii/)

**变成了环装的情况**

三种情况：

1. ~~不包含首尾元素~~
2. 包含首元素，不包含尾元素
3. 包含尾元素，不包含首元素

```java
class Solution {
    public int rob(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        int len = nums.length;
        // 只有一户的情况
        if (len == 1) {
            return nums[0];
        }
        // 有首无尾的情况
        int head = myRob(nums, 0, len - 1);
        // 有尾无首的情况
        int tail = myRob(nums, 1, len);
        // 返回最大
        return Math.max(head, tail);
    }
    int myRob(int[] nums, int start, int end) {
        int a = 0, b = 0, c = 0;
        for (int i = start; i < end; i++) {
            // 只需要长度为3的窗口向后移动
            c = Math.max(b, a + nums[i]);
            a = b;
            b = c;
        }
        return c;
    }
}
```



## 打家劫舍 III

[337. 打家劫舍 III - 力扣（LeetCode）](https://leetcode.cn/problems/house-robber-iii/)

🟠如果抢了当前节点，两个孩子就不能动，如果没抢当前节点，就可以考虑抢左右孩子

-   前序遍历（递归法，迭代法）中左右
-   中序遍历（递归法，迭代法）左中右
-   **后序遍历（递归法，迭代法）左右中**

### 记忆化递推

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public int rob(TreeNode root) {
        // 记录状态
        Map<TreeNode, Integer> map = new HashMap<>();
        return myRob(root, map);
        
    }
    private int myRob(TreeNode root, Map<TreeNode, Integer> map) {
        if (root == null) {
            return 0;
        }
        // 偷父节点
        if (map.containsKey(root)) { // 如果已经记录过直接返回
            return map.get(root);
        }
        int val1 = root.val;
        if (root.left != null) {
            val1 += myRob(root.left.left, map) + myRob(root.left.right, map);
        }
        if (root.right != null) {
            val1 += myRob(root.right.left, map) + myRob(root.right.right, map);
        }
        // 偷子节点
        int val2 = myRob(root.left, map) + myRob(root.right, map);
        int res = Math.max(val1, val2);
        // 记录
        map.put(root, res);

        return res;
    }
}
```

**对一个节点 偷与不偷得到的最大金钱都没有做记录，而是需要实时计算**

### 动态规划

使用一个长度为2的数组，记录当前节点**偷与不偷所得到的的最大金钱**

1. 确定递归函数的参数和返回值，参数为当前节点，返回dp数组
2. 终止条件，遇到空节点返回
3. 遍历顺序，**后序遍历**，通过递归函数的返回值来做下一步计算
4. 单层递归的逻辑
   - 如果是偷当前节点，那么左右孩子就不能偷，**val1 = cur->val + left[0] + right[0]**
   - 如果不偷当前节点，那么左右孩子就可以偷，取最大，**val2 = max(left[0], left[1]) + max(right[0], right[1])**

![image-20220702175708549](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220702175708549.png)

```java
class Solution {
    public int rob(TreeNode root) {
        int[] res = myRob(root);
        return Math.max(res[0], res[1]);
    }
    private int[] myRob(TreeNode root) {
        int[] res = new int[2];
        // 终止条件
        if (root == null) {
            return res;
        }
        // 左右子树
        int[] left = myRob(root.left);
        int[] right = myRob(root.right);

        res[0] = Math.max(left[0], left[1]) + Math.max(right[0], right[1]); // 偷子节点
        res[1] = root.val + left[0] + right[0]; // 偷父节点
        return res;
    }
}
```



## 买卖股票的最佳时机

🟢**贪心**

```java
class Solution {
    public int maxProfit(int[] prices) {
        // 取左边最小 右边最大
        int left = Integer.MAX_VALUE;
        int res = 0;
        for (int i = 0; i < prices.length; i++) {
            left = Math.min(left, prices[i]);
            res = Math.max(res, prices[i] - left);
        }
        return res;
    }
}
```

**🟠动态规划**

1. dp\[i][0] 表示第i天持有股票所得最多现金，一开始现金是0，那么加入第i天买入股票现金就是 -prices[i]，dp\[i][1] 表示第i天不持有股票所得最多现金
2. 递推公式，
   - 第i天持有股票即dp\[i][0]，**dp\[i][0] = max(dp\[i - 1][0], -prices[i])**
   - 第i天不持有股票即dp\[i][1]，**dp\[i][1] = max(dp\[i - 1][1], prices[i] + dp\[i - 1][0])**
3. 数组初始化，dp\[0][0]表示第0天持有股票，dp\[0][1]表示第0天不持有股票
   dp\[0][0] -= prices[0]，dp\[0][1] = 0
4. 遍历顺序，从前向后
5. 举例推导dp数组

![image-20220703113721019](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220703113721019.png)

**不持有股票状态所得金钱一定比持有股票状态得到的多**

```java
class Solution {
    public int maxProfit(int[] prices) {
        // dp[i][0]表示第i天持有股票的最大收益
        // dp[i][1]表示第i天不持有股票的最大收益
        int[][] dp = new int[prices.length][2];
        int result = 0;
        dp[0][0] = -prices[0];
        dp[0][1] = 0;
        for (int i = 1; i < prices.length; i++) {
            dp[i][0] = Math.max(dp[i - 1][0], -prices[i]); // 买入价格低的
            dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] + prices[i]); // 昨天已卖出或今天卖出
        }
        return dp[prices.length - 1][1];
    }
}
```



## 买卖股票的最佳时机II

[122. 买卖股票的最佳时机 II - 力扣（LeetCode）](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)

可以多次交易。

**贪心**

```java
class Solution {
    public int maxProfit(int[] prices) {
        // 只取最大利润
        int res = 0;
        for (int i = 1; i < prices.length; i++) {
            res += Math.max(0, prices[i] - prices[i - 1]);
        }
        return res;
    }
}
```

**动态规划**

🟠第i天买入股票所得现金是昨天卖出减去今天买入的价格，dp\[i - 1][1] - prices[i]

使用滚动数组优化空间

```java
class Solution {
    public int maxProfit(int[] prices) {
        int[] dp = new int[2];
        dp[0] = -prices[0]; // 当天持有股票的收益
        dp[1] = 0; // 当天卖出股票的收益
        for (int i = 1; i < prices.length; i++) {
            dp[0] = Math.max(dp[0], dp[1] - prices[i]); // 昨天买入或今天买入
            dp[1] = Math.max(dp[1], dp[0] + prices[i]); // 昨天卖出或今天卖出
        }
        return dp[1];
    }
}
```



## 买卖股票的最佳时机III

[123. 买卖股票的最佳时机 III - 力扣（LeetCode）](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/)

> 至多买卖两次，这意味着可以买卖一次，可以买卖两次，也可以不买卖

1. 一天一共就有五个状态
   没有操作、第一次买入、第一次卖出、第二次买入、第二次卖出
   dp\[i][j]中 i表示第i天，j为 [0 - 4] 五个状态，dp\[i][j]表示第i天状态j所剩最大现金
2. 递推公式
   - 当天买入或没有操作，**dp\[i][1] = max(dp\[i-1][0] - prices[i], dp\[i - 1][1])**
   - 卖或已经昨天卖了，**dp\[i][2] = max(dp\[i - 1][1] + prices[i], dp\[i - 1][2])**
   - **dp\[i][3] = max(dp\[i - 1][3], dp\[i - 1][2] - prices[i])**
   - **dp\[i][4] = max(dp\[i - 1][4], dp\[i - 1][3] + prices[i])**
3. 初始化数组，不操作dp\[0][0] = 0，第一次买入dp\[0][1] = -prices[0]，第一次卖出dp\[0][2] = 0，
   第二次买入相当于第一次买入又卖出，dp\[0][3] = -prices[0]，dp\[0][4] = 0
4. 遍历顺序，从前向后
5. 举例推导dp数组

![image-20220703121951677](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220703121951677.png)

```java
class Solution {
    public int maxProfit(int[] prices) {
        int[][] dp = new int[prices.length][5];
        dp[0][1] = -prices[0];
        dp[0][3] = -prices[0];
        for (int i = 1; i < prices.length; i++) {
            dp[i][0] = dp[i - 1][0]; // 没有操作
            dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]); // 第一次买入
            dp[i][2] = Math.max(dp[i - 1][2], dp[i - 1][1] + prices[i]); // 第一次卖出
            dp[i][3] = Math.max(dp[i - 1][3], dp[i - 1][2] - prices[i]); // 第二次买入
            dp[i][4] = Math.max(dp[i - 1][4], dp[i - 1][3] + prices[i]); // 第二次卖出
        }
        return dp[prices.length - 1][4];
    }
}
```



## 买卖股票的最佳时机IV

[188. 买卖股票的最佳时机 IV - 力扣（LeetCode）](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/)

🟠使用二维数组 dp\[i][j] ：第i天的状态为j，所剩下的最大现金是dp\[i][j]，**奇数买入，偶数卖出**

```java
class Solution {
    public int maxProfit(int k, int[] prices) {
        if (prices.length == 0) return 0;
        int[][] dp = new int[prices.length][k * 2 + 1];
        // 初始化数组
        for (int i = 1; i < k*2; i += 2) {
            dp[0][i] = -prices[0];
        }
        for (int i = 1; i < prices.length; i++) {
            for (int j = 0; j < k*2 - 1; j += 2) {
                dp[i][j + 1] = Math.max(dp[i - 1][j + 1], dp[i - 1][j] - prices[i]); // 买入之后的当天结余
                dp[i][j + 2] = Math.max(dp[i - 1][j + 2], dp[i - 1][j + 1] + prices[i]); // 卖出之后的当天结余
            }
        }
        return dp[prices.length - 1][k * 2];
    }
}
```



## 最佳买卖股票时机含冷冻期

[309. 最佳买卖股票时机含冷冻期 - 力扣（LeetCode）](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

**卖出股票后，你无法在第二天买入股票 (即冷冻期为 1 天)。**

🟠四种状态：

- 状态一：买入股票状态，今天或之前买了
- 状态二：过了冷冻期，保持卖出状态
- 状态三：今天卖出股票
- 状态四：今天为冷冻期

1. 二维dp数组就是四个状态
2. 递推公式
   - 达到状态一的操作，昨天就是买入状态或者今天买入（昨天有两种情况），
     **dp\[i][0] = max(dp\[i - 1][0], max(dp\[i - 1][3], dp\[i - 1][1]) - prices[i])**
   - 达到状态二的操作，昨天就是状态二或者昨天还在冷冻期，**dp\[i][1] = max(dp\[i - 1][1], dp\[i - 1][3])**
   - 达到状态三的操作，昨天是买入状态，**dp\[i][2] = dp\[i - 1][0] + prices[i]**
   - 达到状态四的操作，昨天卖出了股票 **dp\[i][3] = dp\[i - 1][2]**
3. 数组初始化，dp\[0][0] = -prices[0]，买入股票所剩现金为负数，其余都为0
4. 从前向后遍历
5. 举例推导dp数组

![image-20220703170159909](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220703170159909.png)

🟠Math.max只能有两个参数

```java
class Solution {
    public int maxProfit(int[] prices) {
        /**
        四种状态
        1. 买入状态
        2. 过了冷冻期保持卖出状态(明天可买)
        3. 今天卖出状态
        4. 今天冷冻期状态(明天可买)
         */
         int n = prices.length;
        int[][] dp = new int[n][4];
        dp[0][0] = -prices[0];
        for (int i = 1; i < n; i++) {
            // 昨天就买入状态 或昨天就可买状态 或昨天冷冻期
            dp[i][0] = Math.max(dp[i - 1][0], Math.max(dp[i - 1][1], dp[i - 1][3]) - prices[i]); 
            dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][3]); // 昨天冷冻期 或者昨天就可买状态
            dp[i][2] = dp[i - 1][0] + prices[i]; // 今天卖出 昨天处于买入状态
            dp[i][3] = dp[i - 1][2]; // 今天冷冻期 昨天卖出
        }
        // 只比较卖出了之后的状态
        return Math.max(dp[n - 1][1], Math.max(dp[n - 1][2], dp[n - 1][3]));
    }
}
```



## 买卖股票的最佳时机含手续费

[714. 买卖股票的最佳时机含手续费 - 力扣（LeetCode）](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)

只需要在计算卖出操作的时候减去手续费就可以了

🟠递推公式：

1. 持有或者昨天卖出，dp\[i][0] = max(dp\[i - 1][0], dp\[i - 1][1] - prices[i])
2. 已经卖出或者今天卖出，dp[i][1] = max(dp\[i - 1][1], dp\[i - 1][0] + prices[i] - fee)

```java
class Solution {
    public int maxProfit(int[] prices, int fee) {
        int[] dp = new int[2];
        dp[0] = -prices[0]; // 当天买入的结余
        dp[1] = 0; // 当天卖出的结余

        for (int i = 1; i < prices.length; i++) {
            dp[0] = Math.max(dp[0], dp[1] - prices[i]); // 不卖或昨天卖了今天买
            dp[1] = Math.max(dp[1], dp[0] + prices[i] - fee); // 昨天就卖了 或今天卖
        }
        return dp[1];
    }
}
```

---

**贪心算法**

🟠多次计算收益相当于在盈利区间一直持有，此时返还中间过程的手续费。

```java
class Solution {
    public int maxProfit(int[] prices, int fee) {
        int res = 0;
        int minPrice = prices[0]; // 记录最低价格
        for (int i = 1; i < prices.length; i++) {
            // 重新记录最低价格
            if (minPrice > prices[i]) {
                minPrice = prices[i];
            }
            // 买入太贵 卖出亏本 不交易
            if (minPrice <= prices[i] && prices[i] <= minPrice + fee) {
                continue;
            }
            // 可以卖出
            if (minPrice + fee < prices[i]) {
                res += prices[i] - minPrice - fee; // 多次计算收益
                // 如果后面还有盈利空间 不如一直持有 此时返还手续费
                minPrice = prices[i] - fee;
            }
        }
        return res;
    }
}
```





## 最长递增子序列

[300. 最长递增子序列 - 力扣（LeetCode）](https://leetcode.cn/problems/longest-increasing-subsequence/)

1. dp[i]表示i之前包括i的以nums[i]结尾最长上升子序列的长度
2. 状态转移方程，**if (nums[i] > nums[j]) dp[i] = max(dp[i], dp[j] + 1)**
3. 初始化，起始大小至少为1
4. 遍历顺序，从前向后，遍历i的循环在外层，遍历j的循环在内层。**过程中取最长的子序列**
5. 举例推导dp数组。

![image-20220712221226687](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220712221226687.png)

```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }

        int n = nums.length;
        int[] dp = new int[n];
        // 初始化数组
        for (int i = 0; i < n; i++) {
            dp[i] = 1;
        }
        int result = 1;

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[i] > nums[j]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1); // 对于每轮i是多次递增的
                }
            }
            // 取最长的子序列
            if (dp[i] > result) {
                result = dp[i];
            }
        }
        return result;
    }
}
```



## 最长连续递增序列

[674. 最长连续递增序列 - 力扣（LeetCode）](https://leetcode.cn/problems/longest-continuous-increasing-subsequence/)

🟢相比于上一道题只需要判断当前元素和前一个元素就可以。

```java
class Solution {
    public int findLengthOfLCIS(int[] nums) {
        if (nums.length == 0) {
            return 0;
        }

        int n = nums.length;
        int[] dp = new int[n];
        // 初始化数组
        for (int i = 0; i < n; i++) {
            dp[i] = 1;
        }
        int result = 1;

        // 必须是连续的
        for (int i = 1; i < n; i++) {
            if (nums[i] > nums[i - 1]) {
                dp[i] = dp[i - 1] + 1;
            }
            if (dp[i] > result) {
                result = dp[i];
            }
        }
        return result;
    }
}
```



## 最长重复子数组

[718. 最长重复子数组 - 力扣（LeetCode）](https://leetcode.cn/problems/maximum-length-of-repeated-subarray/)

1. dp\[i][j] ：以下标i - 1为结尾的A，和以下标j - 1为结尾的B，最长重复子数组长度为dp\[i][j]。
2. 递推公式，当A[i - 1] 和B[j - 1]相等的时候，dp\[i][j] = dp\[i - 1][j - 1] + 1
3. dp\[i][0] 和dp\[0][j]其实都是没有意义的，初始化为0
4. 遍历顺序，外层遍历A，内层遍历B，**记录最大值**
5. 举例推导dp数组

![image-20220712221251648](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220712221251648.png)

🟠注意数组的初始化

```java
class Solution {
    public int findLength(int[] nums1, int[] nums2) {
        int n1 = nums1.length;
        int n2 = nums2.length;
        if (n1 == 0 || n2 == 0) {
            return 0;
        }

        int[][] dp = new int[n1 + 1][n2 + 1];
        // 初始化
        for (int i = 0; i < n1; i++) {
            dp[i][0] = 0;
        }
        for (int j = 0; j < n2; j++) {
            dp[0][j] = 0;
        }

        int result = 0;
        for (int i = 1; i <= n1; i++) {
            for (int j = 1; j <= n2; j++) {
                if (nums1[i - 1] == nums2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                }
                // 记录最大值
                if (dp[i][j] > result) {
                    result = dp[i][j];
                }
            }
            
        }

        return result;
    }
}
```

**用一维滚动数组实现**

🟠注意初始化数组长度是n+1；内层从后往前遍历；两个元素不相等的时候用0覆盖

```java
class Solution {
    public int findLength(int[] nums1, int[] nums2) {
        int n1 = nums1.length;
        int n2 = nums2.length;
        if (n1 == 0 || n2 == 0) {
            return 0;
        }
        int result = 0;

        int[] dp = new int[n2 + 1];
        // 滚动数组
        for (int i = 1; i <= n1; i++) {
            for (int j = n2; j > 0; j--) { // 从后向前遍历避免重复覆盖
                if (nums1[i - 1] == nums2[j - 1]) {
                    dp[j] = dp[j - 1] + 1;
                } else { // 不相等的时候用0覆盖
                    dp[j] = 0;
                }
                if (dp[j] > result) result = dp[j];
            }
        }

        return result;
    }
}
```





## 最长公共子序列

[1143. 最长公共子序列 - 力扣（LeetCode）](https://leetcode.cn/problems/longest-common-subsequence/)

![image-20220712233631906](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220712233631906.png)

🟠和上一题不同点在于不要求连续。子串不相等的情况下取任意串退一位的最大值。

**char char1 = text1.charAt(i - 1);**

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int n1 = text1.length();
        int n2 = text2.length();
        int[][] dp = new int[n1 + 1][n2 + 1];
        // 默认初始化都为0

        for (int i = 1; i <= n1; i++) {
            char char1 = text1.charAt(i - 1);
            for (int j = 1; j <= n2; j++) {
                char char2 = text2.charAt(j - 1);
                if (char1 == char2) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    // 不等的情况取前一状态的最大值
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        // 最长序列一定是右下角两个完整字符串的相交
        return dp[n1][n2];
    }
}
```



## 不相交的线

[1035. 不相交的线 - 力扣（LeetCode）](https://leetcode.cn/problems/uncrossed-lines/)

> 在字符串A中找到一个与字符串B相同的子序列，且这个子序列不能改变相对顺序，只要相对顺序不改变，链接相同数字的直线就不会相交。

**求两个字符串的最长公共子序列。**

```java
class Solution {
    public int maxUncrossedLines(int[] nums1, int[] nums2) {
        int n1 = nums1.length;
        int n2 = nums2.length;
        int[][] dp = new int[n1 + 1][n2 + 1];

        for (int i = 1; i <= n1; i++) {
            for (int j = 1; j <= n2; j++) {
                if (nums1[i - 1] == nums2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    // 取任意一个串后退一步的最大值
                    dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j]);
                }                
            }
        }
        // 最长子序列个数是两个完整串的情况
        return dp[n1][n2];
    }
    
}
```



## 最大子序列和

[53. 最大子数组和 - 力扣（LeetCode）](https://leetcode.cn/problems/maximum-subarray/)

🟢贪心算法：在和大于0的序列记录最大值

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int sum = 0;
        int result = Integer.MIN_VALUE;

        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
            if (sum > result) {
                result = sum;
            }
            // 只记录和大于0的序列 小于零记录新的开头
            if (sum < 0) {
                sum = 0;
            }
        }
        return result;
    }
}
```

**🟠动态规划**

1. dp[i]：包括下标i之前的最大连续子序列和为dp[i]。
2. 递推公式，两种情况，继续加入序列或者重新记录的情况，**dp[i] = max(dp[i - 1] + nums[i], nums[i])**
3. **数组初始化，dp[0] = nums[0]**
4. 遍历顺序，从前向后。
5. 举例推导dp数组

![image-20220713104443688](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220713104443688.png)

**需要记录最大的结果。**

```java
class Solution {
    public int maxSubArray(int[] nums) {
        if(nums.length == 0) {
            return 0;
        }
        int[] dp = new int[nums.length];
        // 初始化
        dp[0] = nums[0];
        int result = nums[0];


        for(int i = 1; i < nums.length; i++) {
            dp[i] = Math.max(dp[i - 1] + nums[i], nums[i]);
            if (dp[i] > result) {
                result = dp[i];
            }
        }
        return result;
    }
}
```



## 判断子序列

[392. 判断子序列 - 力扣（LeetCode）](https://leetcode.cn/problems/is-subsequence/)

1. dp\[i][j] 表示以下标i-1为结尾的字符串s，和以下标j-1为结尾的字符串t，相同子序列的长度为dp\[i][j]。

2. 递推公式
   if (s[i - 1] == t[j - 1])，那么dp\[i][j] = dp\[i - 1][j - 1] + 1 找到了相同的子序列

   if (s[i - 1] != t[j - 1])，此时相当于t要删除元素，t如果把当前元素t[j - 1]删除，那么dp\[i][j] 的数值就是 看s[i - 1]与 t[j - 2]的比较结果了，即：dp\[i][j] = dp\[i][j - 1]

3. 数组初始化，dp\[0][0]和dp\[i][0] 初始化为0

4. 遍历顺序，从上到下、从左到右

5. 举例推导dp数组

![image-20220713110634677](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220713110634677.png)

![image-20220713110649838](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220713110649838.png)

🟠如果右下角dp\[i][j]与字符串s的长度相同，说明s就是t最长子序列。

**s.charAt(i - 1)，不能直接像数组一样由下标从String中访问字符。**

```java
class Solution {
    public boolean isSubsequence(String s, String t) {
        int n1 = s.length();
        int n2 = t.length();
        int[][] dp = new int[n1 + 1][n2 + 1];
        // 都已经初始化为0

        // 判断s是否为t的子序列 s为纵坐标 t为横坐标
        for (int i = 1; i <= n1; i++) {
            for (int j = 1; j <= n2; j++) {
                if (s.charAt(i - 1) == t.charAt(j - 1) ) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    // 不相等时候 t后退一步 比较结果s[i - 1]与t[j - 2]
                    dp[i][j] = dp[i][j - 1];
                }
            }
        }

        return dp[n1][n2] == s.length();
        
    }
}
```



## 不同的子序列

[115. 不同的子序列 - 力扣（LeetCode）](https://leetcode.cn/problems/distinct-subsequences/)

1. dp\[i][j]：以i-1为结尾的s子序列中出现以j-1为结尾的t的个数为dp\[i][j]。

2. 递推公式
   s[i - 1] 与 t[j - 1]相等 举例：s->bagg，t->bag

   - 如果用s[i - 1]来匹配个数就位dp\[i - 1][j - 1]
   - 如果不用s[i - 1]来匹配个数就为dp\[i - 1][j]

   s[i - 1] 与 t[j - 1]不相等，不用s[i-1]来匹配，dp\[i][j] = dp\[i - 1][j]

3. dp数组初始化，dp\[i][0] 表示：以i-1为结尾的s可以随便删除元素，出现空字符串的个数，**一定是1**
   dp\[0][j]：空字符串s可以随便删除元素，出现以j-1为结尾的字符串t的个数，**一定是0**
   dp\[0][0]应该是1，空字符串s，可以删除0个元素，变成空字符串t。

4. 遍历顺序，dp\[i][j]根据左上方和正上方推导出来。

5. 举例推导dp数组

![image-20220713134835389](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220713134835389.png)

🟠注意初始化dp\[0][0] = 1

```java
class Solution {
    public int numDistinct(String s, String t) {
        int n1 = s.length();
        int n2 = t.length();
        int[][] dp = new int[n1 + 1][n2 + 1];

        // 初始化数组
        for (int i = 0; i <= n1; i++) {
            dp[i][0] = 1;
        }
        for (int j = 1; j <= n2; j++) {
            dp[0][j] = 0;
        }
        for (int i = 1; i <= n1; i++) {
            for (int j = 1; j <= n2; j++) {
                if (s.charAt(i - 1) == t.charAt(j  - 1)) { // 是否用s[i - 1]来匹配 两种情况
                    dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }

        return dp[n1][n2];
    }
}
```



## 两个字符串的删除操作

[583. 两个字符串的删除操作 - 力扣（LeetCode）](https://leetcode.cn/problems/delete-operation-for-two-strings/)

**动态规划一：两个字符串相互删除**

1. dp\[i][j]：以i-1为结尾的字符串word1，和以j-1位结尾的字符串word2，想要达到相等，所需要删除元素的最少次数。

2. 递推公式，**取最小值**，dp\[i][j] = min({dp\[i - 1][j - 1] + 2, dp\[i - 1][j] + 1, dp\[i][j - 1] + 1});
   当word1[i - 1] 与 word2[j - 1]相同的时候，dp\[i][j] = dp\[i - 1][j - 1]; **相等不用删**

   不相等时候：

   - 删word1[i - 1]，最少操作次数为dp\[i - 1][j] + 1
   - 删word2[j - 1]，最少操作次数为dp\[i][j - 1] + 1
   - 同时删word1[i - 1]和word2[j - 1]，操作的最少次数为dp\[i - 1][j - 1] + 2

3. 数组初始化
   dp\[i][0]：word2为空字符串，以i-1为结尾的字符串word1要删除多少个元素，才能和word2相同呢，很明显**dp\[i][0] = i**。
   **dp\[0][j] = j**

4. 遍历顺序，由左上方、上方、左方推出

5. 举例推导dp数组

![image-20220713142506389](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220713142506389.png)

```java
class Solution {
    public int minDistance(String word1, String word2) {
        int n1 = word1.length();
        int n2 = word2.length();
        int[][] dp = new int[n1 + 1][n2 + 1]; // 想要达到相等，所需要删除元素的最少次数

        // 初始化数组
        for (int i = 0; i <= n1; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n2; j++) {
            dp[0][j] = j;
        }
        for (int i = 1; i <= n1; i++) {
            for (int j = 1; j <= n2; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    // 相等不用再删
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    // 由三个方向推导出的最小值
                    dp[i][j] = Math.min(dp[i - 1][j - 1] + 2, Math.min(dp[i][j - 1] + 1, dp[i - 1][j] + 1));
                }
            }
        }

        return dp[n1][n2];
    }
}
```

🟠**动态规划二：求最长公共子序列再用总长度减去。**

```java
class Solution {
    public int minDistance(String word1, String word2) {
        // 动态规划二 求最长公共子序列再用总长度减去
        int n1 = word1.length();
        int n2 = word2.length();
        int[][] dp = new int[n1 + 1][n2 + 1]; // 不要求连续的子串
        // 默认初始化都为0了
        for (int i = 1; i <= n1; i++) {
            for (int j = 1; j <= n2; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    // 不相等取前一个状态的最大值 任一串退一步
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        // 总长度减去最长子序列长度
        return n1 + n2 - dp[n1][n2] * 2;
    }
}
```





## 编辑距离

[72. 编辑距离 - 力扣（LeetCode）](https://leetcode.cn/problems/edit-distance/)

> 你可以对一个单词进行如下三种操作：
>
> - 插入一个字符
> - 删除一个字符
> - 替换一个字符

1. dp\[i][j] 表示以下标i-1为结尾的字符串word1，和以下标j-1为结尾的字符串word2，最近编辑距离为dp\[i][j]。
2. 递推公式
   如果两个下标相等就不用编辑，dp\[i][j] = dp\[i - 1][j - 1]
   不相等要有三种情况，取最小 **dp\[i][j] = min({dp\[i - 1][j - 1], dp\[i - 1][j], dp\[i][j - 1]}) + 1;**
   🟠**word2添加一个元素，相当于word1删除一个元素**
   - word1删除一个元素，那么就是以下标i - 2为结尾的word1 与 j-1为结尾的word2的最近编辑距离 再加上一个操作
     dp\[i][j] = dp\[i - 1][j] + 1
   - word2删除一个元素，那么就是以下标i - 1为结尾的word1 与 j-2为结尾的word2的最近编辑距离 再加上一个操作
     dp\[i][j] = dp\[i][j - 1] + 1
   - **替换元素**，`word1`替换`word1[i - 1]`，使其与`word2[j - 1]`相同，此时不用增加元素，那么以下标`i-2`为结尾的`word1` 与 `j-2`为结尾的`word2`的最近编辑距离 加上一个替换元素的操作
     dp\[i][j] = dp\[i - 1][j - 1] + 1;
3. dp数组初始化
   dp\[i][0]就应该是i，对word1里的元素全部做删除操作，即：**dp\[i][0] = i;**
   **dp\[0][j] = j;**
4. 遍历顺序，从左到右，从上到下
   ![image-20220713171119413](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220713171119413.png)
5. 举例推导dp数组

![image-20220713171140316](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220713171140316.png)

**🟠重点在于四种情况的递推公式的分析**

```java
class Solution {
    public int minDistance(String word1, String word2) {
        int n1 = word1.length();
        int n2 = word2.length();
        int[][] dp = new int[n1 + 1][n2 + 1];
        // 数组初始化
        // 对全部word1删除
        for (int i = 1; i <= n1; i++) {
            dp[i][0] = i;
        }
        // 对全部word2删除
        for (int j = 1; j <= n2; j++) {
            dp[0][j] = j;
        }

        for (int i = 1; i <= n1; i++) {
            for (int j = 1; j <= n2; j++) { 
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    // 新添加的结尾都相等就不用编辑
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    // word1或word2删除一个元素 或者替换元素使得两个结尾都相同
                    // 最后加上一步编辑的操作
                    dp[i][j] = Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1])) + 1;
                }
            }
        }
        // 两个完整字符串加入的情况
        return dp[n1][n2];
    }
}
```





## 回文子串

[647. 回文子串 - 力扣（LeetCode）](https://leetcode.cn/problems/palindromic-substrings/)

1. 布尔类型的dp\[i][j]：表示区间范围[i,j] （**左闭右闭**）的子串是否是回文子串，如果是dp[i][j]为true，否则为false。
2. 递推公式
   当s[i]与s[j]不相等，dp\[i][j]一定是false。
   当s[i]与s[j]相等：
   - 下标i 与 j相同，同一个字符例如a，当然是回文子串
   - 下标i 与 j相差为1，例如aa，也是回文子串
   - **i 与 j相差大于1的时候**，例如cabac，两边向中间移动，看dp\[i + 1][j - 1]是否为true。
3. 初始化，全部为false
4. 遍历顺序，从左下到右上，保证dp\[i + 1][j - 1]都是经过计算的。
5. 举例推导dp数组

![image-20220713162629824](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220713162629824.png)

![image-20220713162642551](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220713162642551.png)

🟠**因为dp\[i][j]的定义，所以j一定是大于等于i的，那么在填充dp\[i][j]的时候一定是只填充右上半部分**。

```java
class Solution {
    public int countSubstrings(String s) {
        int n = s.length();
        int result = 0;
        // 初始化数组都为false
        boolean[][] dp = new boolean[n][n];

        // 遍历顺序 从下到上 从左到右
        // [i, j] j一定是大于i的
        for (int i = n - 1; i >= 0; i--) {
            for (int j = i; j < n; j++) {
                if (s.charAt(i) == s.charAt(j)) { // 两端相等
                    if (j - i <= 1) {
                        // 一个字符和两个字符的情况
                        result++;
                        dp[i][j] = true;
                    } else if (dp[i + 1][j - 1] == true) {
                        // 看内层是否回文
                        result++;
                        dp[i][j] = true;
                    }
                }
            }
        }

        return result;
    }
}
```



## 最长回文子序列

[516. 最长回文子序列 - 力扣（LeetCode）](https://leetcode.cn/problems/longest-palindromic-subsequence/)

🟠**回文子串是要连续的，回文子序列可以不连续**

1. dp\[i][j]：字符串s在[i, j]范围内最长的回文子序列的长度为dp\[i][j]。
2. 递推公式
   如果s[i]与s[j]相同，那么dp\[i][j] = dp\[i + 1][j - 1] + 2;
   如果不相同，分别加入s[i]和s[j]取两种情况的最大长度，dp\[i][j] = max(dp\[i + 1][j], dp\[i][j - 1])
3. 数组初始化，一个字符的回文子序列长度就是1。i = j的情况
   其他情况为0
4. 遍历顺序，从下到上，从左到右
5. 举例推导dp数组

![image-20220713164919612](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220713164919612.png)

![image-20220713164925551](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220713164925551.png)

🟠**注意 j = i + 1，因为i存在0的情况，会有 j - 1**

```java
class Solution {
    public int longestPalindromeSubseq(String s) {
        int n = s.length();
        int[][] dp = new int[n][n];
        // 初始化
        for(int i = 0; i < n; i++) {
            dp[i][i] = 1; // 一个字符的回文子序列长度就是1
        }

        for(int i = n - 1; i >= 0; i--) {
            for (int j = i + 1; j < n; j++) {
                if (s.charAt(i) == s.charAt(j)) {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                } else {
                    // 如果左右不相等 任一方向退一位 取最长
                    dp[i][j] = Math.max(dp[i][j - 1], dp[i + 1][j]);
                }
            }
        }
        // 结果是整个字符串加入的情况
        return dp[0][n - 1];
    }
}
```

