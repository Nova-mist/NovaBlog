---
title: MyBatis笔记
date: 2021-11-15 00:37:33
tags:
  - Java
  - SSM
---



<img src="https://raw.githubusercontent.com/Nova-mist/HexoBlogResources/main/images/2021/november/718153f4gy1gw4jq51bbbj20mj0n645d.jpg" alt="718153f4gy1gw4jq51bbbj20mj0n645d" style="zoom: 67%;" />

MyBatis 框架简化了之前学习 JDBC 时的繁琐步骤，更多的专注于配置文件，尤其是 `mybatis-config.xml` 和 `mapper.xml` ，并且也支持注解的形式来进行配置。

<!-- more -->

## 1 Start

### 1.1 准备与参考

**文档** [mybatis – MyBatis 3 | 简介](https://mybatis.org/mybatis-3/zh/index.html)

**获取：**

1.   GitHub
2.   Maven

```xml
<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.7</version>
</dependency>
```

**踩坑：**

一、校园网下一直依赖变红 not found

1.   不使用 IDEA 的 Maven，自己安装并配置一个 Maven（方便修改配置文件和仓库）。[maven安装及配置](https://blog.csdn.net/weixin_43811057/article/details/108235117)

2.   修改配置文件 settings.xml 添加阿里镜像

```xml
<mirror>
    <id>nexus-aliyun</id>
    <mirrorOf>central</mirrorOf>
    <name>Nexus aliyun</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public</url> 
 </mirror>
```

3.   重新导入包

二、**Maven静态资源过滤问题**

会导致一些配置文件在导出时被忽略

**在 build 中配置 resources 防止资源导出失败**

```xml
<build>
    <resources>
       <resource>
           <directory>src/main/java</directory>
           <includes>
               <include>**/*.properties</include>
               <include>**/*.xml</include>
           </includes>
           <filtering>false</filtering>
       </resource>
       <resource>
           <directory>src/main/resources</directory>
           <includes>
               <include>**/*.properties</include>
               <include>**/*.xml</include>
           </includes>
           <filtering>false</filtering>
       </resource>
    </resources>
</build>
```

### 1.2 概念

**MyBatis 是一个 Java 持久层框架。**

MyBatis 框架可以简化数据库的存取，是一个半自动化的ORM（Object Relationship Mapping 对象关系映射）框架。

-   持久化：将数据（内存中的对象）存储在数据库、磁盘文件或XML数据文件等介质中。
-   JDBC、文件IO都属于持久化机制。
-   持久层：完成持久化工作的代码块。类似 DAO（Data Access Object 数据访问对象）层等。
-   **由于要操作数据库持久层应该具有一个较为清晰和严格的逻辑边界**

**优点：**

1.   仅需要配置 sql 映射文件。
2.   sql 写在 xml 文件中，便于统一管理。
3.   将业务逻辑和数据访问逻辑分离。

### 1.3 第一个程序

[狂神说MyBatis01：第一个程序 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247484031&idx=1&sn=948869263f6dd06ccfb494cc5f07c7c4&scene=19#wechat_redirect)

1.   搭建数据库

```mysql
CREATE DATABASE `mybatis`;
USE `mybatis`;
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`(
`id` INT(20) NOT NULL,
`name` VARCHAR(30) DEFAULT NULL,
`pwd` VARCHAR(30) DEFAULT NULL,
PRIMARY KEY(`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
INSERT INTO `user`(`id`,`name`,`pwd`)
VALUES (1,'ysama','123456'),
(2,'张飒','abcdef'),
(3,'李四','987654');
```

2.   导入 Maven 包

```xml
<dependency>
   <groupId>org.mybatis</groupId>
   <artifactId>mybatis</artifactId>
   <version>3.5.2</version>
</dependency>
<dependency>
   <groupId>mysql</groupId>
   <artifactId>mysql-connector-java</artifactId>
   <version>5.1.47</version>
</dependency>
```

3.   MyBatis核心配置文件 mybatis-config.xml

注意连接符 `&` 转义 --> `&amp;`

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
       PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
       "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
   <environments default="development">
       <environment id="development">
           <transactionManager type="JDBC"/>
           <dataSource type="POOLED">
               <property name="driver" value="com.mysql.jdbc.Driver"/>
               <property name="url" value="jdbc:mysql://localhost:3306/mybatis?useSSL=true&amp;useUnicode=true&amp;characterEncoding=utf8"/>
               <property name="username" value="root"/>
               <property name="password" value="123456"/>
           </dataSource>
       </environment>
   </environments>
   <mappers>
       <mapper resource="com/ysama/dao/userMapper.xml"/>
   </mappers>
</configuration>
```

4.   MyBatis工具类
5.   创建实体类
6.   Mapper接口类 等价于DAO

```java
public interface UserDao {
    List<User> getUserList();
}
```

接口实现类由原来的 UserDaoImpl 转变为 Mapper 配置文件

7.   Mapper.xml配置文件

>   namespace、id、resultType、resultMap

8.   测试类

-   使用 junit

-   最好文件结构对应
-   要在 `mybatis-config.xml` 中配置mapper resource 的全路径

pom.xml、工具类、mybatis-config.xml、实体类、接口、Mapper.xml、Test

## 2 Doc

### 2.1 入门

[mybatis – MyBatis 3 | 入门](https://mybatis.org/mybatis-3/zh/getting-started.html)

>   每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实例为核心的。SqlSessionFactory 的实例可以通过 SqlSessionFactoryBuilder 获得。而 SqlSessionFactoryBuilder 则可以从 XML 配置文件或一个预先配置的 Configuration 实例来构建出 SqlSessionFactory 实例。

```java
String resource = "mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

**可以封装进一个工具类**

```java
static {    // ...}public static SqlSession getSession() {    return sqlSessionFactory.openSession();}
```

**从 SqlSessionFactory 中获取 SqlSession**

```java
try (SqlSession session = sqlSessionFactory.openSession()) {    BlogMapper mapper = session.getMapper(BlogMapper.class);    // mapper.method()...    Blog blog = mapper.selectBlog(101);}
```

**映射语句**

1.   XML

```xml
<?xml version="1.0" encoding="UTF-8" ?><!DOCTYPE mapper  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"  "http://mybatis.org/dtd/mybatis-3-mapper.dtd"><mapper namespace="org.mybatis.example.BlogMapper">  <select id="selectBlog" resultType="Blog">    select * from Blog where id = #{id}  </select></mapper>
```

2.   Java 注解

```java
package org.mybatis.example;public interface BlogMapper {  @Select("SELECT * FROM blog WHERE id = #{id}")  Blog selectBlog(int id);}
```

**生命周期**

1.   SqlSessionFactoryBuilder 创建完工厂后就失去了作用，因此是局部方法变量。**方法作用域**
2.   SqlSessionFactory 被创建后一直存在，使用**单例模式**。可以认为 SqlSessionFactory 的生命周期就等同于 MyBatis 的应用周期。**应用作用域** SqlSessionFactory 相当于数据库连接池
3.   SqlSession 就相当于一个数据库连接（Connection 对象），你可以在一个事务里面执行多条 SQL，然后通过它的 commit、rollback 等方法，提交或者回滚事务。**处理完请求就要关闭连接归还给工厂，因此要在 try 块中使用。**

4.   Mapper 相当于一个 Session 中的一个步骤



## 3 CRUD

### 3.1 实现

[狂神说MyBatis02：CRUD操作及配置解析 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247484037&idx=1&sn=cc4bda4e560702e8f7b3e74d3838929f&scene=19#wechat_redirect)

`mapper.xml`

-   namespace包名要和接口一致
-   select 标签
    resultType、id 对应接口方法名、parameterType

**根据 id 查询用户** User getUserById(int id)

```xml
<!--Mapper.xml--><select id="getUserById" resultType="com.ysama.pojo.User">select * from user where id = #{id}</select>
```

**添加用户** int addUser(User user)

```xml
<insert id="addUser" parameterType="com.ysama.pojo.User">    insert into user (id,name,pwd) values (#{id},#{name},#{pwd})</insert>
```

```java
@Testpublic void testAddUser() {   SqlSession session = MybatisUtils.getSession();   UserMapper mapper = session.getMapper(UserMapper.class);   User user = new User(5,"王五","zxcvbn");   int i = mapper.addUser(user);   System.out.println(i);   session.commit(); //提交事务,重点!不写的话不会提交到数据库   session.close();}
```

**修改用户信息** int updateUser(User user)

```xml
<update id="updateUser" parameterType="com.ysama.pojo.User">  update user set name=#{name},pwd=#{pwd} where id = #{id}</update>
```

**根据id删除一个用户** int deleteUser(int id)

```xml
<delete id="deleteUser" parameterType="int">  delete from user where id = #{id}</delete>
```

-   **所有增删改操作都要提交事务 sqlsession.commit()**
-   SQL配置中尽量将Parameter参数和resultType都写上
-   `mybatis-config.xml` 中mapper路径为斜杠

### 3.2 Map

**根据密码和名字查询用户**

-   new User() 并且使用 setter 缺点：需要全部初始化

-   在方法中传递参数 使用@Param 不需要设置 parameterType

```java
//通过密码和名字查询用户User selectUserByNP(@Param("username") String username,@Param("pwd") String pwd);/*   <select id="selectUserByNP" resultType="com.ysama.pojo.User">     select * from user where name = #{username} and pwd = #{pwd}   </select>*/
```

-   在接口方法中参数传递的是Map

```java
// interfaceUser selectUserByNP2(Map<String,Object) map;/*<select id="selectUserByNP2" parameterType="map" resultType="com.kuang.pojo.User">select * from user where name = #{username} and pwd = #{pwd}</select>*/// TestMap<String, Object> map = new HashMap<String,Object>();map.put("username","天理");map.put("pwd","123456");User user = mapper.selectUserByNP2(map);
```

>   Map 传递参数 在 sql 语句中取出 key  parameterType="map"
>
>   对象传递参数 在 sql 语句中取出 属性  parameterType="Object"
>
>   TODO：[How to properly use the @Param annotation of Mybatis - Stack Overflow](https://stackoverflow.com/questions/59668117/how-to-properly-use-the-param-annotation-of-mybatis)

### @Param

@Param注解用于给方法参数起一个名字。

-   在方法只接受一个参数的情况下，可以不使用@Param。
-   在方法接受多个参数的情况下，建议一定要使用@Param注解给参数命名。
-   如果参数是 JavaBean ， 则不能使用@Param。
-   不使用@Param注解时，参数只能有一个，并且是Javabean。

>   #{} 的作用是替换预编译语句（PrepareStatement）中的占位符【推荐】
>
>   ${} 的作用是直接进行字符串替换

### 3.3 模糊查询

```java
// SQL like语句// 方法一String username1= "%李%"; // 通配符List<User> userList = mapper.getUserLike(username1);/*<select id=”getUserLike” parameterType="String" resultType="com.ysama.pojo.User">select * from foo where name like #{name}</select>*/// 方法二 拼接字符串 存在SQL注入漏洞String username2 = "李"List<User> userList = mapper.getUserLike(username2);/*<select id=”getUserLike” parameterType="String" resultType="com.ysama.pojo.User">    select * from foo where bar like "%"#{name}"%"</select>*/
```

**SQL语句中的 #{name} 对应接口方法中定义的参数名称**



## 4 配置

[mybatis – MyBatis 3 | 配置](https://mybatis.org/mybatis-3/zh/configuration.html)

1.   mybatis-config.xml
2.   com.ysama.dao/UserMapper .pojo/User .utils/MybatisUtils
3.   接口 UserMapper的配置文件UserMapper.xml
4.   UserDaoTest

![image-20211106193946007](https://raw.githubusercontent.com/Nova-mist/HexoBlogResources/main/images/2021/october/image-20211106193946007.png)

**元素节点是有顺序的**

### 4.1 environments

通过 default 属性配置多套运行环境

```xml
<environments default="test">    <environment id="development">        <transactionManager type="JDBC">            <property name="..." value="..."/>        </transactionManager>        <dataSource type="POOLED">            <property name="driver" value="${driver}"/>            <property name="url" value="${url}"/>            <property name="username" value="${username}"/>            <property name="password" value="${password}"/>        </dataSource>    </environment>    <enviroment id="test">    	<!-- 另一套环境 -->    </enviroment></environments>
```

-   事务管理器（transactionManager）默认 JDBC

>   Spring + MyBatis，则没有必要配置事务管理器，因为 Spring 模块会使用自带的管理器来覆盖前面的配置。

-   数据源（dataSource）连接数据库 dbcp c3p0 数据源类型默认 POOLED

### 4.2 properties

通过 properties 属性来实现引用配置文件，既可以在 Java 属性文件（db.properties）中配置，也可以通过 properties 子元素传递（可以修改 name 属性）。

**两种方法可以同时存在，并且优先使用外部配置。**

```xml
<properties resource="db.properties">	<!-- 外部配置优先 -->	<property name="pwd" value="33333"/></properties>
```

>   driver=com.mysql.jdbc.Driver
>   url=jdbc:mysql://localhost:3306/mybatis?useSSL=false&useUnicode=true&characterEncoding=utf8
>   username=ysama
>   pwd=123456

### 4.3 mappers

映射器 : 定义映射SQL语句文件

**引入资源方式** mybatis-config.xml

```xml
<!-- 使用相对于类路径的资源引用 --><mappers>  <mapper resource="org/mybatis/builder/AuthorMapper.xml"/></mappers><!-- 使用完全限定资源定位符（URL） --><mappers>  <mapper url="file:///var/mappers/AuthorMapper.xml"/></mappers><!-- 使用映射器接口实现类的完全限定类名 --><mappers>  <mapper class="org.mybatis.builder.AuthorMapper"/></mappers><!-- 将包内的映射器接口实现全部注册为映射器 --><mappers>  <package name="org.mybatis.builder"/></mappers>
```

**使用类、扫描包需要注意：需要配置文件名称和接口名称一致，并且位于同一目录下**

**Mapper文件** mapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?><!DOCTYPE mapper       PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"       "http://mybatis.org/dtd/mybatis-3-mapper.dtd"><mapper namespace="com.kuang.mapper.UserMapper">   </mapper>
```

-   namespace的命名必须跟某个接口同名（包名+类名）
-   接口中的方法与映射文件中sql语句id应该一一对应

### 4.4 类型别名 typeAliases

在 Mapper.xml 中可以使用别名

```xml
<typeAliases>    <typeAlias alias="User" type="com.ysama.pojo.User" /></typeAliases>
```

也可以扫描整个包，默认别名为类名的小写 user（基本类型看文档） 不能起别名

```xml
<typeAliases>	<package name="com.ysama.pojo"/></typeAliases>
```

但可以通过注解来扫描整个包来起别名

```java
@Alias("test")public class User {  ...}
```

### 4.5 其他

设置：

-   cacheEnabled 缓存
-   lazyLoadingEnabled 延迟加载
-   multipleResultSetsEnabled 是否允许单个语句返回多结果集（需要数据库驱动支持）
-   mapUnderscoreToCamelCase 开启驼峰命名自动映射，即从经典数据库列名 A_COLUMN 映射到经典 Java 属性名 aColumn。

类处理器：

-   无论是 MyBatis 在预处理语句（PreparedStatement）中设置一个参数时，还是从结果集中取出一个值时， 都会用类型处理器将获取的值以合适的方式转换成 Java 类型。
-   可以重写类型处理器处理非标准的类型

对象工厂：

-   MyBatis 每次创建结果对象的新实例时，它都会使用一个对象工厂（ObjectFactory）实例来完成。
-   默认的对象工厂只是实例化目标类
-   可以覆盖对象工厂的默认行为创建自己的对象工厂



## 5 ResultMap

[狂神说MyBatis03：ResultMap及分页 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247484043&idx=1&sn=94dbbcbca7ae17c50aa66fd78c8ecaa3&scene=19#wechat_redirect)

[mybatis – MyBatis 3 | XML 映射器](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html#Result_Maps)

**问题：数据库中字段名和实体类中属性名不一致。**

数据库：pwd	User 类：password

>   自动映射：mybatis 中类型处理器会将查询的列名转换为小写（数据库不区分大小写），再去实体类中查找相应的 setter/getter

方法一：使用别名

```xml
<select id="selectUserById" resultType="User">  select id , name , pwd as password from user where id = #{id}    <!-- select * from user where id = #{id} --></select>
```

方法二：使用结果集映射 ResultMap

`mapper.xml`

**只需要映射不对应的列和属性**

```xml
<resultMap id="UserMap" type="User">   <!-- id为主键 -->   <id column="id" property="id"/>   <!-- column是数据库表的列名 , property是对应实体类的属性名 -->   <result column="name" property="name"/>   <result column="pwd" property="password"/></resultMap><!-- 对应resultMap标签的id --><select id="selectUserById" resultMap="UserMap">  select id , name , pwd from user where id = #{id}</select>
```

>   ResultMap 的设计思想是，对简单的语句做到零配置，对于复杂一点的语句，只需要描述语句之间的关系就行了。
>
>   resultType="map" 将所有的列映射到 HashMap 的键上
>
>   resultMap="UserMap"

**TODO：高级结果映射**



## 6 日志分页

### 6.1 日志工厂

-   SLF4J
-   Apache Commons Logging
-   Log4j 2
-   Log4j
-   JDK logging

**标准日志实现**

`mybatis-config.xml` 在 <properties> 和 <environments> 之间

```xml
<settings>       <setting name="logImpl" value="STDOUT_LOGGING"/></settings>
```

**Log4j**

>   可以控制日志信息输送的目的地：控制台，文本，GUI组件
>
>   可以控制每一条日志的输出格式
>
>   可以定义每一条日志信息的级别

1.   导入包

```xml
<dependency>   <groupId>log4j</groupId>   <artifactId>log4j</artifactId>   <version>1.2.17</version></dependency>
```

2.   配置文件 `log4j.properties`

```
# 将等级为DEBUG的日志信息输出到console和file这两个目的地，console和file的定义在下面的代码log4j.rootLogger=DEBUG,console,file# 控制台输出的相关设置log4j.appender.console = org.apache.log4j.ConsoleAppenderlog4j.appender.console.Target = System.outlog4j.appender.console.Threshold=DEBUGlog4j.appender.console.layout = org.apache.log4j.PatternLayoutlog4j.appender.console.layout.ConversionPattern=[%c]-%m%n# 文件输出的相关设置log4j.appender.file = org.apache.log4j.RollingFileAppenderlog4j.appender.file.File=./log/ysama.loglog4j.appender.file.MaxFileSize=10mblog4j.appender.file.Threshold=DEBUGlog4j.appender.file.layout=org.apache.log4j.PatternLayout# 时间前缀log4j.appender.file.layout.ConversionPattern=[%p][%d{yy-MM-dd}][%c]%m%n#日志输出级别log4j.logger.org.mybatis=DEBUGlog4j.logger.java.sql=DEBUGlog4j.logger.java.sql.Statement=DEBUGlog4j.logger.java.sql.ResultSet=DEBUGlog4j.logger.java.sql.PreparedStatement=DEBUG
```

3.   setting设置日志实现

```xml
<settings>   <setting name="logImpl" value="LOG4J"/> <!--注意name开头小写，value没有空格--></settings>
```

4.   Test

```java
// org.apache.log4j.Loggerstatic Logger logger = Logger.getLogger(MyTest.class);@Testpublic void selectUser() {    logger.info("info: 进入selectUser方法");    logger.debug("debug：进入selectUser方法");    logger.error("error: 进入selectUser方法");    SqlSession session = MyBatisUtils.getSession();    UserMapper maper = session.getMapper(UserMapper.class);    List<User> users = mapper.selectUser();   	for (User user: users){	System.out.println(user);  }   	session.close();}
```

### 6.2 分页

>   分页查询：每次处理小部分数据，减低数据库压力。

```mysql
# 语法SELECT * FROM table LIMIT stratIndex，pageSize# pageSize不再接受负数-1SELECT * FROM table LIMIT N # LIMIT 0,N
```

1.   修改Mapper文件

     `mapper.xml` **参数要对应接口中的名字**

```xml
<select id="selectUser" parameterType="map" resultType="user">  select * from user limit #{startIndex},#{pageSize}</select>
```

2.   Mapper 接口，参数使用 map

```java
List<User> selectUser(Map<String,String> map);
```

3.   在测试类中传入参数测试

>   起始位置 =  （当前页面 - 1 ） * 页面大小

```java
//分页查询 , 两个参数startIndex , pageSize@Testpublic void testSelectUser() {   SqlSession session = MybatisUtils.getSession();   UserMapper mapper = session.getMapper(UserMapper.class);   int currentPage = 1;  //第几页   int pageSize = 2;  //每页显示几个   Map<String,Integer> map = new HashMap<String,Integer>();   map.put("startIndex",(currentPage-1)*pageSize);   map.put("pageSize",pageSize);   List<User> users = mapper.selectUser(map);   for (User user: users){       System.out.println(user);  }   session.close();}
```

了解：RowBounds分页

```java
SqlSession session = MybatisUtils.getSession();int currentPage = 2;  //第几页int pageSize = 2;  //每页显示几个RowBounds rowBounds = new RowBounds((currentPage-1)*pageSize,pageSize);//通过session.**方法进行传递rowBounds，[此种方式现在已经不推荐使用了]List<User> users = session.selectList("com.ysama.mapper.UserMapper.getUserByRowBounds", null, rowBounds);
```

了解：分页插件 [PageHelper](https://pagehelper.github.io/)



## 7 注解

### 7.1 使用

[狂神说MyBatis04：使用注解开发 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247484050&idx=1&sn=5f6a6c32da46b952c33dc1cc9f795cf0&scene=19#wechat_redirect)

[mybatis – MyBatis 3 | XML 映射器](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html#)

使用 Java 注解开发，不需要 `mapper.xml` 文件。

>   @Select()
>
>   @Update()
>
>   @Insert()
>
>   @Delete()

1.   接口中添加注解

```java
//查询全部用户@Select("select id,name,pwd as password from user")public List<User> getAllUser();
```

2.   mybatis 核心配置文件中注入

```xml
<!--使用class绑定接口--><mappers>   <mapper class="com.ysama.mapper.UserMapper"/></mappers>
```

3.   测试

**无法通过配置结果映射使用别名，只能在 sql 语句中使用 as**

<img src="https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20211108225806001.png" alt="image-20211108225806001" style="zoom: 67%;" />

![图片](https://raw.githubusercontent.com/Nova-mist/HexoBlogResources/main/images/2021/october/640)

### 7.2 增删改查

MybatisUtils工具类的getSession( ) 方法

```java
// 实现自动提交事务public static SqlSession getSession() {    return getSession(true);}public static SqlSession getSession(boolean flag) {    return sqlSessionFactory.openSession(flag);}
```

```java
// 根据id查询@Select("select * from user where id=#{id}")User selectUserById(@Param("id") int id);// 添加一个用户@Insert("insert into user (id,name,pwd) values (#{id},#{name},#{pwd})")int addUser(User user);// 修改@Update("update user set name=#{name},pwd=#{pwd} where id = #{id}")int updateUser(User user);// 删除@Delete("delete from user where id=#{id}")int deleteUser(@Param("id") int id);
```

### 7.3 Lombok

**简化代码**

1.   IDEA 中安装插件
2.   项目中导入 jar 包
3.   在**实体类**上加注解

>   @Data 无参构造 get set ...
>
>   @AllArgsConstructor
>
>   @NoArgsConstructor
>
>   @ToString
>
>   @Getter
>
>   可以放在类名上，也可以放在变量上。

-   通过注解的形式自动生成构造器
-   不支持多种参数构造器的重载

## 8 复杂查询环境

### 8.1 多对一

数据库设计：多个学生对应一个老师。

```mysql
CREATE TABLE `teacher` (`id` INT(10) NOT NULL,`name` VARCHAR(30) DEFAULT NULL,PRIMARY KEY (`id`)) ENGINE=INNODB DEFAULT CHARSET=utf8INSERT INTO teacher(`id`, `name`) VALUES (1, '秦老师');CREATE TABLE `student` (`id` INT(10) NOT NULL,`name` VARCHAR(30) DEFAULT NULL,`tid` INT(10) DEFAULT NULL,PRIMARY KEY (`id`),KEY `fktid` (`tid`),CONSTRAINT `fktid` FOREIGN KEY (`tid`) REFERENCES `teacher` (`id`)) ENGINE=INNODB DEFAULT CHARSET=utf8INSERT INTO `student` (`id`, `name`, `tid`) VALUES ('1', '小明', '1');INSERT INTO `student` (`id`, `name`, `tid`) VALUES ('2', '小红', '1');INSERT INTO `student` (`id`, `name`, `tid`) VALUES ('3', '小张', '1');INSERT INTO `student` (`id`, `name`, `tid`) VALUES ('4', '小李', '1');INSERT INTO `student` (`id`, `name`, `tid`) VALUES ('5', '小王', '1');
```

**使用了 Lombok**

**项目结构**

-   pojo/Teacher、Student
-   dao/TeacherMapper、StudentMapper
-   resources/com/ysama/dao/TeacherMapper.xml StudentMapper.xml

>   应用：查询所有的学生信息，以及对应的老师的信息。

```mysql
# 子查询SELECT id,NAME,tid FROM student WHERE tid IN (SELECT id FROM teacher)# 联表查询SELECT s.id sid,s.name sname,t.name tname FROM student s,teacher t WHERE s.tid = t.id;
```

==**都是在 Mapper.xml 文件中**==

**按查询嵌套处理**

类似 SQL 中的子查询

1.   获取所有 student 的信息
2.   根据结果中的 teacher ID获取 teacher 的信息
3.   使用结果集映射 resultMap

```xml
<select id="getStudents" resultMap="StudentTeacher">    select * from student</select><resultMap id="StudentTeacher" type="Student">    <!--association关联属性 property属性名 javaType属性类型 column在多的一方的表中的列名-->    <association property="teacher"  column="tid" javaType="Teacher" select="getTeacher"/></resultMap><select id="getTeacher" resultType="teacher">      select * from teacher where id = #{id}</select>
```

**多参数传递**

>    column="{key=value,key=value}"
>
>    使用键值对的形式 key是传给下个sql的取值名称，value是片段一中sql查询的字段名

```xml
<resultMap id="StudentTeacher" type="Student">   <!--association关联属性 property属性名 javaType属性类型 column在多的一方的表中的列名-->   <association property="teacher"  column="{id=tid,name=tid}" javaType="Teacher" select="getTeacher"/></resultMap><select id="getTeacher" resultType="teacher">  select * from teacher where id = #{id} and name = #{name}</select>
```

**按结果嵌套处理【推荐】**

类似 SQL 中的联表查询

```xml
<select id="getStudents2" resultMap="StudentTeacher2" >  select s.id sid, s.name sname , t.name tname  from student s,teacher t  where s.tid = t.id</select><resultMap id="StudentTeacher2" type="Student">   <id property="id" column="sid"/>   <result property="name" column="sname"/>   <!--关联对象property 关联对象在Student实体类中的属性-->   <association property="teacher" javaType="Teacher">       <result property="name" column="tname"/>   </association></resultMap>
```

### 8.2 一对多

数据库设计：一个老师拥有多个学生。

**按查询嵌套处理**

```xml
<select id="getTeacher2" resultMap="TeacherStudent2">select * from teacher where id = #{id}</select><resultMap id="TeacherStudent2" type="Teacher">   <!--column是一对多的外键 , 写的是一的主键的列名-->   <collection property="students" javaType="ArrayList" ofType="Student" column="id" select="getStudentByTeacherId"/></resultMap><select id="getStudentByTeacherId" resultType="Student">  select * from student where tid = #{id}</select>
```

```java
SqlSession session = MybatisUtils.getSession();TeacherMapper mapper = session.getMapper(TeacherMapper.class);Teacher teacher = mapper.getTeacher2(1);System.out.println(teacher.getName());System.out.println(teacher.getStudents());
```

**按结果嵌套处理 【推荐】**

1. 从学生表和老师表中查出学生id，学生姓名，老师姓名

2. 对查询出来的操作做结果集映射

    JavaType是用来指定pojo中属性的类型

    ofType指定的是映射到list集合属性中pojo的类型

```xml
<select id="getTeacher" resultMap="TeacherStudent">      select s.id sid, s.name sname , t.name tname, t.id tid      from student s,teacher t      where s.tid = t.id and t.id=#{id}   </select>   <resultMap id="TeacherStudent" type="Teacher">       <result  property="name" column="tname"/>       <collection property="students" ofType="Student">           <result property="id" column="sid" />           <result property="name" column="sname" />           <result property="tid" column="tid" />       </collection>   </resultMap>
```

### 8.3 总结

>   关联-association 用于一对一和多对一
>
>   集合-collection 用于一对多的关系



## 9 动态SQL

### 9.1 搭建环境

[狂神说MyBatis06：动态SQL (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247484074&idx=1&sn=dcd6f776fb44e116fdeff981f4d9c99c&scene=19#wechat_redirect)

[mybatis – MyBatis 3 | 动态 SQL](https://mybatis.org/mybatis-3/zh/dynamic-sql.html)

>   根据不同的条件生成不同的SQL语句

**示例：博客的创建**

```mysql
CREATE TABLE `blog` (`id` varchar(50) NOT NULL COMMENT '博客id',`title` varchar(100) NOT NULL COMMENT '博客标题',`author` varchar(30) NOT NULL COMMENT '博客作者',`create_time` datetime NOT NULL COMMENT '创建时间',`views` int(30) NOT NULL COMMENT '浏览量') ENGINE=InnoDB DEFAULT CHARSET=utf8
```

1.   新建项目（mapper、pojo、utils） **单独项目引入依赖**

2.   工具类 IDutil 

```java
public class IDUtil {   public static String genId(){       return UUID.randomUUID().toString().replaceAll("-","");  }}
```

3.   实体类 Blog
4.   接口 BlogMapper 和 xml 文件
5.   配置 mybatis-config.xml 下划线驼峰自动转换 （注意引入db.properties）

```xml
<properties resource="db.properties">    <property name="password" value="123456"/></properties><settings>    <setting name="mapUnderscoreToCamelCase" value="true"/>    <setting name="logImpl" value="STDOUT_LOGGING"/></settings><typeAliases>    <typeAlias type="com.ysama.pojo.Blog" alias="Blog"/></typeAliases><!--注册Mapper.xml--><mappers>    <mapper resource="mapper/BlogMapper.xml"/></mappers>
```

6.   插入初始数据

编写接口

```
//新增一个博客int addBlog(Blog blog);
```

sql配置文件

```
<insert id="addBlog" parameterType="blog">  insert into blog (id, title, author, create_time, views)  values (#{id},#{title},#{author},#{createTime},#{views});</insert>
```

初始化博客方法

```java
Blog blog = new Blog();blog.setIdI(IDUtil.genId());// setTitle author createTime viewsmapper.addBlog(blog);// setId setTitle ...
```

**自动提交的设置**

```java
// 方法一：在test中手动加入sqlSession.commit();// 方法二：修改MybatisUtils工具类实现自动提交public static SqlSession getSession(boolean flag){    return sqlSessionFactory.openSession(flag);}public static SqlSession getSession() {    return getSession(true); // 事务自动提交}
```

### 9.2 If 语句

接口类

```java
List<Blog> queryBlogIf(Map map);
```

mapper.xml

```xml
<select id="queryBlogIf" parameterType="map" resultType="Blog">    select * from blog where 1=1    <if test="title!=null">        and title like "%"#{title}"%"        --             存在sql注入    </if>    <if test="author!=null">        and author = #{author}    </if></select>
```

test

```java
HashMap<String, String> map = new HashMap<String, String>();map.put("title","Mybatis如此简单");map.put("author","狂神说");List<Blog> blogs = mapper.queryBlogIf(map);
```

### 9.3 Where

```xml
<select id="queryBlogIf" parameterType="map" resultType="Blog">    select * from blog    <where>        <if test="title!=null">            title like "%"#{title}"%"            -- 存在sql注入        </if>        <if test="author!=null">            and author = #{author}        </if>    </where></select>
```

-   标签中有返回值则插入一个where
-   自动去除第一个子语句的 and、or
-   **不能自动添加第二个语句的and、or**

**等价语句**

```xml
<trim prefix="WHERE" prefixOverrides="AND |OR ">  ...</trim>
```

### 9.4 choose

类似于 switch 语句，从多个条件中选择一个使用。

```xml
<select id="queryBlogChoose" parameterType="map" resultType="blog">  select * from blog   <where>       <choose>           <when test="title != null">                title = #{title}           </when>           <when test="author != null">              and author = #{author}           </when>           <otherwise>              and views = #{views}           </otherwise>       </choose>   </where></select>
```

### 9.5 Set

在进行更新操作时，含有set关键词。**可以删除末尾多余的逗号**

```xml
<update id="updateBlog" parameterType="map">    update blog    <set>        <if test="title != null">            title = #{title},        </if>        <if test="author != null">            author = #{author}        </if>    </set>    where id = #{id};</update>
```

**等价语句**

```xml
<trim prefix="SET" suffixOverrides=",">  ...</trim>
```

### 9.6 SQL片段

mapper.xml

```xml
<sql id="if-title-author">  <if test="title != null">      title = #{title}  </if>  <if test="author != null">      and author = #{author}  </if></sql>
```

**引用SQL片段**

```xml
<select id="queryBlogIf" parameterType="map" resultType="blog">  select * from blog  <where>    <include refid="if-title-author"/>  </where></select>
```

-   最好基于 单表来定义 sql 片段，提高片段的可重用性
-   在 sql 片段中不要包括 where

### 9.7 foreach

>   动态 SQL 的另一个常见使用场景是对集合进行遍历（尤其是在构建 IN 条件语句的时候）。

-   指定一个集合，声明可以在元素体内使用的集合项（item）和索引（index）变量
-   指定开头（open）与结尾（close）的字符串以及集合项迭代之间的分隔符（separator）
-   当使用可迭代对象或者数组时，index 是当前迭代的序号，item 的值是本次迭代获取到的元素。当使用 Map 对象（或者 Map.Entry 对象的集合）时，index 是键，item 是值。
-   **collection 指定输入对象中的集合属性**

```xml
<!-- select * from blog where 1=1 and (id=1 or id=2 or id=3) -->
```

```xml
<select id="queryBlogForeach" parameterType="map" resultType="Blog">    select * from blog    <where>        <foreach collection="ids" index="id"                 open="and (" close=")" separator="or">            id=#{id}        </foreach>    </where></select>
```

```java
HashMap map = new HashMap();List<Integer> ids = new ArrayList<>();ids.add(1);ids.add(2);ids.add(3);map.put("ids",ids);List<Blog> blogs = mapper.queryBlogForeach(map);System.out.println(blogs);
```



## 10 缓存

[mybatis – MyBatis 3 | XML 映射器](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html#cache)

>   缓存：存在内存中的临时数据。
>
>   从缓存中查询可以提高查询效率，解决高并发系统的性能问题。
>
>   **值得缓存的数据：经常查询并且不经常改变的数据。**

MyBatis 系统中默认定义两级缓存：

-   一级缓存（SqlSession 级别，本地缓存）默认开启，无法关闭。
-   二级缓存（namespace 级别，全局缓存）需要手动开启和配置。也可以通过实现 Cache 接口来自定义二级缓存。

### 10.1 一级缓存

>   与数据库同一次会话期间查询到的数据会放在本地缓存中。相当于一个map
>
>   以后如果需要获取相同的数据，直接从缓存中拿，没必须再去查询数据库；

**一级缓存失效的四种情况：**还要再向数据库中发起一次查询请求

1.   SqlSession 不同（每个SqlSession 中的缓存相互独立）
2.   查询条件不同
3.   两次查询之间执行了增删改操作
4.   手动清除了一级缓存 `session.clearCache()`

---

### 10.2 二级缓存

>   一个会话查询一条数据，存储在当前会话一级缓存中。
>
>   会话提交或关闭，一级缓存更新或清除，如果开启二级缓存则保存一级缓存中的数据，供新的会话查询信息。

不同的mapper查出的数据会放在自己对应的缓存（map）中

**使用：**

1.   开启全局缓存 【mybatis-config.xml】

     ```
     <setting name="cacheEnabled" value="true"/>
     ```

2.   在每个 mapper.xml 中配置使用二级缓存。

     ```xml
     <cache/>
     ```

     查看官方文档。

3.   自定义缓存：mapper.xml

     ```xml
     <cache type="com.ysama.xxxx.CustomCache"/>
     ```

     同样的方法使用第三方缓存实现 EhCache



