---
title: 贪心算法
date: 2022-07-13 23:14:49
tags:
  - Java
  - 算法
---

# 贪心算法

看代码随想录的笔记。

😴

<!-- more -->

## 基础

> 贪心的本质是选择每一阶段的局部最优，从而达到全局最优。

🟢解题步骤：

1. 将问题分解为若干个子问题
2. 找出适合的贪心策略
3. 求解每一个子问题的最优解
4. 将局部最优解堆叠成全局最优解

**常识性推导、举反例。**



## 分发饼干

[455. 分发饼干 - 力扣（LeetCode）](https://leetcode.cn/problems/assign-cookies/)

> 局部最优就是大饼干喂给胃口大的，充分利用饼干尺寸喂饱一个，全局最优就是喂饱尽可能多的小孩。

🟠**排序，然后依次遍历。**

排序后遍历，注意index<g.length

```java
class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        // 小孩的索引
        int index = 0;
        // 先满足小胃口
        for (int i = 0; i < s.length; i++) {
            if (index < g.length &&s[i] >= g[index]) {
                index++;
            }
        }
        return index;
    }
}
```



## 摆动序列

[376. 摆动序列 - 力扣（LeetCode）](https://leetcode.cn/problems/wiggle-subsequence/)

![image-20220605215050982](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220605215050982.png)

> 局部最优：删除单调坡度上的节点（不包括单调坡度两端的节点），那么这个坡度就可以有两个局部峰值。
>
> 整体最优：整个序列有最多的局部峰值，从而达到最长摆动序列。

🟠判断的条件：(curDiff > 0 && preDiff <= 0) || (curDiff < 0 && preDiff >=0)

```java
class Solution {
    public int wiggleMaxLength(int[] nums) {

        // 记录长度 仅有一个也符合
        int count = 1;
        // 记录插值
        int preDiff = 0;
        int curDiff = 0;
        for (int i = 1; i < nums.length; i++) {
            curDiff = nums[i] - nums[i - 1];
            // 一正一负
            // 两个不等也符合
            // 0的情况表示初始时的preDiff
            if ((curDiff > 0 && preDiff <= 0) || (curDiff < 0 && preDiff >=0)) {
                count++;
                preDiff = curDiff;
            }
        }
        return count;
    }
}
```



## 最大子数组和

[53. 最大子数组和 - 力扣（LeetCode）](https://leetcode.cn/problems/maximum-subarray/)

❌方法一：暴力法 **超出时间限制**

方法二：贪心解法

> 局部最优：当前“连续和”为负数的时候立刻放弃，从下一个元素重新计算“连续和”，因为负数加上下一个元素 “连续和”只会越来越小。
>
> 全局最优：选取最大“连续和”

![53.最大子序和](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/53.%E6%9C%80%E5%A4%A7%E5%AD%90%E5%BA%8F%E5%92%8C.gif)

🟠**之前的序列和为负则从当前开始新的序列**

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int max = Integer.MIN_VALUE;
        int sum = 0;
        for (int i = 0; i < nums.length; i++) {
            // 之前的序列和为负则从当前开始新的序列
            if (sum <= 0) {
                sum = 0;
            }
            sum += nums[i];
            max = Math.max(max, sum);
        }
        return max;        
    }
}
```



## 买卖股票的最佳时机

[122. 买卖股票的最佳时机 II - 力扣（LeetCode）](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)

🟠**将总利润分解为每天的利润**

![image-20220605223101613](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220605223101613.png)

```java
class Solution {
    public int maxProfit(int[] prices) {
        int result = 0;
        for (int i = 1; i < prices.length; i++) {
            result += Math.max(0, prices[i] - prices[i - 1]);
        }
        return result;
    }
}
```



## 跳跃游戏

[55. 跳跃游戏 - 力扣（LeetCode）](https://leetcode.cn/problems/jump-game/)

> 贪心算法局部最优解：每次取最大跳跃步数（取最大覆盖范围）
>
> 整体最优解：最后得到**整体最大覆盖范围**，看是否能到终点。

🟠for (int i = 0; i <= cover; i++) **cover是改变的，用来代表范围**

```java
class Solution {
    public boolean canJump(int[] nums) {
        int cover = 0; // 覆盖的最大范围下标
        // 一个元素必定到达
        if (nums.length == 1) {
            return true;
        }
        for (int i = 0; i <= cover; i++) {
            cover = Math.max(nums[i] + i, cover);
            // 如果能跳到最后的下标
            if (cover >= nums.length - 1) {
                return true;
            }
        }
        return false;
    }
}
```



## 跳跃游戏2

[45. 跳跃游戏 II - 力扣（LeetCode）](https://leetcode.cn/problems/jump-game-ii/)

![image-20220607122349121](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220607122349121.png)

🟠**更新每一步的最远距离下标，根据当前覆盖的最远距离下标增加步数**

```java
class Solution {
    public int jump(int[] nums) {
        int result = 0; // 步数
        int curDistance = 0;
        int nextDistance = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            // 更新最远距离
            nextDistance = Math.max(nextDistance, nums[i] + i);
            // 如果已经到达最远距离
            // 用小步的便利证明了一大步就可以到达最远
            if (i == curDistance) {
                // 更新当前最大距离
                curDistance = nextDistance;
                result++;
            }
        }
        return result;
    }
}
```



## k次取反后最大化数组和

[1005. K 次取反后最大化的数组和 - 力扣（LeetCode）](https://leetcode.cn/problems/maximize-sum-of-array-after-k-negations/)

> 局部最优：1. 绝对值大的负数变为正数。2. 只反转数值小的正整数。

🟠步骤：**排序后反转**

**如果还有剩余的奇数k，还要再排序一次。**

```java
class Solution {
    public int largestSumAfterKNegations(int[] nums, int k) {
        Arrays.sort(nums);
        // 先反转所有的负数
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] < 0 && k > 0) {
                nums[i] = -nums[i];
                k--;
            }
        }
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }
        Arrays.sort(nums);
        // 如果k还有剩余 此时全是正数了
        if (k % 2 == 1) {
            // 偶数抵消 奇数减去最小
            sum -= 2 * nums[0];
        }
        return sum;
    }
}
```



## 加油站

[134. 加油站 - 力扣（LeetCode）](https://leetcode.cn/problems/gas-station/)

❌暴力法超出时间上限

🟠**当前累加rest[j]的和curSum一旦小于0，起始位置至少要是j+1，因为从j开始一定不行。**

从每个结点尝试，一旦当前范围的累加小于零则设置新的起点。

**与暴力法的区别在于直接舍弃当前范围**：

1. 一开始是负数无法出发，所以第一位只能是正数
2. 没了第一位的正数，从第二位累加更是负数

```java
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int[] rest = new int[gas.length];
        for (int i = 0; i < gas.length; i++) {
            rest[i] = gas[i] - cost[i];
        }
        // 如果从当前下标累加为负数 从下一位继续
        int curSum = 0;
        int totalSum = 0;
        int start = 0; // 起始
        for (int i = 0; i < gas.length; i++) {
            curSum += rest[i];
            totalSum += rest[i];
            if (curSum < 0) {
                // 从下一位为起点
                start = i + 1;
                curSum = 0;
            }
        }
        // 不可能走完一圈
        if (totalSum < 0) {
            return -1;
        }
        return start;
    }
}
```



## 分发糖果

[135. 分发糖果 - 力扣（LeetCode）](https://leetcode.cn/problems/candy/)

> 局部最优：只要右边评分比左边大，右边的孩子就多一个糖果
>
> 如果 ratings[i] > ratings[i + 1]，取candyVec[i + 1] + 1 和 candyVec[i] 最大的糖果数量，candyVec[i]只有取最大的才能既**保持对左边candyVec[i - 1]的糖果多，也比右边candyVec[i + 1]的糖果多**

🟠**每个人最开始都有一块糖**

【左边大于右边的情况】不能从左向右遍历的原因：左边的元素会改变，而此轮右边的元素会变成下轮的左元素。**从右往左，右元素不会改变。**

💥使用 Arrays.fill() 为数组填充一个值。

[Initializing Arrays in Java | Baeldung](https://www.baeldung.com/java-initialize-array)

```java
class Solution {
    public int candy(int[] ratings) {
        int[] candy = new int[ratings.length];
        Arrays.fill(candy, 1);
        // 从左向右 如果右边大则多一个糖果
        for (int i = 1; i < ratings.length; i++) {
            if (ratings[i] > ratings[i - 1]) {
                candy[i] = candy[i - 1] + 1;
            }
        }
        // 从右向左 如果左边大则比右边大
        for (int i = ratings.length - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                candy[i] = Math.max(candy[i + 1] + 1, candy[i]);
            }
        }
        int sum = 0;
        for (int c : candy) {
            sum += c;
        }
        return sum;
    }
}
```



## 柠檬水找零

[860. 柠檬水找零 - 力扣（LeetCode）](https://leetcode.cn/problems/lemonade-change/)

> 局部最优：遇到账单20，优先消耗美元10，完成本次找零。
>
> 全局最优：完成全部账单的找零。

- 情况一：账单是5，直接收下。
- 情况二：账单是10，消耗一个5，增加一个10
- 情况三：账单是20，优先消耗一个10和一个5，如果不够，再消耗三个5

```java
class Solution {
    public boolean lemonadeChange(int[] bills) {
        int five = 0, ten = 0, twenty = 0;
        for (int i = 0; i < bills.length; i++) {
            int num = bills[i];
            if (num == 5) {
                five++;
            }
            if (num == 10) {
                five--;
                ten++;
            }
            if (num == 20) {
                // 先用10
                if (ten > 0) {
                    ten--;
                } else {
                    five--;
                    five--;
                }
                five--;
            }
            if (five < 0 || ten < 0) {
                return false;
            }
        }
        // 没出错则符合条件
        return true;
    }
}
```



## 根据身高重建队列

[406. 根据身高重建队列 - 力扣（LeetCode）](https://leetcode.cn/problems/queue-reconstruction-by-height/)

> 每个 `people[i] = [hi, ki]` 表示第 `i` 个人的身高为 `hi` ，前面 **正好** 有 `ki` 个身高大于或等于 `hi` 的人。

🟠**先按照身高排序，再按照k值依次插入，就不会影响已形成的序列。**

💥**Sort的排序参数**
**使用List插入**
**toArray()方法**

```java
class Solution {
    public int[][] reconstructQueue(int[][] people) {
        Arrays.sort(people, (a, b) -> {
            if (a[0] == b[0]) {
                // k小的在前
                return  a[1] - b[1];
            }
            // 值大的在前
            return b[0] - a[0];
        });
        // 用List实现插入
        List<int[]> list = new LinkedList<>();
        for (int[] p: people) {
            list.add(p[1], p);
        }
        return list.toArray(new int[people.length][]);
    }
}
```



## 最少数量的箭射气球

[452. 用最少数量的箭引爆气球 - 力扣（LeetCode）](https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/)

**🟠根据最左坐标排序**

**最开始打爆一个气球，看后面的气球是否能一起，否则用新的箭判断。**

```java
Arrays.sort(points, (o1, o2) -> Integer.compare(o1[0], o2[0]));
```

```java
class Solution {
    public int findMinArrowShots(int[][] points) {

        Arrays.sort(points, (o1, o2) -> Integer.compare(o1[0], o2[0]));
        int count = 1;
        for (int i = 1; i < points.length; i++) {
            if (points[i][0] <= points[i - 1][1]) {
                // 有重合 收缩右边界
                points[i][1] = Math.min(points[i][1], points[i - 1][1]);
            } else {
                // 不重合射一箭 接着看右边能否重合
                count++;
            }
        }
        return count;
    }
}
```



## 🟢排序

**比较排序**

```java
// 从小到大排序

// 差值过大会溢出 错误
Arrays.sort(points, (a, b) -> {
	return a[0] - b[0];
});

// Return a negative integer, zero, or a positive integer as the first argument is less than, equal to, or greater than the second.
Arrays.sort(points, (o1, o2) -> Integer.compare(o1[0], o2[0]));
```



**部分排序**

**Arrays.sort(int[] a, int fromIndex, int toIndex)**



## 无重叠区间

[435. 无重叠区间 - 力扣（LeetCode）](https://leetcode.cn/problems/non-overlapping-intervals/)

**按照右边界排序，从左向右记录非交叉区间的个数。最后用区间总数减去非交叉区间的个数就是需要移除的区间个数了**。

![image-20220607194727926](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/image-20220607194727926.png)

```java
class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        // 右边界排序
        Arrays.sort(intervals, (a, b) -> {
            // if (a[1] == b[1]) return a[0] - b[0];
            return a[1] - b[1];
        });
        int count = 1; // 区间个数
        int right = intervals[0][1]; // 右边界
        for (int i = 1; i < intervals.length; i++) {
            if (right <= intervals[i][0]) { // 交界不算
                right = intervals[i][1];
                count++;
            }
        }
        return intervals.length - count;
    }
}
```

**打气球解法**

🟠这个方法是缩小区间，上个方法是扩大区间。

```java
class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        // 左边界排序
        Arrays.sort(intervals, (a, b) -> {
            return Integer.compare(a[0], b[0]);
        });
        int count = 1; // 区间个数
        // 收缩边界
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] >= intervals[i - 1][1]) {
                count++;
            } else { // 重合
                intervals[i][1] = Math.min(intervals[i][1], intervals[i - 1][1]);
            }
        }
        return intervals.length - count;
    }
}
```



## 划分字母区间

[763. 划分字母区间 - 力扣（LeetCode）](https://leetcode.cn/problems/partition-labels/)

![763.划分字母区间](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/20201222191924417.png)

🟠**统计字符串中所有字符的起始和结束位置，就是【无重叠区间】的输入。**

**注意区间是左开右闭**

💥记录每个字符最后出现的位置的写法 edge[chars[i] - 'a'] = i;

```java
class Solution {
    public List<Integer> partitionLabels(String s) {
        List<Integer> list = new LinkedList<>();
        int[] edge = new int[26]; // 记录每个字符最后出现的位置
        char[] chars = s.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            edge[chars[i] - 'a'] = i;
        }
        
        int start = -1; // 0 - 8 是9个元素
        int index = 0;
        for (int i = 0; i < chars.length; i++) {
            // 更新最远边界
            index = Math.max(index, edge[chars[i] - 'a']);
            // 找到字符最大出现位置和下标相等
            if (i == index) {
                list.add(i - start);
                start = i; // 更新初始位置
            }
        }
        return list;
    }
}
```



## 合并区间

[56. 合并区间 - 力扣（LeetCode）](https://leetcode.cn/problems/merge-intervals/submissions/)

🟠**区间没有重合才加入上一个区间，区间重合当前的右边界要取最大。**

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        // 做区间从小到大排序
        Arrays.sort(intervals, (a,b)->{
            return Integer.compare(a[0], b[0]);
        });
        // 存放新的区间集合
        List<int[]> list = new LinkedList<>();
        int start = intervals[0][0]; // 合并的左边界
        for (int i = 1; i < intervals.length; i++) {
            int R = intervals[i][0]; // 当前的左边界
            int L = intervals[i - 1][1]; // 上一个的右边界
            if (L < R) { // 未重合 之前的就可以加入了
                list.add(new int[]{start, L});
                // 新的区间的左边界
                start = R;
            } else { // 重合取最大的右边界
                intervals[i][1] = Math.max(intervals[i][1], intervals[i - 1][1]);
            }
        }
        // 最后的加入
        list.add(new int[]{start, intervals[intervals.length - 1][1]});
        return list.toArray(new int[list.size()][]);
    }
}
```



## 单调递增的数字

[738. 单调递增的数字 - 力扣（LeetCode）](https://leetcode.cn/problems/monotone-increasing-digits/)

> 局部最优：遇到strNum[i - 1] > strNum[i]的情况，让strNum[i - 1]--，然后strNum[i]给为9，可以保证这两位变成最大单调递增整数。
>
> 全局最优：得到小于等于N的最大单调递增的整数。

🟠**从右向左遍历**

**start是连9的初始位置**

```java
class Solution {
    public int monotoneIncreasingDigits(int n) {
        String s = String.valueOf(n);
        char[] chars = s.toCharArray();
        int start = s.length();
        // 从后向前遍历
        for (int i = s.length() - 2; i >= 0; i--) {
            // 前面大于后面 顺便修改9的位置
            if (chars[i] > chars[i + 1]) {
                chars[i]--;
                start = i + 1;
            }
        }
        for (int i = start; i < s.length(); i++) {
            chars[i] = '9';
        }
        return Integer.parseInt(String.valueOf(chars));
    }
}
```



## 买卖股票的最佳时机含手续费

[714. 买卖股票的最佳时机含手续费 - 力扣（LeetCode）](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/)

🟠可以当天卖完再买。

三种情况：

1. 如果当前不卖出后面还有盈利的空间，所以当天卖出再买的时候返还手续费（相当于持有，不卖出）。
2. 前一天卖出，今天重新记录最小价格。
3. 不做操作，买入贵，卖出亏本。

```java
class Solution {
    public int maxProfit(int[] prices, int fee) {
        int result = 0;
        int minPrice = prices[0]; // 记录最低价格
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] < minPrice) {
                // 重新记录最小价格
                minPrice = prices[i];
            }
            if (prices[i] >= minPrice && prices[i] <= minPrice + fee) {
                // 卖入太贵 卖出亏本 不交易
                continue;
            }
            if (prices[i] > minPrice + fee) {
                // 计算收益 可以有多次 最后一次计算利润才是真正意义的卖出
                result += prices[i] - minPrice - fee;
                // 如果后面还有盈利空间 就会继续计算收益 此时返还手续费
                minPrice = prices[i] - fee;
            }
        }
        return result;
    }
}
```

