---
title: mysql学习01——配置环境
date: 2021-06-20 20:37:26
tags:
  - mysql
---

<img src="https://raw.githubusercontent.com/Nova-mist/HexoBlogResources/main/images/2021/Julykisspng-mysql-database-web-development-computer-icons-mysql-5b2cc2f3399385.0469886115296601472359.png" alt="kisspng-mysql-database-web-development-computer-icons-mysql-5b2cc2f3399385.0469886115296601472359" style="zoom: 67%;" />

之前有在[菜鸟教程](https://www.runoob.com/mysql/mysql-tutorial.html)看过一点 mysql 的知识，现在有些遗忘了，这次慢慢花时间复习一下，搭配着看看书《SQL必知必会》。顺便整理和完善一下之前的笔记。

## 安装

[MySQL的安装与配置——详细教程 - Winton-H - 博客园 (cnblogs.com)](https://www.cnblogs.com/winton-nfs/p/11524007.html)

1. 将 `MySQL Community Server` 免安装版的包解压到**纯英文目录**，管理员模式打开命令行。

```bash
# 安装 记住初始化密码
mysqld --install
# 初始化
mysqld --initialize --console
# 开启服务
net start mysql
# 关闭服务
net stop mysql
# 登陆
mysql -u root -p # 输入密码
# Enter PassWord
 
# 标记删除 Windows系统的 mysql 服务 慎用
# sc delete mysql
# exit / quit
```

2. 设置全局变量 （Win + Pause）

<img src="https://i.loli.net/2021/03/08/eCEVBMGPXopdn9c.png" alt="Snipaste_2021-03-08_09-17-52" style="zoom: 80%;" />

> mysql --> 所在路径
>
> path --> %mysql%\bin

3. 在目录下创建配件配置文件  `my.ini`

> [mysqld]
> character-set-server=utf8mb4
> bind-address=0.0.0.0
> port=3306
> default-storage-engine=INNODB
> [mysql]
> default-character-set=utf8mb4
> [client]
> default-character-set=utf8mb4

 utf8mb4 字符编码可存储4 个字节 (bytes) 支持存储 Emoji 🥰 ; utf8 则可存储 3 bytes

## 修改密码

> 方法一：
>
> mysql> alter user 'root'@'localhost' identified by 'root'; **(by 接着的是密码)**
>
> 方法二：
>
> mysql> set password for username @localhost = password(newpwd);
>
> 方法三：
>
> cmd> mysqladmin -u用户名 -p旧密码 password 新密码
>
> **现任密码：** yangyang

 

## 忘记密码

**如果忘记密码了，也不需要数据，还是重装吧。**😂 

> 删掉 `data` 文件夹 和 `my.ini` 文件

这步骤随便看的，不知道是不是必需步骤。



TODO：能不能像 Linux 一样修改什么配置来重设密码还保存数据？（Linux 我也不会）