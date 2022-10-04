---
title: springboot-05
date: 2022-03-14 16:21:17
tags:
  - Java
  - SpringBoot
---



**整合JDBC、整合Druid数据源、整合Mybatis**

<!-- more -->



## 整合JDBC

>   对于数据访问层，无论是 SQL(关系型数据库) 还是 NOSQL(非关系型数据库)，Spring Boot 底层都是采用 Spring Data 的方式进行统一处理。

Spring Data是与Spring Boot / Spring Cloud等项目同层级的。

Sping Data [官网](https://spring.io/projects/spring-data)

数据库相关的启动器starter见 [官方文档](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.build-systems.starters)。

---

### 创建项目 测试数据源

1. **创建新项目springboot-04-data并引入相关依赖**

![image-20220310233137464](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220310233137464.png)

2.   在pom.xml中看到自动导入了JDBC和数据驱动的启动器

     ```xml
     <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-jdbc</artifactId>
     </dependency>
     <dependency>
         <groupId>mysql</groupId>
         <artifactId>mysql-connector-java</artifactId>
         <scope>runtime</scope>
     </dependency>
     ```

3.   创建application.yaml配置文件用来设置连接数据库（可以删掉默认properties文件）

     ```yaml
     spring:
       datasource:
         username: ysama
         password: 123456
         #?serverTimezone=UTC解决时区的报错
         url: jdbc:mysql://localhost:3306/springboot?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
         driver-class-name: com.mysql.cj.jdbc.Driver
     ```

4.   在测试类中进行测试

     ```java
     @SpringBootTest
     class Springboot04DataApplicationTests {
         @Autowired
         DataSource dataSource;
     
         @Test
         void contextLoads() throws SQLException {
             Connection connection = dataSource.getConnection();
             // print test
             System.out.println(connection);
             connection.close();
         }
     }
     ```

     **发现默认配置的数据源是 com.zaxxer.hikari.HikariDataSource**
     在DataSourceAutoConfiguration类中可知自动配置的数据源顺序
     ![image-20220311151350930](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220311151350930.png)

     **可以使用 spring.datasource.type 指定自定义的数据源类型，值为 要使用的连接池实现的完全限定名。**

5.   创建数据库

     ```mysql
     create database `springboot`;
     use `springboot`;
     drop table if exists `employee`;
     create table `employee`(
         `id` int(20) auto_increment,
         `name` varchar(30) default null,
         `email` varchar(100) default null,
         `gender` int(2) default 1,
         `department` int(10) default null,
         `birth` date not null default '2000-10-04',
         primary key (`id`)
     ) engine=innodb default charset=utf8;
     insert into `employee`(`name`,`email`,`gender`,`department`)
     values (
             '天天','1129096152@qq.com',2,255
            );
     ```

### JDBCTemplate

-   使用数据源（com.zaxxer.hikari.HikariDataSource）获取数据库连接（java.sql.Connection），继而可以使用原生的JDBC语句通过connection来操作数据库。
-   MyBatis就是封装了JDBC的第三方数据库操作框架，而Spring本身也有一个对原生JDBC的轻量封装类JdbcTemplate。
-   数据库操作的所有 CRUD 方法都在 JdbcTemplate 中。
-   SpringBoot配置了默认的数据源，也在容器中配置了JDBCTemplate，**只需要手动注入就可以使用（@Autowired）。**
-   JdbcTemplate 的自动配置是依赖 org.springframework.boot.autoconfigure.jdbc 包下的 JdbcTemplateConfiguration 类

**JdbcTemplate主要提供的方法：**

-   execute方法，用来执行SQL语句
-   update方法，用来执行增删改语句；batchUpdate方法用来执行批处理语句。
-   query / queryForXXX，执行查询语句
-   call方法，用于执行存储过程、函数相关语句

**编写controller并测试**

```java
@RestController
@RequestMapping("/jdbc")
public class JdbcController {
    @Autowired
    JdbcTemplate jdbc;

    //查询employee表中所有数据
    //List 中的1个 Map 对应数据库的 1行数据
    //Map 中的 key 对应数据库的字段名，value 对应数据库的字段值
    @GetMapping("/list")
    public List<Map<String, Object>> userList() {
        String sql = "select * from employee";
        List<Map<String, Object>> maps = jdbc.queryForList(sql);
        return maps;
    }

    //新增一个用户
    @GetMapping("/add")
    public String addUser() {
        String sql = "insert into employee(name, email,gender,department,birth)" +
                " values ('狂神说','24736743@qq.com',1,101,'" + new SimpleDateFormat("yyyy-MM-dd").format(new Date()) + "')";
        jdbc.update(sql);
        return "addOk";
    }

    //修改用户信息
    @GetMapping("/update/{id}")
    public String updateUser(@PathVariable("id") int id) {
        String sql = "update employee set name=?, email=? where id =" + id;
        // parameter
        Object[] objects = new Object[2];
        objects[0] = "kk";
        objects[1] = "213456777@163.com";
        jdbc.update(sql,objects);

        return "updateOk";
    }
    //删除用户
    @GetMapping("/delete/{id}")
    public String delUser(@PathVariable("id") int id) {
        String sql = "delete from employee where id=?";
        jdbc.update(sql,id);
        return "deleteOK";
    }
}
```



## 整合Druid

>   Druid 是阿里巴巴开源平台上一个数据库连接池实现，结合了 C3P0、DBCP 等 DB 池的优点，同时加入了日志监控。

https://github.com/alibaba/druid/

### 基本配置参数

[DruidDataSource配置属性列表 · alibaba/druid Wiki (github.com)](https://github.com/alibaba/druid/wiki/DruidDataSource配置属性列表)

SpringBoot默认不注入第三方框架的专有配置属性，所以需要自己绑定。



### 配置数据源

1.   在pom.xml添加Druid数据源依赖

     ```xml
     <!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
     <dependency>
         <groupId>com.alibaba</groupId>
         <artifactId>druid</artifactId>
         <version>1.2.8</version>
     </dependency>
     ```

2.   切换数据源，只需要在末尾添加一句配置

     ```yaml
     spring:
       datasource:
         username: ysama
         password: 123456
         #?serverTimezone=UTC解决时区的报错
         url: jdbc:mysql://localhost:3306/springboot?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
         driver-class-name: com.mysql.cj.jdbc.Driver
         type: com.alibaba.druid.pool.DruidDataSource # 自定义数据源
     ```

3.   在测试类中注入DataSource，获取后输出测试。

     方法见上面整合JDBC的测试。

     最后在输出看到 `com.alibaba.druid.pool.DruidDataSource` 表示成功。

4.   **查看源码，进行详细的配置，如数据源连接初始化大小、最大连接数、等待时间、最小连接数等。**

     ```yaml
     spring:
       datasource:
         username: ysama
         password: 123456
         #?serverTimezone=UTC解决时区的报错
         url: jdbc:mysql://localhost:3306/springboot?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
         driver-class-name: com.mysql.cj.jdbc.Driver
         type: com.alibaba.druid.pool.DruidDataSource # 自定义数据源
     
         #Spring Boot 默认是不注入这些属性值的，需要自己绑定
         #druid 数据源专有配置
         initialSize: 5
         minIdle: 5
         maxActive: 20
         maxWait: 60000
         timeBetweenEvictionRunsMillis: 60000
         minEvictableIdleTimeMillis: 300000
         validationQuery: SELECT 1 FROM DUAL
         testWhileIdle: true
         testOnBorrow: false
         testOnReturn: false
         poolPreparedStatements: true
     
         #配置监控统计拦截的filters，stat:监控统计、log4j：日志记录、wall：防御sql注入
         #如果允许时报错  java.lang.ClassNotFoundException: org.apache.log4j.Priority
         #则导入 log4j 依赖即可，Maven 地址：https://mvnrepository.com/artifact/log4j/log4j
         filters: stat,wall,log4j
         maxPoolPreparedStatementPerConnectionSize: 20
         useGlobalDataSourceStat: true
         connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=500
     ```

5.   导入Log4j依赖

     ```xml
     <!-- https://mvnrepository.com/artifact/log4j/log4j -->
     <dependency>
         <groupId>log4j</groupId>
         <artifactId>log4j</artifactId>
         <version>1.2.17</version>
     </dependency>
     ```

6.   编写DruidConfig类，为DruidDataSource 绑定全局配置文件中的参数，再添加到容器中（以前是SpringBoot自动生成的步骤）。

     ```java
     @Configuration
     public class DruidConfig {
         @ConfigurationProperties(prefix = "spring.datasource")
         @Bean
         public DataSource druidDataSource() {
             return new DruidDataSource();
         }
     }
     ```

7.   在测试类中测试，输出负责配置的生效情况。

     ```java
     @SpringBootTest
     class Springboot04DataApplicationTests {
         @Autowired
         DataSource dataSource;
     
         @Test
         void contextLoads() throws SQLException {
             Connection connection = dataSource.getConnection();
             // print test
             System.out.println(connection);
     
             DruidDataSource druidDataSource = (DruidDataSource) dataSource;
             System.out.println("druidDataSource 数据源最大连接数：" + druidDataSource.getMaxActive());
             System.out.println("druidDataSource 数据源初始化连接数：" + druidDataSource.getInitialSize());
     
             connection.close();
         }
     }
     ```



### 配置Druid数据源监控

Druid 数据源具有监控的功能，并提供了一个 web 界面方便用户查看，访问 http://localhost:8080/druid/login.html

**先在DruidConfig类中配置**

```java
//配置 Druid 监控管理后台的Servlet；
//内置 Servlet 容器时没有web.xml文件，所以使用 Spring Boot 的注册 Servlet 方式
@Bean
public ServletRegistrationBean statViewServlet() {
    ServletRegistrationBean bean = new ServletRegistrationBean(new StatViewServlet(), "/druid/*");

    // 这些参数可以在 com.alibaba.druid.support.http.StatViewServlet 
    // 的父类 com.alibaba.druid.support.http.ResourceServlet 中找到
    Map<String, String> initParams = new HashMap<>();
    initParams.put("loginUsername", "admin"); //后台管理界面的登录账号
    initParams.put("loginPassword", "123456"); //后台管理界面的登录密码

    //后台允许谁可以访问
    //initParams.put("allow", "localhost")：表示只有本机可以访问
    //initParams.put("allow", "")：为空或者为null时，表示允许所有访问
    initParams.put("allow", "");
    //deny：Druid 后台拒绝谁访问
    //initParams.put("kuangshen", "192.168.1.20");表示禁止此ip访问

    //设置初始化参数
    bean.setInitParameters(initParams);
    return bean;
}
```

在监控面板可以查看历史提交的SQL命令等数据。

**配置 Druid web 监控 filter 过滤器（DruidConfig类）**

```java
//配置 Druid 监控 之  web 监控的 filter
//WebStatFilter：用于配置Web和Druid数据源之间的管理关联监控统计
@Bean
public FilterRegistrationBean webStatFilter() {
    FilterRegistrationBean bean = new FilterRegistrationBean();
    bean.setFilter(new WebStatFilter());
    // 参数
    Map<String, String> initParameters = new HashMap<>();
    //exclusions：设置哪些请求进行过滤排除掉，从而不进行统计
    initParameters.put("exclusions", "*.js,*.css,/druid/*,/jdbc/*");

    bean.setInitParameters(initParameters);
    //"/*" 表示过滤所有请求
    bean.setUrlPatterns(Arrays.asList("/*"));
    return bean;
}
```



## 整合Mybatis

### 基础配置

[官方文档 mybatis-spring-boot-autoconfigure – Introduction](http://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)

1.   创建新项目springboot-05-mybatis
     勾选依赖：Lombok / Spring Web / JDBC API / MySQL Driver
     ![image-20220313233652178](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220313233652178.png)

2.   导入mybatis的启动器依赖和Druid数据源依赖

     ```xml
     <!-- https://mvnrepository.com/artifact/org.mybatis.spring.boot/mybatis-spring-boot-starter -->
     <dependency>
         <groupId>org.mybatis.spring.boot</groupId>
         <artifactId>mybatis-spring-boot-starter</artifactId>
         <version>2.2.2</version>
     </dependency>
     
     <!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
     <dependency>
         <groupId>com.alibaba</groupId>
         <artifactId>druid</artifactId>
         <version>1.2.8</version>
     </dependency>
     ```

3.   配置文件application.yaml 也使用Druid数据源

     ```yaml
     spring:
       datasource:
         username: ysama
         password: 123456
         #?serverTimezone=UTC解决时区的报错
         url: jdbc:mysql://localhost:3306/springboot?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
         driver-class-name: com.mysql.cj.jdbc.Driver
     # mybatis配置resultType别名和映射文件路径
     mybatis:
       type-aliases-package: com.ysama.pojo
       mapper-locations: classpath:mybatis/mapper/*.xml
     ```

4.   **测试数据库是否连接成功**

     ```java
     @SpringBootTest
     class Springboot05MybatisApplicationTests {
         @Autowired
         DataSource dataSource;
         @Test
         void contextLoads() throws SQLException {
             System.out.println(dataSource.getClass());
             System.out.println(dataSource.getConnection());
         }
     }
     ```

5.   创建pojo目录实体类Department

     ```java
     @Data
     @NoArgsConstructor
     @AllArgsConstructor
     public class Department {
         private Integer id;
         private String departmentName;
     }
     ```

6.   创建mapper目录的接口DepartmentMapper

     ```java
     @Mapper
     @Repository
     public interface DepartmentMapper {
         // 获取所有部门信息
         List<Department> getDepartments();
         // 通过id查找
         Department getDepartment(Integer id);
     }
     ```

7.   在**resources/mybatis/mapper**目录下创建对应的映射文件DeparMapper.xml
     在 [mybatis 文档](https://mybatis.org/mybatis-3/getting-started.html) 查看格式。

     ```xml
     <?xml version="1.0" encoding="UTF-8" ?>
     <!DOCTYPE mapper
             PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
             "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
     <mapper namespace="com.ysama.mapper.DepartmentMapper">
         <select id="getDepartments" resultType="Department">
             select * from employee;
         </select>
         <select id="getDepartment" resultType="Department" parameterType="integer">
             select * from employee where id = #{id};
         </select>
     </mapper>
     ```

8.   **maven配置资源过滤问题 build标签下** 

     ```xml
     <resources>
         <resource>
             <directory>src/main/java</directory>
             <includes>
                 <include>**/*.xml</include>
             </includes>
             <filtering>true</filtering>
         </resource>
     </resources>
     ```

9.   编写测试类DeparController进行测试

     ```java
     @RestController
     public class DepartmentController {
         @Autowired
         DepartmentMapper departmentMapper;
     
         // 查询全部
         @GetMapping("/getDepartments")
         public List<Department> getDepartments() {
             return departmentMapper.getDepartments();
         }
         // 根据id查询 restful风格
         @GetMapping("/getDepartment/{id}")
         public Department getDepartment(@PathVariable("id") Integer id) {
             return departmentMapper.getDepartment(id);
         }
     }
     ```

     





### 遇到的问题

>   Caused by: java.nio.charset.MalformedInputException: Input length = 1

原因：application.yml文件是通过把其他类型的文件后缀名直接改为yml生成的

**解决方法：新建一个application.yaml**

>   Invalid bound statement (not found)

原因：mapper.xml中的namespace应该对应到具体的类名

![image-20220314153858562](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220314153858562.png)

### 测试增加员工类

**需要先建立一个符合条件的数据库**

1.   新建pojo类Employee

     ```java
     @Data
     @AllArgsConstructor
     @NoArgsConstructor
     public class Employee {
     
         private Integer id;
         private String lastName;
         private String email;
         //1 male, 0 female
         private Integer gender;
         private Integer department;
         private Date birth;
     
         private Department eDepartment; // 冗余设计
     }
     ```

2.   EmployeeMapper接口

     ```java
     //@Mapper : 表示本类是一个 MyBatis 的 Mapper
     @Mapper
     @Repository
     public interface EmployeeMapper {
         // 获取所有员工信息
         List<Employee> getEmployees();
         // 新增一个员工
         int save(Employee employee);
         // 通过id获得员工信息
         Employee get(Integer id);
         // 通过id删除员工
         int delete(Integer id);
     }
     ```

3.   EmployeeMapper.xml 配置文件

     ```xml
     <?xml version="1.0" encoding="UTF-8" ?>
     <!DOCTYPE mapper
             PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
             "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
     
     <mapper namespace="com.ysama.mapper.EmployeeMapper">
     
         <resultMap id="EmployeeMap" type="Employee">
             <id property="id" column="eid"/>
             <result property="lastName" column="last_name"/>
             <result property="email" column="email"/>
             <result property="gender" column="gender"/>
             <result property="birth" column="birth"/>
             <association property="eDepartment"  javaType="Department">
                 <id property="id" column="did"/>
                 <result property="departmentName" column="dname"/>
             </association>
         </resultMap>
     
         <select id="getEmployees" resultMap="EmployeeMap">
             select e.id as eid,last_name,email,gender,birth,d.id as did,d.department_name as dname
             from department d,employee e
             where d.id = e.department
         </select>
     
         <insert id="save" parameterType="Employee">
             insert into employee (last_name,email,gender,department,birth)
             values (#{lastName},#{email},#{gender},#{department},#{birth});
         </insert>
     
         <select id="get" parameterType="int" resultType="Employee">
             select * from employee where id = #{id}
         </select>
     
         <delete id="delete" parameterType="int">
             delete from employee where id = #{id}
         </delete>
     
     </mapper>
     ```

4.   编写EmployeeController类进行测试

     ```java
     @RestController
     public class EmployeeController {
     
         @Autowired
         EmployeeMapper employeeMapper;
     
         // 获取所有员工信息
         @GetMapping("/getEmployees")
         public List<Employee> getEmployees(){
             return employeeMapper.getEmployees();
         }
     
         @GetMapping("/save")
         public int save(){
             Employee employee = new Employee();
             employee.setLastName("kuangshen");
             employee.setEmail("qinjiang@qq.com");
             employee.setGender(1);
             employee.setDepartment(101);
             employee.setBirth(new Date());
             return employeeMapper.save(employee);
         }
     
         // 通过id获得员工信息
         @GetMapping("/get/{id}")
         public Employee get(@PathVariable("id") Integer id){
             return employeeMapper.get(id);
         }
     
         // 通过id删除员工
         @GetMapping("/delete/{id}")
         public int delete(@PathVariable("id") Integer id){
             return employeeMapper.delete(id);
         }
     
     }
     ```


![image-20220314161051150](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220314161051150.png)
