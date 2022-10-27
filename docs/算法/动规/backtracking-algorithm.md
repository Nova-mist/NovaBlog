---
title: 回溯算法
date: 2022-07-13 23:14:35
tags:
  - Java
  - 算法
---



# 回溯算法

看代码随想录的笔记。

😊

<!-- more -->

## 基础

题目分类：

- 组合：N个数里面按一定规则找出k个数的集合
- 分割：一个字符串按一定规则有几种切割方式
- 子集：一个N个数的集合里有多少符合条件的子集
- 排列：N个数按一定规则全排列，有几种排列方式
- 棋盘问题

**只要有递归就会有回溯。**

回溯法的效率并不高，因为回溯的本质是穷举。

🟠组合无序，排列有序。

**回溯法解决的问题都可以抽象为树形结构，集合的大小是树的宽度，递归的深度是树的深度。**

### 回溯模板

```
void backtracking(参数) {
    if (终止条件) {
        存放结果;
        return;
    }

    for (选择：本层集合中元素（树中节点孩子的数量就是集合的大小）) {
        处理节点;
        backtracking(路径，选择列表); // 递归
        回溯，撤销处理结果
    }
}
```



## 组合

[77. 组合 - 力扣（LeetCode）](https://leetcode.cn/problems/combinations/)

- 全局变量，存放符合条件结果的集合
- 递归函数

### 剪枝

> 如果for循环选择的起始位置之后的元素个数 已经不足 我们需要的元素个数了，那么就没有必要搜索了。

1. 已经选择的元素个数：path.size();
2. 还需要的元素个数为: k - path.size();
3. 在集合n中至多要从该起始位置 : n - (k - path.size()) + 1，开始遍历

```java
// 原始的横向遍历
for (int i = startIndex; i <= n; i++) {}
// 剪枝后
for (int i = startIndex; i <= n - (k - path.size()) + 1; i++) // i为本次搜索的起始位置
{}
```

<img src="https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/20210130194335207.png" alt="77.组合4" style="zoom:50%;" />

```java
class Solution {
    public List<List<Integer>> combine(int n, int k) {
        backtracking(n, k, 1);
        return result;
    }

    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    /**
    * @param startIndex 集合从第几个数开始
    */
    private void backtracking(int n, int k, int startIndex) {
        // 终止条件
        if (path.size() == k) {
            result.add(new ArrayList<>(path));
            return;
        }
        // 横向遍历
        for (int i = startIndex; i <= n - (k - path.size()) + 1; i++) {
            path.add(i);
            backtracking(n, k, i + 1);
            // path.removeLast();
            path.remove(path.size() - 1);
        }
    }
}
```

🟧注意：

1. 移除List最后一个元素的方法
2. result.add(new ArrayList<>(path)); **一定要新建一个List**



## 组合求和3

[216. 组合总和 III - 力扣（LeetCode）](https://leetcode.cn/problems/combination-sum-iii/)

### 剪枝

> 已选元素总和如果已经大于n，往后遍历没有意义

```java
if (sum > targetSum) { // 剪枝操作
    return;
}
```

**双重剪枝**

🟠只使用数字1-9，不重复

**这里的n是相加之和，剪枝中的n其实是数组的长度就是9**

```java
class Solution {
    public List<List<Integer>> combinationSum3(int k, int n) {
        backTracking(k, n, 1, 0);
        return result;
    }

    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new LinkedList<>();
    // 传递的sum是用来判断的值 不是全局的
    private void backTracking(int k, int n, int startIndex, int sum) {
        // 终止条件 check
        if (path.size() == k) {
            if (sum == n) {
                result.add(new LinkedList<>(path));
            }
            return;
        }
        // 剪枝
        if (sum > n) {
            return;
        }
        // 剪枝
        for (int i = startIndex; i <= 9 - (k - path.size()) + 1; i++) {
            path.add(i);
            sum += i;
            // 处理
            backTracking(k, n, i + 1, sum);
            // 回溯
            path.remove(path.size() - 1);
            sum -= i;
        }
    }
}
```



## 电话号码的字母组合

[17. 电话号码的字母组合 - 力扣（LeetCode）](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

🟠**终止条件是遍历digits每一位；找到数字与字符串数组的映射关系。**

```java
class Solution {
    public List<String> letterCombinations(String digits) {
        if (digits == null || digits.length() == 0) {
            return result;
        }
        //初始对应所有的数字，为了直接对应2-9，新增了两个无效的字符串""
        String[] numString = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        backTracking(digits, numString, 0);
        return result;
    }

    List<String> result = new ArrayList<>();
    StringBuilder sb = new StringBuilder();
    /**
    * @param num 按位处理digits的标志 
    */
    private void backTracking(String digits, String[] numString, int num) {
        // 终止条件就是遍历完所有位
        if (num == digits.length()) {
            result.add(sb.toString());
            return;
        }
        // 当前处理的字符串 当前数字的映射
        String str = numString[digits.charAt(num) - '0'];
        for (int i = 0; i < str.length(); i++) {
            // 每次加入的字符
            sb.append(str.charAt(i));
            backTracking(digits, numString, num + 1);
            // 回溯
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}
```



## 组合总和

[39. 组合总和 - 力扣（LeetCode）](https://leetcode.cn/problems/combination-sum/)

🟠可以重复的情况，结果仍旧需要根据顺序去重。

**Arrays.sort(candidates);**

```java
class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        // 剪枝前的排序
        Arrays.sort(candidates);
        backTracking(candidates, target, 0, 0);
        return result;
    }

    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    /**
     * @param startIndex 元素的序列下标 从0开始
     */
    private void backTracking(int[] candidates, int target, int sum, int startIndex) {
        // 终止条件
        if (sum == target) {
            result.add(new ArrayList<>(path));
            return;
        }
        // 横向遍历
        for (int i = startIndex; i < candidates.length; i++) {
            int num= candidates[i];
            // 剪枝
            if (sum + num > target) {
                break;
            }
            path.add(num);
            sum += num;
            // 由于可重复startIndex不递增 但已选的元素之前的不能出现了
            backTracking(candidates, target, sum, i);
            // 回溯
            path.remove(path.size() - 1);
            sum -= num;
        }
    }
}
```



## 组合总和2

[40. 组合总和 II - 力扣（LeetCode）](https://leetcode.cn/problems/combination-sum-ii/)

🟠**不能使用hashset去重**

**去重的方法**

```java
// 要对同一树层使用过的元素进行跳过
if (i > startIndex && candidates[i] == candidates[i - 1]) {
  continue;
}
```

```java
class Solution {
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        backTracking(candidates, target, 0, 0);
        return result;
    }

    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    private void backTracking(int[] candidates, int target, int sum, int startIndex) {
        // 中止的条件
        if (target == sum) {
            result.add(new ArrayList<>(path));
            return;
        }
        for (int i = startIndex; i < candidates.length; i++) {
            
            // 要对同一树层使用过的元素进行跳过
            if (i > startIndex && candidates[i] == candidates[i - 1]) {
                continue;
            }

            int num = candidates[i];
            // 剪枝
            if (sum + num > target) {
                break;
            }
            path.add(num);
            sum += num;
            backTracking(candidates, target, sum, i + 1);
            // 回溯
            path.remove(path.size() - 1);
            sum -= num;
        }
    }
}
```



## 分割回文串

[131. 分割回文串 - 力扣（LeetCode）](https://leetcode.cn/problems/palindrome-partitioning/)

![131.分割回文串](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/131.%E5%88%86%E5%89%B2%E5%9B%9E%E6%96%87%E4%B8%B2.jpg)

**切割问题类似组合问题**

中止条件：切割完了整个字符串。

🟠**判断回文串：从两端向内移动。**

```java
class Solution {
    public List<List<String>> partition(String s) {
        backTracking(s, 0);
        return result;
    }

    List<List<String>> result = new ArrayList<>();
    List<String> path = new ArrayList<>();

    private void backTracking(String s, int startIndex) {
        // 终止条件 遍历完字符串
        if (startIndex > s.length()) {
            result.add(new ArrayList<>(path));
            return ;
        }

        for (int i = startIndex; i < s.length(); i++) {
            // 回文子串则记录
            if (isPalindrome(s, startIndex,i)) {
                String str = s.substring(startIndex, i + 1); // 取序列左闭右开
                path.add(str);
            } else {
                continue;
            }
            backTracking(s, i + 1);
            // 回溯
            path.remove(path.size() - 1);
        }
        
    }

    /** 判断回文串 */
    private boolean isPalindrome(String s, int start, int end) {
        for (int i = start, j = end; i < j; i++, j--) {
            if (s.charAt(i) != s.charAt(j)) {
                return false;
            }
        }
        return true;
    }
}
```



## 复原IP地址

[93. 复原 IP 地址 - 力扣（LeetCode）](https://leetcode.cn/problems/restore-ip-addresses/)

![93.复原IP地址](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/20201123203735933.png)

🟠通过判断子串合法性来剪枝

- 段位以0为开头的数字不合法
- 段位里有非正整数字符不合法
- 段位如果大于255了不合法

**子串合法性的判断 **~~并且start 一定小于 end~~

```java
class Solution {
    public List<String> restoreIpAddresses(String s) {
        backTracking(s, 0, 0);
        return result;
    }

    List<String> result = new ArrayList<>();
/**
 * @param pointNum 逗点的数量
 */
    private void backTracking(String s, int startIndex, int pointNum) {
        // 终止条件
        if (pointNum == 3) {
            // 判断最后一段合法性
            if (isValid(s, startIndex, s.length() - 1)) {
                result.add(s);
            }
            return;
        }
        for (int i = startIndex; i < s.length(); i++) {
            if (isValid(s, startIndex, i)) {
                // 在原字符串上进行修改该 插入逗点
                s = s.substring(0, i + 1) + '.' + s.substring(i + 1);
                pointNum++;
                backTracking(s, i + 2, pointNum);
                // 回溯
                s = s.substring(0, i + 1) + s.substring(i + 2);
                pointNum--;
            } else {
                break;
            }
        }
    }

    // 判断子串是否合法
    private boolean isValid(String s, int start, int end) {
        // if (start > end) {
        //     return false;
        // }
        // 0开头不合法
        if (s.charAt(start) == '0' && start != end) {
            return false;
        }

        int num = 0;
        for (int i = start; i <= end; i++) {
            // 含有非正整数字符
            if (s.charAt(i) > '9' || s.charAt(i) < '0') {
                return false;
            }
            // 从左到右按位求和
            num = num * 10 + (s.charAt(i) - '0');
            // 大于255不合法
            if (num > 255) {
                return false;
            }
        }
        return true;
    }
}
```



## 子集

[78. 子集 - 力扣（LeetCode）](https://leetcode.cn/problems/subsets/)

![78.子集](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/202011232041348.png)

🟠**记录所有遍历的节点**

> 求子集，集合是无序的，从startIndex开始回溯
>
> 求排列，集合是有序的，从0开始回溯

```java
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        backTracking(nums, 0);
        return result;
    }

    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    private void backTracking(int[] nums, int startIndex) {
        // 每个结点都加入
        result.add(new ArrayList<>(path));
        // 终止条件 遍历到集合末尾
        if (startIndex == nums.length) {
            return;
        }
        for (int i = startIndex; i < nums.length; i++) {
            path.add(nums[i]);
            backTracking(nums, i + 1);
            // 回溯
            path.remove(path.size() - 1);
        }
    }
}
```



## 子集2

[90. 子集 II - 力扣（LeetCode）](https://leetcode.cn/problems/subsets-ii/)

🟠**区别在于：集合中由重复的元素，求取的子集要去重。**

> 同一树层上不可以重复选取。
>
> 同一树枝上可以重复选取。

![90.子集II](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/20201124195411977.png)

**去重**

```java
if (i > startIndex && nums[i] == nums[i - 1]) {
  continue;
}
```

```java
class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        backTracking(nums, 0);
        return result;
    }

    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    private void backTracking(int[] nums, int startIndex) {
        // 每个结点都加入
        result.add(new ArrayList<>(path));
        // 终止条件 遍历完成
        if (startIndex == nums.length) {

            return ;
        }
        for (int i = startIndex; i < nums.length; i++) {
            // 去重
            if (i > startIndex && nums[i] == nums[i - 1]) {
                continue;
            }
            path.add(nums[i]);
            backTracking(nums, i + 1);
            // 回溯
            path.remove(path.size() - 1);
        }

    }
}
```

💥**使用used数组要放在全局，并且在回溯时候要取消。**

```java
class Solution {
   List<List<Integer>> result = new ArrayList<>();// 存放符合条件结果的集合
   LinkedList<Integer> path = new LinkedList<>();// 用来存放符合条件结果
   boolean[] used;
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        if (nums.length == 0){
            result.add(path);
            return result;
        }
        Arrays.sort(nums);
        used = new boolean[nums.length];
        subsetsWithDupHelper(nums, 0);
        return result;
    }
    
    private void subsetsWithDupHelper(int[] nums, int startIndex){
        result.add(new ArrayList<>(path));
        if (startIndex >= nums.length){
            return;
        }
        for (int i = startIndex; i < nums.length; i++){
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]){
                continue;
            }
            path.add(nums[i]);
            used[i] = true;
            subsetsWithDupHelper(nums, i + 1);
            path.removeLast();
            used[i] = false;
        }
    }
}
```



## 增序子序列

[491. 递增子序列 - 力扣（LeetCode）](https://leetcode.cn/problems/increasing-subsequences/)

> 有序的递增子序列

🟠**同层去重；所取元素要大于序列最后一个元素**

**负数的情况，要index+100**
**每层是独立的标记，回溯时候就不用取消**

```java
class Solution {
    public List<List<Integer>> findSubsequences(int[] nums) {
        backTracking(nums, 0);
        return result;
    }

    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    private void backTracking(int[] nums, int start) {
        // 记录两个元素以上的结点
        if (path.size() > 1) {
            result.add(new ArrayList<>(path));
        }
        // 终止条件
        if (start == nums.length) {
            return;
        }
        // 不影响下一层
        boolean[] used = new boolean[201];
        for (int i = start; i < nums.length; i++) {

            // 所取元素要大于序列最后一个元素
            if (!path.isEmpty() &&nums[i] < path.get(path.size() - 1)) {
                continue;
            }
            // 同层去重
            if (used[nums[i] + 100] == true) {
                continue;
            }
            // 标记使用
            used[nums[i] + 100] = true;
            path.add(nums[i]);
            backTracking(nums, i + 1);
            // 回溯
            // used[nums[i]] = false;
            path.remove(path.size() - 1);
        }
    }
}
```



## 全排列

[46. 全排列 - 力扣（LeetCode）](https://leetcode.cn/problems/permutations/)

🟠**不需要startIndex参数**

**按序列的的 used 数组也可以，也适合有重复的情况**

```java
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        backTracking(nums);
        return result;
    }

    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    boolean[] used = new boolean[21];
    private void backTracking(int[] nums) {
        // 终止条件
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
        }

        for (int i = 0; i < nums.length; i++) {
            // 使用过就跳过
            if (used[nums[i] + 10] == true) {
                continue;
            }
            path.add(nums[i]);
            used[nums[i] + 10] = true;
            backTracking(nums);
            // 回溯
            path.remove(path.size() - 1);
            used[nums[i] + 10] = false;
        }
    }
}
```



## 全排列2

🟠有重复的元素需要先排序。

> 如果要对树层中前一位去重，就用`used[i - 1] == false` ✅效率更高
>
> 如果要对树枝前一位去重用`used[i - 1] == true`。

```java
class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        //排序 同层去重的准备
        Arrays.sort(nums);
        used = new boolean[nums.length];
        backTracking(nums);
        return result;
    }

    List<List<Integer>> result = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    boolean[] used;
    private void backTracking(int[] nums) {
        // 终止条件
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
        }

        for (int i = 0; i < nums.length; i++) {
            // 使用过就跳过 同层重复跳过
            if (used[i] == true) {
                continue;
            }
            // 同层去重
            if (i > 0 && nums[i] == nums[i - 1] && used[i - 1] == false) {
                continue;
            }
            path.add(nums[i]);
            used[i] = true;
            backTracking(nums);
            // 回溯
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
```

🟠使用HashSet进行同层去重

```java
class Solution {
    private List<List<Integer>> res = new ArrayList<>();
    private List<Integer> path = new ArrayList<>();
    private boolean[] used = null;

    public List<List<Integer>> permuteUnique(int[] nums) {
        used = new boolean[nums.length];
        Arrays.sort(nums);
        backtracking(nums);
        return res;
    }

    public void backtracking(int[] nums) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }
        HashSet<Integer> hashSet = new HashSet<>();//层去重
        for (int i = 0; i < nums.length; i++) {
            if (hashSet.contains(nums[i]))
                continue;
            if (used[i] == true)//枝去重
                continue;
            hashSet.add(nums[i]);//记录元素
            used[i] = true;
            path.add(nums[i]);
            backtracking(nums);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
```



## 重新安排行程

[332. 重新安排行程 - 力扣（LeetCode）](https://leetcode.cn/problems/reconstruct-itinerary/)

🟠**出发机场和到达机场会重复，在搜索过程中需要【删除】结点。**

使用航班次数来标记机场的使用情况。

![332.重新安排行程1](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/2020111518065555.png)

> 寻找在树形结构中唯一的一条通向叶子节点的路线
>
> 递归终止条件：结点数量等于目的地机场个数+1

🟠**操作Map<String, Map<String, Integer>>**

- map.containsKey(list.get(0))
- temp.put(list.get(1), temp.getOrDefault(list.get(1), 0) + 1);
- target.getValue(); target.getKey()
- Map.Entry<String, Integer> target : map.get(last).entrySet()

```java
class Solution {
    public List<String> findItinerary(List<List<String>> tickets) {
        // 填充映射表
        for (List<String> list : tickets) {
            Map<String, Integer> temp;
            // 如果包含出发机场 修改可用的目的地次数
            if (map.containsKey(list.get(0))) {
                temp = map.get(list.get(0));
                temp.put(list.get(1), temp.getOrDefault(list.get(1), 0) + 1);
            } else {
                temp = new TreeMap<>(); // 升序map
                temp.put(list.get(1), 1);
            }
            map.put(list.get(0), temp);
        }

        result.add("JFK"); // 必定的初始结点
        backTracking(tickets.size());
        return result;
    }

    List<String> result = new ArrayList<>();
    // <出发机场, map<到达机场, 航班次数>>
    Map<String, Map<String, Integer>> map = new HashMap<>();
    private boolean backTracking(int ticketNum) {
        // 终止条件 路线的结点数量等于机场数量
        if (result.size() == ticketNum + 1) {
            return true;
        }
        // 从当前机场前往下一站
        String last = result.get(result.size() - 1);
        if (map.containsKey(last)) {
            // 遍历每个键值对
            for (Map.Entry<String, Integer> target : map.get(last).entrySet()) {
                int count = target.getValue();
                // 可使用
                if (count > 0) {
                    result.add(target.getKey());
                    target.setValue(count - 1);
                    // 找到线路就结束
                    if (backTracking(ticketNum)) {
                        return true;
                    }
                    // 回溯
                    result.remove(result.size() - 1);
                    target.setValue(count);
                }
            }
        }
        return false; // 未找到 回溯
        
    }
}
```







## ❌N皇后 & 解数独

[51. N 皇后 - 力扣（LeetCode）](https://leetcode.cn/problems/n-queens/)

[37. 解数独 - 力扣（LeetCode）](https://leetcode.cn/problems/sudoku-solver/)
