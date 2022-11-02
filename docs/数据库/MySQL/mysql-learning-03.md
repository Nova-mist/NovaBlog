---
title: mysql学习03——书的内容
date: 2021-07-07 20:26:30
tags:
  - mysql
---

一下子剩下的都写上来了。但基本上都是copy书上的内容吧。(。_。)

<!-- more -->



## 检索数据

### 检索不同的值

```mysql
SELECT DISTINCT vend_id FROM Products;
-- 作用于所有的列 vend_id, prod_price 联合条件令每一行都不同
```

### 限制结果

第一个被检索的行是 **第0行**

```mysql
SELECT prod_name FROM Products LIMIT 5 OFFSET 2;
-- 从第2行起的5行数据
-- 简写 LIMIT 2,5
-- MySQL MariaDB SQLite
-- 另外的不同的DBMS有着不同的写法 SQL Server Access Oracle
```



## 排序检索数据

> 数据库设计理论认为：如果不规定排序顺序，不应该假定检索出的数据的顺序有任何意义。

```mysql
SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY prod_price, prod_name;
-- 先按价格排序再按姓名排序
```

### 按列位置排序

```mysql
SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY 2, 3;
-- 同上
```

### 指定方向排序

```mysql
SELECT prod_id, prod_price, prod_name
FROM Products
ORDER BY prod_price ASC;
-- 默认升序ASC | 降序DESC
-- 在多个列上降序排序，必须对每一列指定 DESC 关键字
```

### 过滤数据

```mysql
SELECT prod_name, prod_price
FROM Products
WHERE prod_price = 3.49;
```

> 操作符
>
> = 等于 <> != 不等于  >= 大于等于
>
> !> 不大于  BETWEEN AND 在指定的两个值之间  IS NULL



## 高级数据过滤

关键字 AND OR

AND优先级更大 `WHERE (vend_id = 'DLL01' OR vend_id = 'BRS01') AND prod_price >= 10`

IN 操作符相当于 OR  `WHERE vend_id IN ('DLL01', 'BRS01') AND prod_price >= 10`

NOT 关键字 用来否定 IN BETWEEN EXISTS 子句



## 通配符

```mysql
SELECT prod_id, prod_name
FROM Products
WHERE prod_name LIKE 'Fish%';
-- %表示任何字符出现任意次数
-- WHERE email LIKE b%@forta.com
-- _ 匹配单个字符
-- [] 指定字符集 [^AB]
```



## 计算字段

### 拼接字段

有的使用 + 有的使用 ||  

```mysql
-- MySQL MariaDB
SELECT Concat(vend_name,' (', TRIM(vend_country),')')
FROM vendors
ORDER BY vend_name;
```

`LTRIM()` `TRIM()` 去掉空格

### 使用别名

`SELECT Concat(vend_name,' (', TRIM(vend_country),')') AS vend_title`

### 计算

```mysql
SELECT prod_id, quantity, item_price, quantity*item_price AS expanded_price
FROM OrderItems
WHERE order_num = 20008;
```

```mysql
-- 简单计算
SELECT 3*2;
SELECT Trim(' abc ');
SELECT Now();
```



## 使用函数

### 文本处理

> LEFT() 返回字符串左边的字符 RIGHT()
>
> LENGTH() 长度
>
> LOWER() UPPER() 小写 大写
>
> LTRIM() RTRIM() 去掉左右的的空格

### 日期和时间处理

每种 DBMS 都有自己的特殊形式。**查阅相关文档**

```mysql
SELECT order_num
FROM Orders
WHERE year(order_date) = 2012;
```

### 数值处理

> ABS( )
>
> EXP( )
>
> SQRT( ) 平方根
>
> AVG( ) 返回某列的平均值
>
> COUNT( ) 返回某列的行数 COUNT(*) COUNT(cust_email)
>
> MAX( ) 返回某列的最大值
>
> MIN( ) 返回某列的最小值
>
> SUM( ) 列的和

```mysql
-- 只处理不同的值
SELECT AVG(DISTINCT prod_price) AS avg_price
FROM Products
WHERE vend_id = 'DLL01';
-- DISTINCT 只是用列名
```

```mysql
SELECT COUNT(*) AS num_items,
MIN(prod_price) AS price_min,
MAX(prod_price) AS price_max,
AVG(prod_price) AS price_avg
FROM Products;
```



## 分组数据

用来汇总表内容的子集。

```mysql
SELECT vend_id, COUNT(*) AS num_prods
FROM Products
GROUP BY vend_id;
-- 返回每个供应商提供的产品数目
```

HAVING 过滤分组 支持所有的 WHERE 操作符

**WHERE 在数据分组前进行过滤， HAVING 在数据分组后进行过滤**

HAVING 基于分组聚集值，经常与 GROUP BY 搭配

```mysql
SELECT vend_id, COUNT(*) AS num_prods
FROM Products
WHERE prod_price >= 4
GROUP BY vend_id
HAVING COUNT(*) >= 2;
```



## 使用子查询

```mysql
SELECT cust_name, cust_contact
FROM Customers
WHERE cust_id IN (SELECT cust_id
                 FROM Orders
                 WHERE order_num IN (SELECT order_num
                                    FROM OrderItems
                                    WHERE prod_id = 'RGAN01'));
```

由货物 id 查询订单编号，进而查询顾客 id，进而查询顾客信息。

```mysql
-- 使用联结
SELECT cust_name, cust_contact
FROM Customers, Orders, OrderItems
WHERE Customers.cust_id = Orders.cust_id
AND OrderItems.order_num = Orders.order_num
AND prod_id = 'RGAN01';
```



### 作为计算字段使用子查询

```mysql
SELECT cust_name, cust_state,
(SELECT COUNT(*)
FROM Orders
WHERE Orders.cust_id = Customers.cust_id) AS orders
FROM Customers
ORDER BY cust_name;
```



## 联结表

> 相关的数据最好不要出现多次。
>
> 关系表的设计是要把信息分解成多个表，一类数据一个表。各表通过某些共同的值互相关联。

主键 primary key

**如果数据存储在多个表中，使用联结（join）可以用一条 SELECT 语句就检索出数据。**

### 创建联结

等值联结 / 内联结 INNER JOIN ON

```mysql
SELECT vend_name, prod_name, prod_price
FROM Vendors, Products
WHERE Vendors.vend_id = Products.vend_id;
-- WHERE 子句作为过滤条件 只包含联结条件的行 是必要的
-- 第一个表中的每一行与第二个表中的每一个行配对
SELECT vend_name, prod_name, prod_price
FROM Vendors INNER JOIN Products
ON Vendors.vend_id = Products.vend_id;
```

### 联结多个表

```mysql
SELECT prod_name, vend_name, prod_price, quantity
FROM OrderItems, Products, Vendors
WHERE Product.vend_id = Vendors.vend_id
AND OrderItems.prod_id = Products.prod_id
AND order_num = 20007;
```

> 不要联结不必要的表，联结的表越多，性能下降的越厉害。

**可以使用联结查询来替换子查询。**



## 创建高级联结

### 使用表别名

```mysql
SELECT cust_name, cust_contact
FROM customers AS C, Orders AS O, OrderItems AS OI
WHERE C.cust_id = O.cust_id
AND OI.order_num = O.order_num
AND prod_id = 'RGAN01';
```

### 使用不同类型的联结

- 内联结 / 等值联结
- 自联结 self-join
- 自然联结 natural join
- 外联结 outer join

自联结：能在一条 SELECT 语句中不止一次引用相同的表。

> 自联结通常作为外部语句，用来替代从相同表中检索数据的使用子查询语句。

```mysql
SELECT c1.cust_id, c1.cust_name, c1.cust_contact
FROM Customers AS c1, Customers AS c2
WHERE c1.cust_name = c2.cust_name
AND c2.cust_contact = 'Jim Jones';
```

自然联结：每一个列只出现一次。

外联结：包含在相关表中没有关联行的行。

```mysql
SELECT Customers.cust_id, Orders.order_num
FROM Customers INNER JOIN Orders
ON Customers.cust_id = Orders.cust_id;
-- 两个表中都有 SELECT 的值时，要指定表，否则会有歧义
```

LEFT OUTER JOIN 从FROM子句左边的表中选择所有行。

RIGHT OUTER JOIN 从FROM子句右边的表中选择所有行。

### 使用带聚集函数的联结

```mysql
SELECT Customers.cust_id
COUNT(Orders.order_num) AS num_ord
FROM Customers INNER JOIN Orders
ON Customers.cust_id = Orders.cust_id
GROUP BY Customers.cust_id;
```



## 组合查询

UNION

将多个查询结果合并，但是每个查询必须包含相同的列。

默认去除重复的行，使用 `UNION ALL` 返回所有的匹配行。

**只允许在末尾使用 ORDER BY**

```mysql
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_state IN ('IL', 'IN', 'MI')
UNION
SELECT cust_name, cust_contact, cust_email
FROM Customers
WHERE cust_name = 'Fun4All'
ORDER BY cust_name, cust_contact;
```



## 插入数据

### 插入完整的行

**INSERT**

```mysql
-- 不安全
/*
INSERT INTO Customers
VALUES('1000006',
      'Toy Land',
      'hhhh',
      NULL);
*/
INSERT INTO Customers(cust_id,
                     cust_name,
                     cust_other)
VALUES('20000',
      'Toy Land',
      NULL)
-- 优点：语句不受表的结构改变而影响
```

### 插入部分行

省略列：该列定义为允许 NULL 或给出了默认值。

### 插入检索出的数据

可以插入多行，可以包含 WHERE 子句，过滤插入的数据。

```mysql
INSERT INTO Customers(cust_id,
                     cust_name,
                     cust_other)
-- 这里的列名可以不同 但要一一对应
SELECT cust_id,
cust_name,
cust_other
FROM CustNew;
```

### 从一个表复制到一个表

```mysql
-- 可以复制部分列
CREATE TALBE CustCopy AS
SELECT * FROM Customers;
```



## 更新和删除数据

### 更新行/删除列

```mysql
UPDATE Customers
SET cust_contact = 'Sam Roberts',
cust_email = 'sam@toyland.com'
WHERE cust_id = '100006'; -- 如果不加 WHERE限制 会更新所有行
-- 删除某个列的值
-- SET cust_email = NULL
```

还可以在 `UPDATE` 语句中使用子查询

### 删除行

```mysql
DELETE FROM Customers
WHERE cust_id = '100006';
```



## 创建和操纵表

### 创建表

```mysql
CREATE TABLE OrderItems
(
    order_num INTEGER NOT NULL,
    order_item INTEGER NOT NULL,
    prod_id CHAR(10) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    item_price DECIMAL(8,2) NOT NULL
);
```

### 更新表

```mysql
ALTER TABLE Vendors
ADD vend_phone CHAR(20);
ALTER TABLE Vendors
DROP COLUMN vend_phone;
```

### 删除表

```mysql
DROP TABLE CustCopy;
```

通常会禁止删除与其他表相关联的表。



## 使用视图

视图不包含任何列或数据，是一个虚拟表，包含一个查询。**封装思想**

- **简化操作、便于复用**
- 使用表的一部分而不是整个表

### 创建视图

CREATE VIEW

更新视图必须先删除再重新创建 DROP VIEW viewname

```mysql
CREATE VIEW ProductCustomers AS
SELECT cust_name, cust_contact, prod_id
FROM Customers, Orders, OrderItems
WHERE Customers.cust_id = Orders.cust_id
AND OrderItems.order_num = Orders.order_num;

SELECT cust_name, cust_contact
FROM ProductCustomers
WHERE prod_id = 'RGAN01';
```

### 应用视图

```mysql
CREATE VIEW VendorLocations AS
SELECT Concat(RTRIM(vend_name),' (',RTRIM(vend_country),")") AS vend_title
FROM Vendors;

SELECT *
FROM VendorLocations;
```

### 过滤不想要的数据

```mysql
CREATE VIEW CustomerEMailList AS
SELECT cust_id, cust_name, cust_email
FROM Customers
WHERE cust_email IS NOT NULL;
-- 排除没有电子邮件地址的用户
SELECT *
FROM CustomerEMailList;
```

### 视图与计算字段

```mysql
CREATE VIEW OrderItemsExpanded AS
SELECT order_num,
prod_id,
quantity,
item_price,
quantity*item_price AS expanded_price
FROM OrderItems;

SELECT *
FROM OrderItemsExpanded
WHERE order_num = 20008;
```



## 存储过程

为以后使用而保存的一条或多条SQL语句。

**简单、安全、高效。**

### 执行存储过程

EXECUTE

## 管理事务处理

- 事务（transaction）一组 SQL 语句
- 回退（rollback）撤销指定 SQL 语句的过程
- 提交（commit）将未存储的SQL语句结果写入数据库
- 保留点（savepoint）事务处理中设置的临时占位符，可以对它发布回退。

```mysql
START TRANSACTION
DELETE FROM Orders;
ROLLBACK;
COMMIT TRANSACTION

SAVEPOINT delete1;
ROLLBACK TO delete1;
```

**保留点越多越好**

## 游标

游标用来在检索出来的行中前进或后退一行或多行。

游标（cursor）是一个存储在 DBMS 服务器上的数据库查询，不是一条 SELECT 语句，而是被该语句检索出来的结果集。

在存储了游标之后，应用程序可以根据需要滚动或浏览其中的数据。