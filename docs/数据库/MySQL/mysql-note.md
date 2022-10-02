# mysql-note

## 事务

### 事务的概念

> 事务（Transaction）是一个操作序列。
>
> 这些操作要么都做，要么都不做，是一个不可分割的工作单位。事务通常以BEGIN TRANSACTION开始，以COMMIT或ROLLBACK操作结束
>
> 事务是数据库系统区别于文件系统的重要特性之一。

事务的特性：

- 原子性：事务中包括的所有操作要么都做，要么不做。
- 一致性：事务必须是使数据库从一个一致性状态变到另一个一致性状态。
- 隔离性：一个事务内部的操作及使用的数据对并发的其他事务是隔离的。
- 持久性：事务一旦提交，对数据库的改变是永久的。



### 事务的四种隔离级别

隔离级别越来越高，但是数据库的并发性能越来越差

1. 未提交读
   所有事务都可以看到其他未提交事务的执行结果
   **脏读、不可重复读、幻读**
2. 提交读
   一个事务只能看见已经提交事务所做的改变。
   **不可重复读、幻读**
3. 可重复读
   同一个事务在多次读取同样数据的时候得到的结果相同
   **幻读**
4. 序列化
   用户之间通过一个接一个顺序地执行当前的事务。
   在每个读的数据行上加上共享锁。在此级别，可能出现大量的超时现象和锁竞争。

> MySQL数据库中的InnoDB和Falcon存储引擎通过MVCC（Multi-Version Concurrent Control，多版本并发控制）机制解决了该问题。需要注意的是，**多版本只是解决不可重复读问题**，而加上间隙锁（也就是它这里所谓的并发控制）才解决了幻读问题。



#### 脏读

发顺丰是



### MySQL 中的事务隔离级别

- Read Uncommitted
- Read Committed
- Repeatable Read （默认）
- Serializable

可以设置**系统级别**或**会话级别**的隔离。

查询（Mysql8）

```mysql
SELECT @@transaction_isolation;
SELECT @@global.transaction_isolation;
```

设置（Mysql8）

```mysql
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET GLOBAL TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

> Oracle 中只支持**提交读**和**可串行化**，不存在脏读
>
> 默认级别是**提交读**





## 操作表



插入一列

```mysql
alter table TABLE_NAME add column NEW_COLUMN_NAME varchar(20) not null;

alter table TABLE_NAME add column NEW_COLUMN_NAME varchar(20) not null after COLUMN_NAME;

alter table TABLE_NAME add column NEW_COLUMN_NAME varchar(20) not null first;
```

重置自动递增

```mysql
USE sblog;

ALTER TABLE tag AUTO_INCREMENT = 6;

INSERT INTO tag(title, slug) VALUES('测试2','测试2'), ('测试3','测试3');
```





## 基本类型

[(117条消息) MySQL数据类型_小猪.get的博客-CSDN博客_mysql 数据类型](https://blog.csdn.net/m0_52982868/article/details/123032241)