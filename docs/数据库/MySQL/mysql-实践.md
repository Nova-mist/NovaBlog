# mysql-实践



🟢`count()` 统计行数，要与分组 `group by` 搭配使用。

`sum()` 求一列的和，要与分组 `group by` 搭配使用。

```mysql
SELECT book_name, COUNT(unit_price) FROM book GROUP BY book_name;

SELECT book_name, SUM(unit_price) FROM book GROUP BY book_name;

# 统计每个id有多少xx
select id, count(id) from xx group by id; 
```





**一个笔试题，降序索引用降序查询效率高。**

[数据库学习记录809_](https://blog.csdn.net/u013712847/article/details/52161008)

```mysql
create table T{
k int unsigned not null auto_increment,
a date,
b varchar(24),
c int,d varchar(24),
primary key(k),unique key a_index (a DESC,b DESC),
key k1(b),key k2(c),key k3(d));
# 注意 命令不全
```

🟠primary key 和 unique key 的区别：

- primary key 用来区别表中唯一的行，unique key 用来保证不是主键的列的每一行是不重复的。
- primary key 不能有NULL，unique key 可以有一个NULL。
- primary key 唯一，unique key 可以有多个。
- 只有 primary key 支持**自增**，只有 unique key 支持**修改**。
- ❓primary  Creates clustered index，unique key Creates non-clustered index.

[Difference between Primary key and Unique key - GeeksforGeeks](https://www.geeksforgeeks.org/difference-between-primary-key-and-unique-key/)