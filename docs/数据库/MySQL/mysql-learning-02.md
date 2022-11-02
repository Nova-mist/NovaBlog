---
title: mysql学习02——概述与常用命令
date: 2021-06-21 11:32:30
tags:
  - mysql
---

<img src="https://raw.githubusercontent.com/Nova-mist/HexoBlogResources/main/images/2021/JulyNicePng_mysql-logo-transparent-png_2693138.png" alt="NicePng_mysql-logo-transparent-png_2693138" style="zoom:50%;" />

**今天复习一些基础知识。**（准备专业课期末考试中 Busy 🥛）

## 准备

- 安装了 `MySQL Workbench` 图形化界面
- 下载了书中附录的[建库代码](https://forta.com/books/0672336073/)

资料参考：

- https://www.runoob.com/mysql/mysql-tutorial.html
- https://www.liaoxuefeng.com/wiki/1177760294764384

### 登录命令

```bash
mysql -uroot -p
Enter# 输入密码
```



<!-- more -->



## 概述

数据库（database）是一个以某种有组织的方式存储的数据集合。

数据库管理系统（DBMS）创建和操纵数据库这个容器。

表（table）是某种特定类型数据的结构化清单。**每个数据库中的表名唯一。**

*每个表存储一组相关的数据*

表由列（column）组成，列是表中的一个字段。**每个列都有相应的数据类型。**

表中的数据按行（row）存储.

**主键：每一行中可以唯一标识自己的一列或一组列。ID 编号**

**SQL ( Structured Query Language)**

**SQL语言定义了操作数据库的能力**

> **DDL：Data Definition Language**
>
> DDL允许用户定义数据，也就是创建表、删除表、修改表结构这些操作。通常，DDL由数据库管理员执行。
>
> CREATE, DROP, ALTER, TRUNCATE
>
> **DML：Data Manipulation Language**
>
> DML为用户提供添加、删除、更新数据的能力，这些是应用程序对数据库的日常操作。
>
> UPDATE, DELETE, INSERT
>
> **DQL：Data Query Language**
>
> DQL允许用户查询数据，这也是通常最频繁的数据库日常操作。
>
> SELECT

 

## 关系模型

### 主键

主键是用来唯一定位记录的，最好不要修改。

- 自增整数类型
- 全局唯一 GUID 类型

> 任意列都可以作为主键，只要
>
> - 每行的主键值唯一
> - 主键列中的值不允许修改或更新
> - 主键值不能重用，删除一行，他的主键也不能赋给新的行。

 

### 联合主键

多个字段设置为主键

**允许重复，只要不是所有主键列都重复。**

 

### 外键

实现 一对多、多对多、一对一 的关系。

> 在`students`表中，通过`class_id`的字段，可以把数据与另一张表关联起来，这种列称为`外键`。

**外键并不是通过列名实现的，而是通过定义外键约束实现的。**

```mysql
ALTER TABLE students
ADD CONSTRAINT fk_class_id
FOREIGN KEY (class_id)
REFERENCES classes (id);
 
# 删除外键
ALTER TABLE students
DROP FOREIGN KEY fk_class_id;
 
# 删除列
DROP COLUMN ...
```

> 外键约束的名称`fk_class_id`可以任意，`FOREIGN KEY (class_id)`指定了`class_id`作为外键，`REFERENCES classes (id)`指定了这个外键将关联到`classes`表的`id`列（即`classes`表的主键）。
>
> **通过定义外键约束，关系数据库可以保证无法插入无效的数据。即如果`classes`表不存在`id=99`的记录，`students`表就无法插入`class_id=99`的记录。**

 

### 索引

> 索引是关系数据库中对某一列或多给个列的值进行预排序的数据结构。通过使用索引，可以让数据库系统不必扫描整个表，而是直接定位到符合条件的记录，这样就大大加快了查询速度。

**索引的效率取决于索引列的值是否散列，即该列的值如果越互不相同，那么索引效率越高。**

```mysql
ALTER TABLE students
ADD INDEX idx_score (score);
 
ALTER TABLE students
ADD INDEX idx_name_score (name, score);
```

 

**添加唯一索引保持唯一性约束：不能出现同一个身份证号**

```mysql
ALTER TABLE students
ADD UNIQUE INDEX uni_name (name);
 
# 或者只对某一列添加一个唯一约束而不创建唯一索引
ALTER TABLE students
ADD CONSTRAINT uni_name UNIQUE (name);
```

 



## [SQL 数据类型](https://www.runoob.com/mysql/mysql-data-types.html)

- 数据类型可以限制存储的数据。
- 数据类型允许在内部更有效的存储数据。
- 数据类型允许变换排序顺序。例如字符串中 1>10>2

### 字符串

字符串值必须阔在**单引号**中。

- CHAR 定长字符，**长度必须在创建时规定**。
- TEXT（LONG 、VARCHAR） 边长文本，处理效率低。

### 数值

- BIT 0/1
- DECIMAL （NUMERIC）定点或精度可变的浮点值
- FLOAT （NUMBER） 浮点值
- INT （INTEGER）4 Bytes 整数值
- REAL 4 Bytes 浮点值
- SMALLINT 2 Bytes 整数
- TINYINT 1 Bytes 整数，0~255

### 日期和时间

- DATE 日期
- TIME 时间
- DATETIME （TIMESTAMP） 日期时间

### 二级制数据类型





## 常用SQL语句的语法



### ALTER　TABLE

更新已存在表的结构。

```mysql
ALTER TABLE tablename
{
	ADD|DROP column datatype [NULL|NOT NULL] [CONSTRAINS],
	ADD|DROP column datatype [NULL|NOT NULL] [CONSTRAINS]
};
```



### COMMIT

用来将事务写入数据库。

```mysql
COMMIT [TRANSACTION];
```



### CREATE INDEX

在一个或多个列上创建索引。

```mysql
CREATE INDEX indexname
ON tablename (colunm, ...);
```



### CREATE PROCEDURE

创建存储过程。

```mysql
CREATE PROCEDURE procedurename [parameters] [options]
AS
SQL statement;
```



### CREATE TALBE

创建新数据库表。

```mysql
CREATE TABLE tablename
{
	column datatype [NULL|NOT NULL] [CONSTRAINTS],
	column datatype [NULL|NOT NULL] [CONSTRAINTS]
};
```



### CREATE VIEW

创建一个或多个表上的新视图。

```mysql
CREATE VIEW viewname AS
SELECT columns, ...
FROM tables, ...
[WHERE ...]
[GROUP BY ...]
[HAVING ...];
```



### DELETE

从表中删除一行或多行。

```mysql
DELETE FROM tablename
[WHERE ...];
```



### DROP

​	永久的删除数据库对象（表、视图、对象）。

```mysql
DROP INDEX|PROCEDURE|TABLE|VIEW
indexname|procedurename|tablename|viewname;
```



### INSERT

为表添加一行。

```mysql
INSERT INTO tablename [(columns, ...)]
VALUES(values, ...);
```



### INSERT SELECT

将 SELECT 结果插入到一个表。

```mysql
INSERT INTO tablename [(columns, ...)]
SELECT columns, ... FROM tablename, ...
[WHERE ...];
```



### ROLLBACK

用于撤销一个事务块。

```mysql
ROLLBACK [TO savepointname];
ROLLBACK TRANSACITON;
```



### SELECT

从一个或多个表（视图）中检索数据。

```mysql
SELECT columnname, ...
FROM table, ...
[WHERE ...]
[UNION ...]
[GROUP BY ...]
[HAVING ...]
[ORDER BY ...];
```



### UPDATE

更新表中的一行或多行。

```mysql
UPDATE tablename
SET colummname = value, ...
[WHERE ...];
```

