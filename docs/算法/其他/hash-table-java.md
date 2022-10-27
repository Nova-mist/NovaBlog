---
title: hash-table-java
date: 2022-05-24 15:42:29
tags:
  - 算法
  - Java
---



# Hash Table

## 基础

哈希表、散列表。

**一般哈希表都是用来快速判断一个元素是否出现集合里。** *O(1)*

> hashFunction = hashCode(name) % tableSize 取模保证映射出来的索引数值都落在哈希表上

解决哈希碰撞的方法：

1. 拉链法：将发生冲突的元素都存储在链表中
2. 线性探测法：冲突时寻找下一个空位，tableSize要大于dataSize

**常见的哈希结构**：

- 数组
- set 集合
- map 映射

==TODO：容器的底层实现==

> 红黑树是一种平衡二叉搜索树，key值有序但不可以修改，只能删除和增加。



<!-- more -->



## 字符串中的字母

💥判断两个字符串是否是**字母异位词**

[242. 有效的字母异位词 - 力扣（LeetCode）](https://leetcode.cn/problems/valid-anagram/)

✅方法一：判断排序后字符数组是否相等。

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        // 排序后是否相等
        char[] cs = s.toCharArray();
        char[] ct = t.toCharArray();
        Arrays.sort(cs);
        Arrays.sort(ct);
        if (Arrays.equals(cs, ct)) {
            return true;
        }
        return false;
    }
}
```

[Java中的length和length()深入分析_java_脚本之家 (jb51.net)](https://www.jb51.net/article/97199.htm)

[Convert a String to Character Array in Java - GeeksforGeeks](https://www.geeksforgeeks.org/convert-a-string-to-character-array-in-java/)

🟠**使用 length 获取数组的程度,使用 length() 获取字符串的长度。**

char[] 与 string 的转换：

- s.toString()
- s.toCharArray()
- ch[i] = str.charAt(i)  **不推荐**

✅方法二：定义record数组（哈希表）来记录字母出现的次数，经过两次遍历的加减，判断是否所有元素都为0。

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        // 两次遍历
        int[] record = new int[26];
        for (char c : s.toCharArray()) {
            record[c - 'a'] += 1;
        }
        for (char c : t.toCharArray()) {
            record[c - 'a'] -= 1;
        }
        // 判断是否都为0
        for (int i : record) {
            if (i != 0) {
                return false;
            }
        }
        return true;
    } 
}
```

---

💥[383. 赎金信 - 力扣（LeetCode）](https://leetcode.cn/problems/ransom-note/)

> `magazine` 中的每个字符只能在 `ransomNote` 中使用一次。
>
> 都是小写字母。

统计两个字符串中字母出现的次数，两次遍历增减，只要前者字母出现次数都小于后者就满足条件。

🟠先遍历大的magazine

```java
class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        int[] charCount = new int[26];
        // 先遍历大的
        for (char i : magazine.toCharArray()) {
            charCount[i - 'a']++;
        }
        for (char i : ransomNote.toCharArray()) {
            if (charCount[i - 'a'] > 0){
                charCount[i - 'a']--;
            } else {
                return false;
            }

        }
        return true;
    }
}
```







## 两个数组的交集

[349. 两个数组的交集 - 力扣（LeetCode）](https://leetcode.cn/problems/intersection-of-two-arrays/)

> 输出结果中的每个元素一定是唯一的。 我们可以不考虑输出结果的顺序。

- 使用HashSet来判断是否包含。
- 注意HashSet的方法：① set1.contains(i) ② resSet.size()

```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        // 空的情况处理
        if (nums1 == null || nums1.length == 0 || nums2 == null || nums2.length == 0) {
            return new int[0];
        }
        Set<Integer> set1 = new HashSet<>();
        Set<Integer> resSet = new HashSet<>();
        for (int i : nums1) {
            set1.add(i);
        }
        // 使用HashSet判断是否已经包含
        for (int i : nums2) {
            if (set1.contains(i)) {
                resSet.add(i);
            }
        }
        // 转换为数组
        int[] resArray = new int[resSet.size()];
        int index = 0;
        for (int i : resSet) {
            resArray[index++] = i;
        }
        return resArray;
    }
}
```



## 快乐数

[202. 快乐数 - 力扣（LeetCode）](https://leetcode.cn/problems/happy-number/)

> 也可能是 无限循环 但始终变不到 1。如果 可以变为 1，那么这个数就是快乐数。

**使用HashSet判断每次求和结果是否已经出现，出现返回false，否则直到求和结果为1。**

🟠注意还需要判断跳出循环的方式；按位求和的方式。

```java
class Solution {
    public boolean isHappy(int n) {
        Set<Integer> record = new HashSet<>();
        // 每次判断求和结果是否已经包含
        while (n != 1 && !record.contains(n)) {
            record.add(n);
            n = getNextNumber(n);
        }
        // 判断跳出循环的方式
        return n == 1;
    }
    private int getNextNumber(int n) {
        int res = 0;
        while (n > 0) {
            // 个位
            int temp = n%10;
            res += temp * temp;
            n = n / 10;
        }
        return res;
    }
}
```



## 两数之和

[1. 两数之和 - 力扣（LeetCode）](https://leetcode.cn/problems/two-sum/)

**遍历的时候就判断target减去每个数的值是否在HashMap中，并返回相应的数组下标。**

🟠数组中同一个元素在答案里不能重复出现。不能先全部放到HashMap中？？；从后向前找，也注意输出序列的顺序。

HashMap的方法：

- map.containsKey(temp)
- map.get(temp)
- map.put(nums[i], i)

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        // 结果的两个数
        int[] res = new int[2];
        if(nums == null || nums.length == 0) {
            return res;
        }
        // 存储值和下标
        Map<Integer, Integer> map = new HashMap<>();
        // 判断是否包含相减结果 相当于在数组中往前找
        // [3 2 4] 6 同一元素无重复
        for (int i = 0; i < nums.length; i++) {
            int temp = target - nums[i];
            if (map.containsKey(temp)) {
                res[1] = i;
                res[0] = map.get(temp);
            }
            map.put(nums[i], i);
        }
        return res;
    }
}
```



## 四数相加

[454. 四数相加 II - 力扣（LeetCode）](https://leetcode.cn/problems/4sum-ii/)

找到A[i] + B[j] + C[k] + D[l] = 0 **计算有多少个元组**

> 遍历大A和大B数组，统计两个数组元素之和，和出现的次数，放到map中。
>
> 在遍历大C和大D数组，找到如果 0-(c+d) 在map中出现过的话，就用count把map中key对应的value也就是出现次数统计出来。

🟠注意值第一次放入map的处理

```java
class Solution {
    public int fourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {
        Map<Integer, Integer> map = new HashMap<>();
        // 遍历nums1 nums2 放入加和与次数
        for (int i : nums1) {
            for (int j : nums2) {
                int temp = i + j;
                if (map.containsKey(temp)) {
                    map.put(temp, map.get(temp) + 1);
                }
                else { // 第一次值出现的处理
                    map.put(temp, 1);
                }
            }
        }
        // 遍历nums3 nums4 判断加和与target相减值是否包含在map中
        int res = 0;
        for (int i : nums3) {
            for (int j : nums4) {
                int temp = 0 - i - j;
                if (map.containsKey(temp)) {
                    res += map.get(temp);
                }
            }
        }
        return res;
    }
}
```



## 三数之和

[15. 三数之和 - 力扣（LeetCode）](https://leetcode.cn/problems/3sum/)

> 不可以包含重复的三元组

💥**因为返回的是数值，使用双指针法。**

🟠创建List的方法 —— Arrays.asList(nums[i], nums[left], nums[right])

注意重复情况的处理①序列处②左右指针处

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        // 排序后如果第一个元素大于0直接退出
        Arrays.sort(nums);     
        for (int i = 0; i < nums.length; i++) {
            if (nums[0] > 0) {
                return res;
            }
            // 重复的情况
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            // 双指针法
            int left = i + 1;
            int right = nums.length - 1;
            // 循环判断和
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum > 0) {
                    right--;
                }  else if (sum < 0) {
                    left++;
                } else { // sum == 0
                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    // 处理重复的情况
                    while (left < right && nums[right] == nums[right - 1]) {
                        right--;
                    }
                    while (left < right && nums[left] == nums[left - 1]) {
                        left--;
                    }
                    right--;
                    left++;
                }
            } // end while
        } // end for
        return res;
    }
}
```



## 四数之和

[18. 四数之和 - 力扣（LeetCode）](https://leetcode.cn/problems/4sum/submissions/)

🟠注意向中间移动；相当于在外面多了一层

```java
class Solution {
    public List<List<Integer>> fourSum(int[] nums, int target) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);
        for (int i = 0; i < nums.length; i++) {
            // 去重
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            // 第二层
            for (int j = i + 1; j < nums.length; j++) {
                if (j > i + 1 && nums[j] == nums[j - 1] ) {
                    continue;
                }
                // 双指针法
                int left = j + 1;
                int right = nums.length - 1;
                while (left < right) {
                    int sum = nums[i] + nums[j] + nums[left] + nums[right];
                    // 判断和
                    if (sum < target) {
                        left++;
                    } else if (sum > target) {
                        right--;
                    } else { // sum == target
                        res.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));

                        // 去重
                        while (left < right && nums[right] == nums[right - 1]) {
                            right--;
                        }
                        // 注意向中间移动
                        while (left < right && nums[left] == nums[left + 1]) {
                            left++;
                        }
                        left++;
                        right--;
                    }
                } // end while
            } // end for
        } // end for
        return res;
    }
}
```



## 总结

**Arrays类方法**

- sort(a)
- equals(a, b) Char[]数组  int[]数组
- asList(a, b ...)
