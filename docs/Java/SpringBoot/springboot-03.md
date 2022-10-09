---
title: springboot-03
date: 2022-03-14 16:20:02
tags:
  - Java
  - SpringBoot
---



**Web开发基础、Thymeleaf模板**

<!-- more -->

## Web开发前概

> 回顾：SpringBoot自动配置了什么？如何手动修改、添加配置？
>
> 根据pom.xml中默认的启动器自动配置了相应的组件。可以通过添加启动器来增加组件，可以在配置文件中修改关联的组件的属性。

**xxxxAutoConfigurartion：自动配置类，给容器中添加组件。**

**xxxxProperties：封装配置文件中相关属性。**

要解决的问题：

- 静态资源导入
- 首页index
- 没有写jsp的地方，所以要用模板引擎Thymeleaf
- 数据库的增删改查
- 拦截器
- 语言切换

## 静态资源导入

### 映射规则源码

> SpringMVC的web配置都在 WebMvcAutoConfiguration 这个配置类里面。

**（查看代码的过程）**WebMvcAutoConfiguration --> 内部静态类WebMvcAutoConfigurationAdapter --> **方法addResourceHandlers** --> 方法getStaticLocations --> 数组staticLocations --> CLASSPATH_RESOURCE_LOCATIONS

```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    if (!this.resourceProperties.isAddMappings()) {
        // 如果自定义了静态资源路径则禁用默认资源处理
        logger.debug("Default resource handling disabled");
        return;
    }
    // webjars配置
    addResourceHandler(registry, "/webjars/**", "classpath:/META-INF/resources/webjars/");
    // 静态资源配置
    addResourceHandler(registry, this.mvcProperties.getStaticPathPattern(), (registration) -> {
        registration.addResourceLocations(this.resourceProperties.getStaticLocations()); // 从这里开始查看
        if (this.servletContext != null) {
            ServletContextResource resource = new ServletContextResource(this.servletContext, SERVLET_LOCATION);
            registration.addResourceLocations(resource);
        }
    });
}
```

```java
private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { 
    "classpath:/META-INF/resources/",
    "classpath:/resources/",
    "classpath:/static/",
    "classpath:/public/"
};
```

### webjars

通过源码可知，请求所有的 `/webjars/**` 都需要去 `classpath:/META-INF/resources/webjars/` 找对应的资源。

**webjars的本质是将之前直接导入的静态资源文件打包成jar包再导入，SpringBoot需要使用webjars来导入静态资源。**

**例子：导入jQuery**

在 [webjars的官网](https://www.webjars.org) 复制pom依赖并添加：（要搜索Classic的包）

```xml
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>jquery</artifactId>
    <version>3.6.0</version>
</dependency>
```

导入之后可以在项目目录中查看：
![image-20220304181803682](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220304181803682.png)

因为在源码中将内部的资源路径进行了映射：

```java
addResourceHandler(registry, "/webjars/**", "classpath:/META-INF/resources/webjars/");
```

所以访问 <http://localhost:8080/webjars/jquery/3.6.0/jquery.js> 就可以获取到静态资源文件。

### 导入自己的静态资源

**静态资源目录优先级**：(classpath:/ 路径就是原有的resources目录)

- `classpath:/META-INF/resources/`
- `classpath:/resources/` (**即 resources/resources/**)
- `classpath:/static/`
- `classpath:/public/`

静态资源会根据优先级进行覆盖或补全独有。

![image-20220304183819899](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220304183819899.png)

查看源码，在WebMvcProperties类中可知：

```java
private String staticPathPattern = "/**";
```

结合映射webjars的代码可知，方法getStaticLocations返回的locations会映射到pattern即 `/**` ，所以访问 <http://localhost:8080/test.js> 就会得到静态资源文件。

![image-20220304184324028](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220304184324028.png)

### 自定义静态资源路径

在application.properties中配置：

```properties
spring.web.resources.static-locations=classpath:/coding/,classpath:/ysama/
```

**注意：**

- **由源码可知，如果自定义了静态资源路径，那么默认的配置将会失效。**
- **在新的静态资源路径中，根据配置内容的先后存在优先级。**

## 首页处理

**查看源码，欢迎页的处理映射**

```java
@Bean
public WelcomePageHandlerMapping welcomePageHandlerMapping(ApplicationContext applicationContext,
                                                           FormattingConversionService mvcConversionService, ResourceUrlProvider mvcResourceUrlProvider) {
    WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(
        new TemplateAvailabilityProviders(applicationContext), applicationContext, getWelcomePage(),
        this.mvcProperties.getStaticPathPattern());
    welcomePageHandlerMapping.setInterceptors(getInterceptors(mvcConversionService, mvcResourceUrlProvider));
    welcomePageHandlerMapping.setCorsConfigurations(getCorsConfigurations());
    return welcomePageHandlerMapping;
}
```

**（查看代码的过程）**getStaticPathPattern方法返回的就是上问的映射外部路径；方法getWelcomePage --> 方法getIndexHtml --> Resource类index

![image-20220304193459147](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220304193459147.png)

**上文静态资源路径（自定义或默认）下的index.html页面就会被 `/**` 映射。**即访问 <http://localhost:8080/> 就会显示index.html的内容。

**网站图标的设置：**

1. ~~关闭SpringBoot默认图标~~

     ```properties
     #关闭默认图标
     spring.mvc.favicon.enabled=false
     ```

2. **直接将图标放在静态资源目录下 favicon.ico**

3. Ctrl+F5刷新浏览器缓存

## Thymeleaf模板引擎

### 概念

使用模板引擎的原因：

- SpringBoot项目是以jar包的方式打包而不是war包
- 使用的是嵌入式的Tomcat

**SpringBoot默认不支持jsp**

![640](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/640.png)

**模板引擎的作用就是将静态的模板与动态的数据结合，输出渲染好的静态页面。**

### 配置并测试使用

在 [SpringBoot官方文档](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.build-systems.starters) 找到thymeleaf的启动器并添加到pom.xml配置中：

```xml
<!-- 模板引擎 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

Maven会自动导入所需的jar包。
![image-20220304205419740](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220304205419740.png)

**编写一个Controller进行测试并将test.html放在 `resources/templates` 目录**

> 在templates目录下的所有页面，只能通过controller来跳转，这个功能需要模板引擎的支持，例如thymeleaf。

```java
@Controller
public class HelloController {
    @RequestMapping("/hello")
    public String hello() {
        // classpath:/templates/test.html
        return "test";
    }
}
```

访问 <http://localhost:8080/hello>

### 分析原理

Shift+Shift 搜索属性类ThymeleafProperties，可以看到默认的前后缀配置，回想起SpringMVC的视图解析器，并且这个配置可以通过yaml等配置文件修改（**最好不修改，约定大于配置**）。

进入 [官方文档](https://www.thymeleaf.org/doc/tutorials/3.0/thymeleafspring.html#views-and-view-resolvers-in-spring-mvc) ，可以查看SpringMVC默认的JSP+JSTL视图解析器InternalResourceViewResolver和Themeleaf实现的视图解析器ThymeleafViewResolver。

```java
@ConfigurationProperties(prefix = "spring.thymeleaf")
public class ThymeleafProperties {
 private static final Charset DEFAULT_ENCODING = StandardCharsets.UTF_8;
 public static final String DEFAULT_PREFIX = "classpath:/templates/";
 public static final String DEFAULT_SUFFIX = ".html";
 // ...
}
```

### 语法学习

查看 [官方文档](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html)

**Using Texts**

先要在开头导入约束，然后使用语法的时候要给标签的属性加上 `th:` 前缀，类似Vue。

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
    <head>
        <title>Good Thymes Virtual Grocery</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link rel="stylesheet" type="text/css" media="all" 
              href="../../css/gtvg.css" th:href="@{/css/gtvg.css}" />
    </head>
    <body>
        <p th:text="#{home.welcome}">Welcome to our grocery store!</p>
    </body>
</html>
```

**重点在 [Standard Expression Syntax](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#standard-expression-syntax)** 和 [**Attribute Precedence**](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#attribute-precedence)

讲解参考 [狂神说SpringBoot11：Thymeleaf模板引擎 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247483807&idx=1&sn=7e1d5df51cdeb046eb37dec7701af47b&scene=19#wechat_redirect)

![640 (2)](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/640%20(2).jpg)

**测试**

test1.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div th:text="${msg}"></div>
</body>
</html>
```

test2.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div th:text="${msg}"></div>
<!--不转义-->
<div th:utext="${msg}"></div>

<!--遍历数据-->
<!--th:each每次遍历都会生成当前这个标签：官网#9-->
<h4 th:each="user:${users}" th:text="${user}"></h4>

<h4>
    <!--行内写法：官网#12-->
    <span th:each="user:${users}">[[${user}]]</span>
</h4>
</body>
</html>
```

Controller

```java
@Controller
public class HelloController {
    @RequestMapping("/t1")
    public String hello(Model model) {
        // classpath:/templates/test1.html
        model.addAttribute("msg","TestMessage");
        return "test1";
    }
    @RequestMapping("/t2")
    public String test2(Map<String,Object> map){
        //存入数据
        map.put("msg","<h1>Hello</h1>");
        map.put("users", Arrays.asList("kikukaji","ysama"));
        //classpath:/templates/test2.html
        return "test2";
    }
}
```
