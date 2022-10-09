---
title: SpringBoot 再次笔记
date: 2022-09-27 21:54:00
tags:
  - Spring
---

![blog-image-20220927-1664286990](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202209272156975.jpg)



<!-- more -->

## 参考

- [元动力文档](https://www.ydlclass.com/doc21xnv/frame/springboot/)
- [Spring | Spring Quickstart Guide](https://spring.io/quickstart)
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [springboot-01 | novamist blog (nova-mist.github.io)](https://nova-mist.github.io/2022/03/14/springboot-01/)



## 概述

### Spring

Spring 旨在简化企业级应用的开发流程。

Spring 特点：

- 对象的创建都由 IoC 容器以 Spring Bean 的形式统一创建和管理。
- 通过控制反转（IOC）和面向接口来实现**松耦合**。
- 基于切面（AOP）和惯例进行**声明式编程**。
- 通过切面和模板减少样式代码，xxxTemplate

> 控制反转 IOC / 依赖注入 DI
>
> Class A中用到了Class B的对象b，一般情况下，需要在A的代码中显式的new一个B的对象。
>
> 采用依赖注入技术之后，A的代码只需要定义一个私有的B对象，不需要直接new来获得这个对象，而是通过相关的容器控制程序来将B对象在外部new出来并注入到A类里的引用中。而具体获取的方法、对象被获取时的状态由配置文件（如XML）来指定。

> 面向切面编程 AOP
>
> AOP则是针对业务处理过程中的切面进行提取，它所面对的是处理过程中的某个步骤或阶段，以获得逻辑过程中各部分之间低耦合性的隔离效果。只需要修改相应的 Aspect，再重新编织（weave），就能在逻辑流的切面实现新的功能。

SSM 项目开发过程繁琐：

- 数量很多的 xml 配置文件
- pom.xml 中需要引入众多依赖，**存在版本冲突问题**



### Spring Boot

SpringBoot 是 Spring 的流程简化（并不是功能的增强），涉及微服务架构，核心思想是**约定大于配置**。

> 约定大于配置：配置（n.）能使用默认值就不需要去手动配置（v.）。
>
> 因此大大简化了开发流程。
>
> [何谓 “约定大于配置”_fhspringcloud的技术博客_51CTO博客](https://blog.51cto.com/u_14622073/2781350)

Spring Boot 特点：

- **开箱即用**，提供各种默认配置来简化项目配置
- 内嵌式容器简化Web项目



### 微服务架构

> 微服务架构就是打破之前 *all in one* 的架构方式，把每个功能元素独立出来按需求动态组合。

微服务架构优点：

1. 节省了资源。
2. **模块化**，每个功能元素的服务都是一个可替换、可独立升级的代码。



## HelloSpringBoot

### 创建项目

**Step1** 使用 [Spring Initializr](https://start.spring.io/) Web 页面来创建项目。

- 在线生成一个配置好的初始项目，**注意添加 Spring Web 依赖**。
- 查看 pom.xml 等配置并下载压缩包
- 解压后用IDEA以Maven项目导入【New Project from Existing Sources】。
- 直接可以运行

也可以直接在 IDEA 中新建项目的时候选择 Spring Initializr，注意勾选 **Spring Web** 依赖。

---

**Step2** 编写 Http 接口

- 在主程序的同级目录下新建controller包。**（不在同级识别不到）**

- 新建HelloController类

  ```java
  package com.ysama.demo.controller;
  
  @RestController
  public class HelloController {
      @RequestMapping("/hello")
      public String hello() {
          return "Hello World";
      }
  }
  ```

- 从主程序启动项目，注意查看控制台的Tomcat访问端口号。

- 访问 http://localhost:8080/hello



### 生成 jar 包

点击 maven 界面【Lifecycle】-【package】，将项目打成jar包。在命令行运行后就可以直接访问网页，不依赖IDEA。

**target 目录下**

```bash
java -jar [helloworld].jar
```

🟠最好不要双击打开，否则要用任务管理器关闭。

**微服务就是通过后台运行的一个个接口服务的Jar包来实现的。**

> 修改banner：在resources目录下新建banner.txt即可。



### 问题

**org.springframework.boot 变红**

> Plugin ‘org.springframework.boot:spring-boot-maven-plugin:’ not found

解决方法：加上版本号标签 `<version>`

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>2.6.3</version>
        </plugin>
    </plugins>
</build>
```

**一开始没有添加Web依赖**

解决方法：在pom.xml中添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

**需要更改端口号**

application.properties

```properties
server.port=8081
```



### 项目分析

> spring-boot-starter
>
> spring-boot-starter-test
>
> spring-boot-starter-web

在 pom.xml 中引入的 starter 依赖整合了一套最佳配置，通过**依赖传递**引入各种子依赖，不会存在版本冲突等问题。



## 配置文件

### 配置分类

由于**预定大于配置**的特性，Spring Boot 的很多配置都有默认值，可以通过配置文件来**覆盖**默认属性。

配置文件的格式：

- `application.properties`
- `application.yml`
- `application.yaml`

**优先级依次递减**

不同的写法如下：

properties 文件只能保存键值对

```properties
server.port=8088
```

yaml 文件可以保存对象、数组

```yaml
server:
  port: 8088
```



### yaml 语法

yaml 语法特点：

1. 空格不能省略
2. 用空格缩进控制层级关系（不能使用Tab）
3. 属性和值大小写敏感
4. 使用 `#` 行注释

语法例子

```yaml
# 普通的key-value形式
name: ysama # 可以不加双引号
# 对象
student:
  name: ysama
  age: 22
# 行内写法
student: {name: ysama, age: 3}
# 数组
pets:
  - cat
  - dog
pets: [cat,dog]

server:
  port: 8082
  
# 参数引用
person:
  name: ${name}
  
# 含空格
msg1: 'hello \n world'  # 单引忽略转义字符
msg2: "hello \n world"  # 双引识别转义字符
```



### 读取配置数据

**使用注解注册 bean 并在测试类中自动注入**

@Component, @Qualifier, @Value, @Autowired

通过 `@Value("${val}")` 的形式读取配置中的数据。

```java
// com.ysama.demo.pojo
// Dog.java
@Component
// 限定符
@Qualifier("dog1")
public class Dog {

    @Value("${dog.name}")
    // @Value("我的狗狗OK")
    private String name;
    @Value("4")
    private Integer age;
    @Override
    public String toString() {
        return this.name;
    }
}
```

```java
// test
@SpringBootTest
class DemoApplicationTests {
	// 自动注入狗狗
	@Autowired
	@Qualifier("dog1")
	Dog dog;

	@Test
	void contextLoads() {
		System.out.println(dog);
	}
}
```

**通过 Evironment 类在测试类中直接读取配置**

```java
@Autowired
private Environment env;

System.out.println(env.getProperty("person.name"));

System.out.println(env.getProperty("address[0]"));
```

**使用 @ConfigurationProperties 将配置文件中配置的每一个属性的值，映射到组件中**

```java
@Component //注册bean
@ConfigurationProperties(prefix = "person")
public class Person {
    private String name;
    private Integer age;
    private Boolean happy;
    private Date birth;
    private Map<String,Object> maps;
    private List<Object> lists;
    private Dog dog;
}
```

@PropertySource ：加载指定的配置文件；

@configurationProperties：默认从全局配置文件中获取值；



### JSR303数据校验

[springboot-02 | novamist blog (nova-mist.github.io)](https://nova-mist.github.io/2022/03/14/springboot-02/)



### 配置文件加载顺序

[springboot-02 | novamist blog (nova-mist.github.io)](https://nova-mist.github.io/2022/03/14/springboot-02/)

配置文件 `application.properties` 加载优先级顺序：

1. `file:./config/` 项目路径（与 src 目录平行）
2. `file:./`
3. `classpath:/config` 资源路径 resources 中的 config目录
4. `classpath:/` 就是 resource 目录



> classpath 指的是编译后的项目包中的 classes 目录
>
> src/main/java 目录下的类和 src/main/resources 目录下的配置文件会在编译的时候一起打包到 target 目录下的 classes目录
>
> 🟠如果配置文件要放在 src/main/java  路径就要额外设置 maven **静态资源过滤**
>
> [java项目中的classpath到底是什么 - SegmentFault 思否](https://segmentfault.com/a/1190000015802324)

```java
<build>
		<resources>
			<resource>
				<directory>src/main/java</directory>
				<includes>
					<include>**/*.properties</include>
					<include>**/*.xml</include>
					<include>**/*.yaml</include>
				</includes>
				<filtering>false</filtering>
			</resource>
			<resource>
				<directory>src/main/resources</directory>
				<includes>
					<include>**/*.properties</include>
					<include>**/*.xml</include>
					<include>**/*.yaml</include>
				</includes>
				<filtering>false</filtering>
			</resource>
		</resources>
	</build>
```

---

**高优先级的配置会覆盖低优先级的配置，低优先级独有的配置会保留。**

```properties
# 配置项目的访问路径 http://localhost:8080/myapp/hello
# 高优先的8080会覆盖掉
server.port=8085
server.servlet.context-path=/myapp
```

---

**指定项目的外部配置，覆盖内部配置。**

1.命令行

```cmd
java -jar app.jar --name="Spring" --server.port=9000
```

2.指定配置文件位置

```cmd
 java -jar myproject.jar --spring.config.location=d://application.properties
```

https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config



### 配置环境切换 profile

通过主配置文件来切换不同的环境：

```text
spring.profiles.active=dev
```

-  application-dev.properties/yml 开发环境
-  application-test.properties/yml 测试环境
-  application-pro.properties/yml 生产环境

**不激活的时候是不生效的**

也可以将多个配置写在同一个文件中

```yaml
server:
  port: 8086
#选择要激活那个环境块 不写就是默认port
spring:
  profiles:
    active: prod
---
server:
  port: 8083
spring:
  config:
    activate:
      on-profile: dev
---
server:
  port: 8084
spring:
  config:
    activate:
      on-profile: prod
```

**profile 激活方式**

- 配置文件：spring.profiles.active=dev

- 命令行参数： --spring.profiles.active=dev

  相当于上线时，运行jar包：java -jar xxx.jar --spring.profiles.active=dev

  测试：使用maven 打包此项目，在target包中出现springboot-profiles-0.0.1.jar

  cmd 输入

  ```powershell
  java -jar .\demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
  ```



### 问题

**出现问题报错，但不影响程序运行，添加依赖可修复。**

> Spring Boot Configuration Annotation Processor not configured.

```xml
<!-- 导入配置文件处理器，配置文件进行绑定就会有提示，需要刷新Maven -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-configuration-processor</artifactId>
  <optional>true</optional>
</dependency>
```

**properties文件乱码**

解决方法：Ctrl+Alt+S打开配置，修改文件编码为utf-8。



## 整合框架

### Junit

spring-boot-starter-test 就包含了 junit

直接在测试类中使用 @Test



### MyBatis

1. 新建 springboot 项目
2. 在 pom.xml 中添加额外依赖

```xml
<dependency>
    <!--   注意：不引入此依赖 @Mapper @MapperScan 注解无效-->
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.0</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.13</version>
</dependency>
```

3. 编写 DataSource 和 MyBatis 相关配置
   application.yaml

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/springboot?serverTimezone=UTC
    username: ysama
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
```

application.properties 版本的 url 也是同样的写法，中间的 `&` 需要写成 `&amp;` 是写在 mybatis 的 `xml` 配置文件中才需要。

4. 定义实体类，创建 dao 层和 service 层

```java
// 使用纯注解开发
@Mapper
public interface UserMapper {
    @Select("select distinct name from employee")
    List<String> queryUsers();
}
```

```java
public interface UserService {
    List<String> queryAllUser();
}
```

```java
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserMapper mapper;
    @Override
    public List<String> queryAllUser() {
        return mapper.queryUsers();
    }
}
```

5. 测试

```java
@SpringBootTest
// 如果在此处使用 @MapperScan("com.example.springbootmybatis.mapper") 来扫描
// 就不用在每个 Mapper 类上使用 @Mapper
class SpringbootMybatisApplicationTests {
    @Autowired
    UserService userService;

    @Test
    void contextLoads() {
        System.out.println(userService.queryAllUser());
    }
}
```

[spring-boot 框架整合 MyBatis - SegmentFault 思否](https://segmentfault.com/a/1190000014064512)

**使用 xml 文件版本的 mapper 设置**

```xml-dtd
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.springbootmybatis.mapper.UserMapper">
<!--    resultType 如果是容器要填容器的类型-->
    <select id="queryUsers" resultType="String">
        select distinct name
        from employee
    </select>
</mapper>
```

🟠不同的 xml 路径 mapper-locations 的参数也不同

**最后在 resources 目录下新建一个 mapper 目录放 mapper.xml 文件**

```yaml
mybatis:
  mapper-locations: classpath:/mapper/*
  type-aliases-package: com.example.springbootmybatis.pojo
```

关于资源路径通配符的说明

> resources/mapper/user/UserMapper.xml 对应着 `classpath:conf/*/*` 或者 `classpath:conf/**/*.xml` 任意层目录
>
> 多个路径使用逗号分隔
>
> 如果直接在 resources 目录下可以直接写 UserMapper.xml 或者 classpath:UserMapper.xml 或者  `classpath*:*.xml`
>
> mybatis.mapperLocations: classpath*:mapper/*.xml
> classpath*:读取本模块以及本模块依赖的jar包中的资源
> classpath:只读取本模块的资源



#### 问题

> Could not autowire. No beans of 'BlogServiceImpl' type found.

1. 检查测试类有没有 @SpringBootTest 注解
2. 相应 Mapper 类有没有加 @Mapper 注解，Service 类有没有加 @Service 注解
3. 主启动类是否和 mapper 包、service 包同级
4. 主启动类是否使用了 @ComponentScan 指定了要扫描的包

**这次错误的原因是我更改了 swagger 生成的代码的包名，但没有改主启动类中的包扫描注解。**

```java
@ComponentScan(basePackages = { "io.swagger", "io.swagger.api" , "io.swagger.configuration"})
```





### Redis

#### Add Maven Support

在 Project 目录处右键选择 【Add Frameworks Support】

![image-20220726201659506](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207262017310.png)

#### 搭建简单项目

**学习文档请看：**

- [Data (spring.io)](https://docs.spring.io/spring-boot/docs/current/reference/html/data.html#data.nosql.redis)
- [Spring Data Redis](https://spring.io/projects/spring-data-redis)

1. 创建项目
2. 引入依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

3. 编写测试类

```powershell
@SpringBootTest
class SpringbootRedisApplicationTests {
    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    void testSet() {
        redisTemplate.boundValueOps("name").set("zhangsan");
    }

    @Test
    void testGet() {
        Object name = redisTemplate.boundValueOps("name").get();
        System.out.println(name);
    }
}
```

4. 配置文件 application.yaml

```yaml
spring:
  redis:
    host: 127.0.0.1 # redis的主机ip
    port: 6379
```

5. 启动 redis

```powershell
# 服务段 port:6379
cd "C:\Program Files\Redis"
redis-server.exe redis.windows.conf
# 客户端
redis-cli.exe -h localhost -p 6379
```

> Could not create server TCP listening socket 127.0.0.1:6379: bind

```powershell
cd "C:\Program Files\Redis"
redis-server.exe redis.windows.conf
redis-cli.exe
shutdown
exit
redis-server.exe redis.windows.conf
```

🟠先运行服务端再运行客户端。

6. 测试

RedisTemplate 相当于 JDBC。

[RedisTemplate (Spring Data Redis 2.7.2 API)](https://docs.spring.io/spring-data/redis/docs/current/api/)



#### 问题

> Could not autowire. No beans of 'RedisTemplate' type found.

不影响程序运行。



## Condition

通过实现 Condition 接口并搭配 @Conditional 注解，可以按条件加载响应的 bean。

### Spring 自动创建 bean

**Spring 自动创建 bean 的过程**（引入了 `spring-boot-starter-data-redis` 依赖，已经注入了 Config 类 ）

```java
@SpringBootApplication
public class SpringbootRedisApplication {
    public static void main(String[] args) {
        // 获取 Spring 容器对象
        ConfigurableApplicationContext context = SpringApplication.run(SpringbootRedisApplication.class, args);

        // 获取 bean
        Object redisTemplate = context.getBean("redisTemplate");
        System.out.println(redisTemplate);
    }
```



### **自定义 bean 对象创建**

1. 创建 Pojo 包的实体类 User
2. 创建 Config 包的 UserConfig，并通过 @Bean 注入可以创建实例的方法。

```java
@Configuration
public class UserConfig {
    @Bean
    public User iUser() {
        return new User();
    }
}
```

3. 在测试类中获取容器并返回一个 User 实例。

```java
@SpringBootApplication
public class SpringbootApplication {

	public static void main(String[] args) {
		// 获取Spring容器对象
		ConfigurableApplicationContext context = SpringApplication.run(SpringbootApplication.class, args);

		// 获取bean
		Object user = context.getBean("iUser");
		System.out.println(user);
	}
}
```



### 根据条件创建自定义 bean

1. 创建 condition 包的条件类

```java
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

public class ClassCondition implements Condition {
    @Override
    public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata annotatedTypeMetadata) {
        
        // ...
        
        // 业务逻辑 返回true和false来决定某个bean对象是否生成
        return false;
    }
}
```

2. 在 @Bean 方法上使用 @Conditional 注解用来决定是否注入

```java
@Configuration
public class UserConfig {

    @Bean
    @Conditional(ClassCondition.class)
    public User iUser() {
        return new User();
    }
    
    /**
    * 使用类型来获取bean默认只注入了一个@Bean方法
    * 如果有多个@Bean方法就只能通过变量名称来获取bean对象
    @Bean
    @Conditional(ClassCondition.class)
    public User pUser() {
        return new User("ok2");
    }
    */
}
```

3. 具体的业务逻辑

```java
// 例子 只有引入jedis项目才生成user对象
try {
    Class.forName("redis.clients.jedis.Jedis");
    return true;
} catch (ClassNotFoundException e) {
    return false;
}
```

4. 测试类

```java
@SpringBootApplication
public class SpringbootRedisApplication {
	public static void main(String[] args) {
		// 获取 Spring 容器对象
		ConfigurableApplicationContext context = SpringApplication.run(SpringbootRedisApplication.class, args);

		// 获取 bean
		Object user = context.getBean("iUser");
		// User user = context.getBean(User.class);
		System.out.println(user);
	}
}
```



### 使用自定义 Condition 注解

![image-20220727185651053](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207271856357.png)

1. 自定义注解类

```java
import org.springframework.context.annotation.Conditional;

import java.lang.annotation.*;

// 元注解
@Target({ElementType.TYPE, ElementType.METHOD}) // 决定可以使用的位置
@Retention(RetentionPolicy.RUNTIME) // 其作用的时机
@Documented // 生成javadoc

@Conditional(ClassCondition.class)
public @interface YsamaConditionOnClass {
    String[] value(); // 接收注解参数
}
```

2. 在 ClassCondition 类中通过 metadata 类来获取传入自定义注解的属性，并进行判断。

```java
public class ClassCondition implements Condition {
    @Override
    public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata annotatedTypeMetadata) {
        // 例子 只有引入jedis项目才生成user对象
        // try {
        //     Object o =Class.forName("redis.clients.jedis.Jedis");
        //
        //     System.out.println(o);
        //
        //     return true;
        // } catch (ClassNotFoundException e) {
        //     return false;
        // }
        
        // 动态判断是否已经引入了Config类中使用自定义注解传入的包名
        try {
            Map<String, Object> annotationAttributes = annotatedTypeMetadata.getAnnotationAttributes("com.ysama.springbootredis.condition.YsamaConditionOnClass");

            System.out.println(annotationAttributes);

            String[] list = (String[]) annotationAttributes.get("value");

            for (String s : list) {
                Class.forName(s);
            }

            return true;

        } catch (Exception e) {
            return false;
        }
    }
}
```

3. 在 config 类使用自定义的注解，传入需要检验的包名

```java
@Configuration
public class UserConfig {
    @Bean
    @YsamaConditionOnClass({"redis.clients.jedis.Jedis"})
    public User iUser() {
        return new User("ok");
    }
}
```

**最好使用 Spring 提供的原生注解，都不需要定义 Condition 类。**



### 使用 Condition 包内原生注解

![image-20220727191305301](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207271913751.png)

在 package org.springframework.boot.autoconfigure.condition 可以看到有原生的注解来**判断是否引入了所需包**。

**SpringBoot 提供的常用条件注解：**

ConditionalOnProperty：判断配置文件中是否有对应属性和值才初始化Bean

ConditionalOnClass：判断环境中是否有对应字节码文件才初始化Bean

ConditionalOnMissingBean：判断环境中没有对应Bean才初始化Bean

**在 config 类中直接使用，不需要再额外定义 Condition 类来写判断逻辑。**

```java
@Configuration
public class UserConfig {
    @Bean
    @ConditionalOnClass(name = "redis.clients.jedis.Jedis")
    @ConditionalOnProperty(name = "ysama.state", havingValue = "alive") // yaml配置文件中有此属性
    public User pUser() {
        return new User("ok2");
    }
}
```



### 排除依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <!--排除tomcat依赖-->
        <exclusions>
            <exclusion>
                <artifactId>spring-boot-starter-tomcat</artifactId>
                <groupId>org.springframework.boot</groupId>
            </exclusion>
        </exclusions>
    </dependency>

    <!--引入jetty的依赖-->
    <dependency>
        <artifactId>spring-boot-starter-jetty</artifactId>
        <groupId>org.springframework.boot</groupId>
    </dependency>
</dependencies>
```

排除 tomcat 服务器，切换内置 web 服务器。

---

**源码分析**

在 package org.springframework.boot.autoconfigure.web.embedded 的 `EmbeddedWebServerFactoryCustomizerAutoConfiguration` 类中可以看到也是一个**配置类**。

同样和简单的配置类一样使用了 @Configuration, @Bean 注解，并通过向 @ConditionalOnClass 注解传入**指定的类参数**来控制是否创建响应的 ServerFactoryCustomizer 实例。

![image-20220727182900458](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207271829634.png)



## @Import & Enable

通过创建同一个 Project 下的两个 Module 进行测试，得出结论：**Spring Boot 默认不能自动注入其他包中的 bean**

![image-20220727232039771](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207272320054.png)

原因在于：引导类上的 @SpringBootApplication 注解中的 **@ComponentScan 只扫描当前引导类所在包及其子包。**

![image-20220727230938435](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207272309112.png)

🟢引入其他包的方法：

1. 额外使用注解扫描指定包路径

```java
@ComponentScan("com.ysama.springbootenableother.config")
```

2. 使用 @Import 注解加载类（@EnableAutoConfiguration 底层就是使用了 @Import）
   导入的类会被注册到 Spring IoC 容器

```java
import com.ysama.springbootenableother.config.UserConfig;
@Import(UserConfig.class)
// @Import(com.ysama.springbootenableother.pojo.User.class)
```

3. 封装多个 @Import 到自定义的 EnableUser 注解类

---

🟢@Import 提供的四种用法：

- 导入 Bean
- 导入配置类
- 导入 ImportSelector 实现类，可以通过**加载配置文件**一次导入多个类

```java
public class MyImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        return new String[]{"com.ysama.springbootenableother.pojo.User"};
    }
}
```

```java
@SpringBootApplication
@Import(MyImportSelector.class)
public class SpringbootEnableApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(SpringbootEnableApplication.class, args);
        Map<String, User> map = context.getBeansOfType(User.class);
        System.out.println(map);

        for (String s : map.keySet()) {
            System.out.println(map.get(s));
        }
    }

}
```

- 导入 ImportBeanDefinitionRegistrar 实现类



### 自动配置原理

- @EnableAutoConfiguration 注解内部使用 @Import(AutoConfigurationImportSelector.**class**)来加载配置类。
  实现的 selectImports 方法会返回 StringArray
- 配置文件位置：META-INF/spring.factories，该配置文件中定义了大量的配置类，当 SpringBoot 应用启动时，会自动加载这些配置类，初始化Bean
- 并不是所有的Bean都会被初始化，在配置类中使用Condition来加载满足条件的Bean

![image-20220728002306377](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207280023641.png)



## 自定义 starter

### 项目结构

> springboot-test 父工程下面有着几个 module，分别是：
>
> - redis-spring-boot-autoconfigure
> - redis-spring-boot-starter 依赖着上面的配置 module
> - springboot-enable 引入 starter 来进行测试



### 步骤分析

1. 创建各个 module。
2. 在 `pom.xml` 中写好依赖关系，enable 依赖 starter，starter 依赖 autoconfigure。
3. 在 autoconfigure 模块中初始化 Jedis 的 Bean，并定义 META-INF/spring.factories 文件
4. 在 enable 模块中测试从容器中获取 bean



### 实现

1. 创建 redis-spring-boot-autoconfigure 工程。
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-configuration-processor</artifactId>
       <optional>true</optional>
   </dependency>
   <!-- https://mvnrepository.com/artifact/redis.clients/jedis -->
   <dependency>
       <groupId>redis.clients</groupId>
       <artifactId>jedis</artifactId>
       <version>3.5.1</version>
   </dependency>
   ```

   

2. 创建redis-spring-boot-starter工程，并引入依赖。

   ```xml
   <dependency>
       <groupId>com.ysama</groupId>
       <artifactId>redis-spring-boot-autoconfigure</artifactId>
       <version>0.0.1-SNAPSHOT</version>
   </dependency>
   ```

3. 在 autoconfigure 工程下创建 config 包
   **创建配置文件绑定类**

   ```java
   @ConfigurationProperties(prefix = "redis")
   public class RedisProperties {
   
       private String host = "localhost";
       private int port = 6379;
   
       public String getHost() {
           return host;
       }
   
       public void setHost(String host) {
           this.host = host;
       }
   
       public int getPort() {
           return port;
       }
   
       public void setPort(int port) {
           this.port = port;
       }
   }
   ```

   **创建自动配置类**

   ```java
   @Configuration
   @EnableConfigurationProperties(RedisProperties.class)
   @ConditionalOnClass(Jedis.class) // 引入了包才生效
   public class RedisAutoConfiguration {
       /**
        * 提供Jedis的bean
        */
       @Bean
       @ConditionalOnMissingBean(name = "jedis") // 容器中没有才注入
       public Jedis myJedis(RedisProperties redisProperties) {
           System.out.println("RedisAutoConfiguration....");
           return new Jedis(redisProperties.getHost(), redisProperties.getPort());
       }
   }
   ```

   在resource目录下创建META-INF文件夹并创建spring.factories
   
   ```factories
   org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
     com.ysama.redisspringbootautoconfigure.config.RedisAutoConfiguration
   ```
   
4. 新建 springboot-enable 工程并引入自定义的 starter 依赖，进行测试。
   ```xml
   <dependency>
       <groupId>com.ysama</groupId>
       <artifactId>redis-spring-boot-starter</artifactId>
       <version>0.0.1-SNAPSHOT</version>
   </dependency>
   ```

   ```java
   @SpringBootApplication
   public class SpringbootEnableApplication {
   
       public static void main(String[] args) {
           ConfigurableApplicationContext context = SpringApplication.run(SpringbootEnableApplication.class, args);
           // 使用方法名需要强制类型转换
           Jedis jedis = (Jedis)context.getBean("myJedis");
           System.out.println(jedis);
   
           Jedis jedis2 = context.getBean(Jedis.class);
           System.out.println(jedis2);
       }
   }
   ```

5. 可以通过配置文件来覆盖 RedisProperties 类中的配置。
   ```properties
   redis.port=6377
   # redis-cli默认6379
   ```

   

## 事件监听

Java 中的事件监听：

- 事件 Event
- 事件源 Source
- 监听器 Listener

SpringBoot 在启动项目的时候会对监听器进行回调，通过**实现监听器接口**在项目启动时完成一些操作。

**项目启动后回调的监听器：**

- CommandLineRunner
- ApplicationRunner

只需要使用 @Component 注解放入容器中。

```java
@Component
public class MyCommandLineRunner implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        System.out.println("CommandLineRunner...run");
        System.out.println(Arrays.asList(args));
    }
}
```

**MyApplicationContextInitializer 需要添加配置**

在resource文件夹下添加META-INF/spring.factories

```factories
org.springframework.context.ApplicationContextInitializer=com.ysama.springbootlistener.listener.MyApplicationContextInitializer
```

```java
@Component
public class MyApplicationContextInitializer implements ApplicationContextInitializer {
    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        System.out.println("ApplicationContextInitializer....initialize");
    }
}
```

**MySpringApplicationRunListener 需要添加配置和构造器**

```factories
org.springframework.boot.SpringApplicationRunListener=\
  com.ysama.springbootenable.listener.MySpringApplicationRunListener
```

```java
public class MySpringApplicationRunListener implements SpringApplicationRunListener {

    public MySpringApplicationRunListener(SpringApplication application, String[] args) {
    }
 	/**
    starting
    environmentPrepared
    conextPrepared
    contextLoaded
    started
    running
    failed
    */
}
```



## SpringBoot 运维

### 使用 actuator 监控

导入依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

修改配置文件

```properties
management.endpoint.health.show-details=always

# 开启所有endpoint
management.endpoints.web.exposure.include=*

# 自定义info信息
management.info.env.enabled = true
info.app.name=Spring Sample Application
info.app.description=This is my first spring boot application
info.app.version=1.0.0
```

【需要 IDEA 面板中使用 GET 请求】 http://localhost:8080/acruator 可以查看到 json 格式的信息。

http://localhost:8080/actuator/info 可以查看自定义的版本信息。

具体配置查看 [Spring Boot Actuator | Baeldung](https://www.baeldung.com/spring-boot-actuators)



### 使用图形化监控

![image-20220731105526977](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207311055161.png)

在多个 Spring Boot 项目的监控中，使用一个 Server 来监控多个 Admin。

**配置 admin-server**

1. 创建 admin-server 模块

2. 导入依赖【Ops】 admin-starter-server（最好新建项目的时候选择）

```xml
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-server</artifactId>
</dependency>
```

3. 在引导类上启用监控功能@EnableAdminServer

```java
@EnableAdminServer
@SpringBootApplication
public class SpringbootAdminServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootAdminServerApplication.class, args);
    }

}
```

4. 修改服务端口

```properties
server.port=9000
```



**配置 admin-client**

1. 创建 admin-client 模块
2. 导入依赖坐标 admin-starter-client （最好新建项目的时候选择）

```xml
<dependency>
    <groupId>de.codecentric</groupId>
    <artifactId>spring-boot-admin-starter-client</artifactId>
</dependency>
```

3. 配置相关信息

```properties
# 将自身的信息传到admin.server地址
spring.boot.admin.client.url=http://localhost:9000

management.endpoint.health.show-details=always
management.endpoints.web.exposure.include=*
```

4. 启动 server 和 client 服务，访问 server。

http://localhost:9000/applications

🟠admin-client 一般都是微服务，需要引入 web 依赖并配置 controller。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>2.7.0</version>
</dependency>
```

```java
@RestController
public class LoginController {

    @GetMapping("/")
    public String hello() {
        return "hello";
    }
}
```



## 部署项目

**发布 jar包**

直接在 Maven 面板的【Lifecycle】-【package】打包。

将生成的 jar包和**配置文件**放到相应路径并使用命令行启动。

```powershell
java -jar [helloworld].jar

# 使用额外配置
java -jar app.jar --name="Spring" --server.port=9000

# 使用外部配置文件
java -jar myproject.jar --spring.config.location=d://application.properties
```

**发布 war包**

1. 更改pom文件中的打包方式为war，指定打包的名称。

```xml
<packaging>war</packaging>

<build>
    <finalName>springboot</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

2. 修改启动类，继承 SpringBootServletInitializer 并实现 Builder 方法。

```java
@SpringBootApplication
public class SpringbootDeployApplication extends SpringBootServletInitializer {
    
    public static void main(String[] args) {
        SpringApplication.run(SpringbootDeployApplication.class, args);
    }
    
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(SpringbootDeployApplication.class);
    }
}
```



## 🟠Spring Boot 启动流程

![img](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207311220117.png)

### 初始化

![image-20220731122130686](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202207311221715.png)

1. 配置资源、启动引导类（判断是否有启动主类）
2. 判断是否为 Web 环境
3. 初始化构造器、监听器

### Run 方法

1. 启动计时器、监听器
2. 应用监听器模块，监听**配置环境**和**应用上下文**
3. 配置环境模块
   - 创建配置环境
   - 加载属性文件资源
   - 配置监听
4. 打印 banner
5. 应用上下文模块
   - 创建应用上下文对象
   - 基本属性配置
   - **更新应用上下文 refreshContext，通过工厂模式生成 bean**

