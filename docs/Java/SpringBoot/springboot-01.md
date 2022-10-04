---
title: springboot-01
date: 2022-03-14 16:13:23
tags:
  - Java
  - SpringBoot
---

**前概、HelloSpringBoot**

<!-- more -->



## 路线前概

SpringBoot前的路线：

-   javase：面向对象的思想 OOP
-   mysql：数据库持久化
-   前端：视图层，需要巩固框架和CSS。
-   javaweb：原始开发MVC三层架构的网站
-   ssm：使用框架简化开发流程，涉及到复杂的配置。

SpringBoot是Spring的再简化，涉及微服务架构。

## 相关简介

**Spring是为了解决企业级应用开发的复杂性而创建的，简化开发。**

Spring的关键优点：

-   基于POJO的轻量级和最小侵入性编程，所有东西都是bean；
-   通过IOC，依赖注入（DI）和面向接口实现松耦合；
-   基于切面（AOP）和惯例进行声明式编程；
-   通过切面和模版减少样式代码，RedisTemplate，xxxTemplate；

>   控制反转 IOC / 依赖注入 DI
>
>   Class A中用到了Class B的对象b，一般情况下，需要在A的代码中显式的new一个B的对象。
>
>   采用依赖注入技术之后，A的代码只需要定义一个私有的B对象，不需要直接new来获得这个对象，而是通过相关的容器控制程序来将B对象在外部new出来并注入到A类里的引用中。而具体获取的方法、对象被获取时的状态由配置文件（如XML）来指定。 

>   面向切面编程 AOP
>
>   AOP则是针对业务处理过程中的切面进行提取，它所面对的是处理过程中的某个步骤或阶段，以获得逻辑过程中各部分之间低耦合性的隔离效果。只需要修改相应的 Aspect，再重新编织（weave），就能在逻辑流的切面实现新的功能。

SpringBoot以 [约定大于配置](https://blog.51cto.com/u_14622073/2781350) 的核心思想，默认帮我们进行了很多设置（约定），这样就只需进行很少的手动配置，大大简化了开发流程。

**Spring Boot的主要优点：**

-   为所有Spring开发者更快的入门
-   **开箱即用**，提供各种默认配置来简化项目配置
-   内嵌式容器简化Web项目
-   没有冗余代码生成和XML配置的要求

**微服务架构**

>   微服务架构就是打破之前 *all in one*  的架构方式，把每个功能元素独立出来按需求动态组合。 

1.   节省了调用资源。
2.   每个功能元素的服务都是一个可替换的、可独立升级的代码。

![img](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/sketch.png)

![image-20220301112627451](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220301112627451.png)

## HelloSpringBoot

**微服务就是通过后台运行的一个个接口服务的Jar包来实现的。**

### 创建项目

方法一：使用Spring Initializr 的 Web页面创建项目

1.   打开  https://start.spring.io/
2.   填写项目信息，生成并下载项目。
3.   解压后用IDEA以Maven项目导入，默认选下一步。

方法二：使用IDEA直接创建项目

1.   选择Spring Initializr
2.   填写项目信息
3.   勾选初始化组件（初学Web）热部署SpringBootDevTools

![image-20220301232310900](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220301232310900.png)

![image-20220301232316953](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220301232316953.png)

![image-20220301232323844](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220301232323844.png)

**如果src目录下的文件夹不显示为Module，需要在maven窗口点击更新一下。之后会等待一段时间来下载依赖。**

![image-20220301233533456](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220301233533456.png)

### 结构分析

项目自动生成了以下文件：

-   程序的主启动类 DemoApplication
-   配置文件 application.properties
-   测试类 DemoApplicationTests
-   配置文件 pom.xml

```xml
<!-- 父依赖 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.6.4</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
<groupId>com.ysama</groupId>
<artifactId>demo</artifactId>
<version>0.0.1-SNAPSHOT</version>
<name>demo</name>
<description>Demo project for Spring Boot</description>
<properties>
    <java.version>1.8</java.version>
</properties>
<dependencies>
    <!-- web场景启动器 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
	<!-- springboot单元测试 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
<build>
    <plugins>
        <!-- 打包插件 -->
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

### 编写http接口

-   在主程序的同级目录下新建controller包。**（不在同级识别不到）**

-   新建HelloController类

    ```java
    @RestController
    public class HelloController {
        @RequestMapping("/hello")
        public String hello() {
            return "Hello World";
        }
    }
    ```

-   从主程序启动项目，注意查看控制台的Tomcat访问端口号。

### 打包

点击maven界面的**package**，将项目打成jar包。在命令行运行后就可以直接访问网页，不依赖IDEA。

```bash
java -jar [helloworld].jar
```

最好不要双击打开，否则要用任务管理器关闭。

**微服务就是通过后台运行的一个个接口服务的Jar包来实现的。**

>   修改banner：在resources目录下新建banner.txt即可。

### 问题

**org.springframework.boot 变红**

>   Plugin 'org.springframework.boot:spring-boot-maven-plugin:' not found

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

