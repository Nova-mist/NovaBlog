---
title: springmvc-note
date: 2022-03-14 16:23:51
tags:
  - Java
  - SSM
---



![blog-image-20220314-1647246956](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/blog-image-20220314-1647246956.jpg)

![image-20220314163437771](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220314163437771.png)



<!--more-->



# SpringMVC Note



## day01

### 基础回顾

**MVC 框架**

-   模型 Model
-   视图 View
-   控制器 Controller

>   MVC主要作用是**降低了视图与业务逻辑间的双向偶合**。
>
>   最典型的MVC就是JSP + servlet + javabean的模式。

![image-20220220091622396](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220220091622396.png)

**各部分的功能**

Model：

-   业务逻辑
-   保存数据的状态

View：（JSP）

-   显示页面

Controller：（Servlet）

-   取得表单数据
-   调用业务逻辑
-   转向指定的界面

**Model1 Model2**

Model1 中主要分为 View 和 Model，而 JSP 负责的 View 其实也有着 MVC 中 Controller 的功能，职责过重，不便于维护。

Model2 即 MVC 架构。

### JSP servlet

参考 [狂神说SpringMVC01：什么是SpringMVC (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247483970&idx=1&sn=352e571ee88957ce391e972344e2a3d7&scene=19) 中的环境配置。

1.   创建 Maven 父工程，导入 pom 依赖。

2.   创建 Moudle 子工程，添加 Web app 的支持。

3.   导入 servlet 和 jsp 的包。

4.   编写 servlet 类 `com.ysama.servlet.HelloServlet` 。

5.   编写Hello.jsp，在WEB-INF目录下新建一个jsp的文件夹，新建hello.jsp

6.   在web.xml中注册Servlet

7.   配置Tomcat，并启动测试

8.   -   localhost:8080/user?method=add
     -   localhost:8080/user?method=delete

**注意**：`HelloServlet.java` 中跳转的路径区分大小写，相应的 `Hello.jsp` 命名应该对应。z

```java
req.getRequestDispatcher("/WEB-INF/jsp/Hello.jsp").forward(req, resp);
```

**MVC框架要做哪些事情**

1.  将url映射到java类或java类的方法 . `web.xml` 中配置 `<servlet>`
2.  封装用户提交的数据 . `HelloServlet.java` 中判断参数
3.  处理请求--调用相关的业务处理--封装响应数据 . `HelloServlet.java` 中没有数据库部分
4.  将响应的数据进行渲染 . jsp / html 等表示层数据 . `Hello.jsp`

### **SpringMVC 概念**

[官方文档](https://docs.spring.io/spring-framework/docs/5.2.0.RELEASE/spring-framework-reference/web.html#spring-web)

>   Spring MVC是Spring Framework的一部分，是基于Java实现MVC的轻量级Web框架。

**约定优于配置**

**Spring的web框架围绕 DispatcherServlet（调度Servlet ）设计。**

DispatcherServlet的作用是将请求分发到不同的处理器。

![image-20220220200905135](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220220200905135.png)

执行流程：

1.   当用户发出请求，前置控制器 DispatcherServlet 接受请求并拦截请求。（请求位于服务器 localhost:8080 上的 SpringMVC 站点的 hello）
2.   DispatcherServlet 调用处理映射器 HandlerMapping，根据请求 url 查找 Handler。
3.   HandlerExecution 表示具体的 Handler，根据 url 查找控制器（Hello）。
4.   HandlerExecution 将解析后的信息（例如解析的控制器映射）传递给 DispatcherServlet。
5.   处理器适配器 HandlerAdapter 按照特定的规则去执行 Handler。
6.   Handler 让具体的 Controller 执行。
7.   Controller 将具体的执行信息返回给 HandlerAdapter（ModelAndView）。
8.   HandlerAdapter 将视图逻辑名或模型传递给 DispatcherServlet。
9.   DispatcherServlet 调用视图解析器（ViewResolver）来解析 HandlerAdapter 传递的逻辑视图名。
10.   视图解析器将解析的逻辑视图名传给 DispatcherServlet。
11.   DispatcherServlet 根据视图解析器解析的视图结果，调用具体的视图。
12.   最终视图呈现给用户。

### 配置版 HelloMVC

根据 [狂神说SpringMVC02：第一个MVC程序 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247483978&idx=1&sn=6711110a3b2595d6bb987ca02ee0a728&scene=19) 搭建第一个项目。

1.   新建 Moudle，添加 web app 支持。
2.   确定导入了 SpringMVC 依赖。lib 依赖
3.   配置 web.xml，注册 DispatcherServlet。
4.   SpringMVC 配置文件，[springmvc]-serlvet.xml。
5.   添加**处理器映射器**。
6.   添加**处理器适配器**。
7.   添加**视图解析器**。Spring 默认的，也可指定 ThymeLeaf / Freemarker 等
8.   实现 Controller 接口，封装数据和视图，返回 ModelAndView。
9.   将实现的类交给 SpringIOC 容器，注册 bean。
10.   跳转的 JSP 页面，显示 ModelAndView 存放的数据。
11.   配置 Tomcat 启动测试。

**注意**

- **如果jar包存在，显示无法输出，就在IDEA的项目发布中，添加lib依赖！Project Structure -> Artifacts**
- / 匹配所有的请求；（不包括.jsp）
     /* 匹配所有的请求；（包括.jsp）
- ModelAndView 的封装视图 setViewName() 对应的是 JSP 的名字，而用户访问的 hello 对应着 SpringMVC 配置文件中的 bean id。

## day02

### **注解版 HelloMVC**

1.   新建 Moudle，添加 web 支持。

2.   pom.xml 中引入相关依赖。lib 依赖

3.   配置 web.xml。
     `<servlet>` `<servlet-mapping>`

     ```xml-dtd
     <?xml version="1.0" encoding="UTF-8"?>
     <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
             version="4.0">
     
        <!--1.注册servlet-->
        <servlet>
            <servlet-name>SpringMVC</servlet-name>
            <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
            <!--通过初始化参数指定SpringMVC配置文件的位置，进行关联-->
            <init-param>
                <param-name>contextConfigLocation</param-name>
                <param-value>classpath:springmvc-servlet.xml</param-value>
            </init-param>
            <!-- 启动顺序，数字越小，启动越早 -->
            <load-on-startup>1</load-on-startup>
        </servlet>
     
        <!--所有请求都会被springmvc拦截 -->
        <servlet-mapping>
            <servlet-name>SpringMVC</servlet-name>
            <url-pattern>/</url-pattern>
        </servlet-mapping>
     
     </web-app>
     ```

4.   SpringMVC 配置文件
     自动扫描包、不处理静态资源、支持注解驱动、视图解析器

     ```xml-dtd
     <?xml version="1.0" encoding="UTF-8"?>
     <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:context="http://www.springframework.org/schema/context"
           xmlns:mvc="http://www.springframework.org/schema/mvc"
           xsi:schemaLocation="http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/context
            https://www.springframework.org/schema/context/spring-context.xsd
            http://www.springframework.org/schema/mvc
            https://www.springframework.org/schema/mvc/spring-mvc.xsd">
     
        <!-- 自动扫描包，让指定包下的注解生效,由IOC容器统一管理 -->
        <context:component-scan base-package="com.ysama.controller"/>
        <!-- 让Spring MVC不处理静态资源 -->
        <mvc:default-servlet-handler />
        <!--
        支持mvc注解驱动
            在spring中一般采用@RequestMapping注解来完成映射关系
            要想使@RequestMapping注解生效
            必须向上下文中注册DefaultAnnotationHandlerMapping
            和一个AnnotationMethodHandlerAdapter实例
            这两个实例分别在类级别和方法级别处理。
            而annotation-driven配置帮助我们自动完成上述两个实例的注入。
         -->
        <mvc:annotation-driven />
     
        <!-- 视图解析器 -->
        <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver"
              id="internalResourceViewResolver">
            <!-- 前缀 -->
            <property name="prefix" value="/WEB-INF/jsp/" />
            <!-- 后缀 -->
            <property name="suffix" value=".jsp" />
        </bean>
     
     </beans>
     ```

5.   注解实现的 Controller 类

     ```java
     @Controller
     @RequestMapping("/HelloController")
     public class HelloController {
     
        //真实访问地址 : 项目名/HelloController/hello
        @RequestMapping("/hello")
        public String sayHello(Model model){
            //向模型中添加属性msg与值，可以在JSP页面中取出并渲染
            model.addAttribute("msg","hello,SpringMVC");
            //web-inf/jsp/hello.jsp
            return "hello";
       }
     }
     ```

6.   创建 hello.jsp
     ${msg}

7.   运行测试

>   使用springMVC必须配置的三大件：
>
>   **处理器映射器、处理器适配器、视图解析器**
>
>   通常，我们只需要**手动配置视图解析器**，而**处理器映射器**和**处理器适配器**只需要开启**注解驱动**即可，而省去了大段的xml配置

如果存在 Maven 资源过滤问题，修改配置。

```
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



### 修改代码后的调试技巧

只改了 Java 代码只需要重新发布

只改了 JSP 只需要刷新页面

修改了配置文件就需要重新启动服务







### controller 配置总结

[狂神说SpringMVC03：RestFul和控制器 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247483993&idx=1&sn=abdd687e0f360107be0208946a7afc1d&scene=19#wechat_redirect)

-   控制器提供访问应用程序的行为，通过接口定义或注解定义。
-   控制器负责解析用户的请求并将其转换为一个 Model。

**实现 Controller 接口**

一个控制器中只有一个方法（实现的 `handleRequest()` ），如果要多个方法需要定义多个控制器。

**注意：Spring 默认配置了处理器映射器、处理器适配器，但推荐写上当做习惯。**

**使用注解**

同一个类中可以有多个方法，并且 JSP 页面可以复用，但传入的参数不一样显示的视图也就不一样，相当于模板。

```java
@Controller
public class ControllerTest2 {
    @RequestMapping("/hello2")
    public String test2(Model model) {
        model.addAttribute("msg", "ControllerTest2");
        return "test"; // WEB-INF/jsp/test.jsp
    }

    @RequestMapping("/hello3")
    public String test3(Model model) {
        model.addAttribute("msg", "ControllerTest3");
        return "test"; // WEB-INF/jsp/test.jsp
    }
}
```

**@RequestMapping** 注解用于映射url到控制器类或一个特定的处理程序方法。可用于类或方法上。用于类上，表示类中的所有响应请求的方法都是以该地址作为父路径。

### RestFul 风格

>   Restful就是一个资源定位及资源操作的风格。不是标准也不是协议，只是一种风格。基于这个风格设计的软件可以更简洁，更有层次，更易于实现缓存等机制。

传统方式通过不同的参数来实现不同的效果。

>   http://localhost:8080/springmvc_04_controller_war_exploded/add?a=1&b=2

**使用 Restful 操作资源，可以通过不同的请求方式来实现不同的效果。**

>   http://localhost:8080/springmvc_04_controller_war_exploded/add/1/4

```java
@Controller
public class RestFulController {
    @RequestMapping("/add/{a}/{b}")
    public String restful(@PathVariable int a, @PathVariable int b, Model model) {
        int result = a + b;
        model.addAttribute("msg", "结果是：" + result);
        return "test";
    }
}
```

再根据 @PostMapping 等来选择操作从而达到不同的效果

>   @GetMapping
>   @PostMapping
>   @PutMapping
>   @DeleteMapping
>   @PatchMapping

或者使用 method 属性指定请求类型

```java
@RequestMapping(value = "/hello",method = {RequestMethod.POST})
public String index2(Model model){
   model.addAttribute("msg", "hello!");
   return "test";
}
```

浏览器地址栏进行访问默认是Get请求，会报错405

**表单的测试**

如果地址前缀是 `http://localhost:8080/springmvc_04_controller_war_exploded/` 直接写成 `/add/1/45` 会跳转到 `http://localhost:8080/add/1/45` 返回404

```jsp
<form action="${pageContext.request.contextPath}/add/1/45" method="post">
    <input type="submit">
</form>
```

## day03

### 重定向和转发

设置 ModelAndView 对象，会根据 ViewName 和视图解析器跳转到：
**{视图解析器前缀} + ViewName + {视图解析器后缀}**

```xml-dtd
<!-- 视图解析器 -->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver"
     id="internalResourceViewResolver">
   <!-- 前缀 -->
   <property name="prefix" value="/WEB-INF/jsp/" />
   <!-- 后缀 -->
   <property name="suffix" value=".jsp" />
</bean>
```

对应 Controller 类

```java
public class ControllerTest1 implements Controller {

    public ModelAndView handleRequest(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        //返回一个模型视图对象
        ModelAndView mv = new ModelAndView();
        mv.addObject("msg","ControllerTest1");
        mv.setViewName("test");
        return mv;
    }
}
```

**通过设置 ServletAPI 就不需要视图解析器**

-   输出
-   重定向
-   转发

```java
@Controller
public class ResultGo {

   @RequestMapping("/result/t1")
   public void test1(HttpServletRequest req, HttpServletResponse rsp) throws IOException {
       rsp.getWriter().println("Hello,Spring BY servlet API");
  }

   @RequestMapping("/result/t2")
   public void test2(HttpServletRequest req, HttpServletResponse rsp) throws IOException {
       rsp.sendRedirect("/index.jsp");
  }

   @RequestMapping("/result/t3")
   public void test3(HttpServletRequest req, HttpServletResponse rsp) throws Exception {
       //转发
       req.setAttribute("msg","/result/t3");
       req.getRequestDispatcher("/WEB-INF/jsp/test.jsp").forward(req,rsp);
  }

}
```

**通过 SpringMVC 实现转发和重定向无需视图解析器**

```java
@RequestMapping("/rsm/t1")
public String test1() {
    // 转发
    return "/index.jsp";
}

@RequestMapping("/rsm/t2")
public String test2() {
    return "forward:/index.jsp";
}

@RequestMapping("/rsm/t3")
public String test3() {
    // 重定向
    return "redirect:/index.jsp";
}
```

### 数据处理

**处理提交的参数**

1.   提交的域名称和处理方法的参数名一致
2.   **提交的域名称和处理方法的参数名不一致 使用 @RequestParam**
3.   **提交的是一个对象，搭配 Lombok 使用**

```java
// 要现在 pom.xml 中配置包
// com.ysama.pojo.User
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private int id;
    private String name;
    private int age;
}
```

```java
// com.ysama.controller.
@RequestMapping("/user")
public String user(User user){
   System.out.println(user);
   return "hello";
}
```



**数据显示到前端**

**通过 ModelAndView，用于实现接口时的使用。**

```java
public class ControllerTest1 implements Controller {
    public ModelAndView handleRequest(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws Exception {
        //返回一个模型视图对象
        ModelAndView mv = new ModelAndView();
        mv.addObject("msg","ControllerTest1");
        mv.setViewName("test");
        return mv;
    }
}
```

**通过 Model / ModelMap，用于注解。**

```java
@RequestMapping("/ct2/hello")
public String hello(@RequestParam("username") String name, Model model){
   //封装要显示到视图中的数据
   //相当于req.setAttribute("name",name);
   model.addAttribute("msg",name);
   System.out.println(name);
   return "test";
}
```

>   Model 只有寥寥几个方法只适合用于储存数据，简化了新手对于Model对象的操作和理解；
>
>   ModelMap 继承了 LinkedMap ，除了实现了自身的一些方法，同样的继承 LinkedMap 的方法和特性；
>
>   ModelAndView 可以在储存数据的同时，可以进行设置返回的逻辑视图，进行控制展示层的跳转。



### 表单提交乱码问题

简单的方法只需要使用 SpringMVC 提供的过滤器（web.xml）。有更多需求见 [狂神说SpringMVC04：数据处理及跳转 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247483998&idx=1&sn=97c417a2c1484d694c761a2ad27f217d&scene=19#wechat_redirect)

```xml
<filter>
   <filter-name>encoding</filter-name>
   <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
   <init-param>
       <param-name>encoding</param-name>
       <param-value>utf-8</param-value>
   </init-param>
</filter>
<filter-mapping>
   <filter-name>encoding</filter-name>
   <url-pattern>/*</url-pattern>
</filter-mapping>
```





### Tomcat配置页面问题

![image-20220223121247202](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220223121247202.png)

**调试设置中的应用上下文路径要与网址的路径一直，最好都设为空。**

![image-20220224160835735](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220224160835735.png)

**设置动态刷新页面**

### JSON

语法格式：

>   对象表示为键值对，数据由逗号分隔
>
>   { } 花括号保存对象
>
>   [ ] 方括号保存数组（列表）

```json
[{"name":"马多多","age":3},
]
```

**JavaScript 中 JSON 和 对象的转换**

```html
<script type="text/javascript">
    var user = {
        name: '马多多',
        age: 3
    }
    // console.log(user)
    var str = JSON.stringify(user);
    console.log(str);
    console.log('========')
    var user2 = JSON.parse(str);
    console.log(user2);
</script>
```





**直接返回字符串的设置**

@Controller 会走视图解析器，需要搭配方法注释 @ResponseBody 

@RestController 直接返回

```java
@RestController
public class UserController {
   @RequestMapping("/json1")
   public String json1() throws JsonProcessingException {
       //创建一个jackson的对象映射器，用来解析数据
       ObjectMapper mapper = new ObjectMapper();
       //创建一个对象
       User user = new User("xxx", 3, "qq");
       //将我们的对象解析成为json格式
       String str = mapper.writeValueAsString(user);
       //由于@ResponseBody注解，这里会将str转成json格式返回；十分方便
       return str;
  }

}
```

#### **Jackson 的使用**

-   导入 Jackson / Lombok 包

-   配置解决乱码问题 `web.xml`

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
             version="4.0">
        <!--    注册servlet-->
        <servlet>
            <servlet-name>SpringMVC</servlet-name>
            <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
            <!--通过初始化参数指定SpringMVC配置文件的位置，进行关联-->
            <init-param>
                <param-name>contextConfigLocation</param-name>
                <param-value>classpath:springmvc-servlet.xml</param-value>
            </init-param>
            <!-- 启动顺序，数字越小，启动越早 -->
            <load-on-startup>1</load-on-startup>
        </servlet>
        <!--所有请求都会被springmvc拦截 -->
        <servlet-mapping>
            <servlet-name>SpringMVC</servlet-name>
            <url-pattern>/</url-pattern>
        </servlet-mapping>
        <!--    解决字符串乱码的过滤器-->
        <filter>
            <filter-name>encoding</filter-name>
            <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
            <init-param>
                <param-name>encoding</param-name>
                <param-value>utf-8</param-value>
            </init-param>
        </filter>
        <filter-mapping>
            <filter-name>encoding</filter-name>
            <url-pattern>/</url-pattern>
        </filter-mapping>
    </web-app>
    ```

-   `springmvc-servlet.xml` 中加入一段消息 StringHttpMessageConverter 转换配置就不用每个请求都要添加 `@RequestMapping(value = "/json1",produces = "application/json;charset=utf-8")`  **解决 JSON 乱码**

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:context="http://www.springframework.org/schema/context"
           xmlns:mvc="http://www.springframework.org/schema/mvc"
           xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/context
           https://www.springframework.org/schema/context/spring-context.xsd
           http://www.springframework.org/schema/mvc
           https://www.springframework.org/schema/mvc/spring-mvc.xsd">
    
    
        <!--        自动扫描指定的包-->
        <context:component-scan base-package="com.ysama.controller"/>
        <!--    启用注解驱动-->
        <mvc:annotation-driven>
            <mvc:message-converters register-defaults="true">
                <bean class="org.springframework.http.converter.StringHttpMessageConverter">
                    <constructor-arg value="UTF-8"/>
                </bean>
                <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
                    <property name="objectMapper">
                        <bean class="org.springframework.http.converter.json.Jackson2ObjectMapperFactoryBean">
                            <property name="failOnEmptyBeans" value="false"/>
                        </bean>
                    </property>
                </bean>
            </mvc:message-converters>
        </mvc:annotation-driven>
        <!--    视图解析器-->
        <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
            <property name="prefix" value="/WEB-INF/jsp/"/>
            <property name="suffix" value=".jsp"/>
        </bean>
    </beans>
    ```

-   编写实体类 User 和 Controller

    ```java
    package com.ysama.pojo;
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class User {
        int id;
        String name;
        int age;
    }
    ```

**返回列表或对象的字符串**

```java
@RequestMapping("/user/t1")
@ResponseBody
public String json1() throws JsonProcessingException {
    ObjectMapper mapper = new ObjectMapper();
    User user = new User(1, "马多多", 21);
    // 也可以是 userList
    // List<User> userList = new ArrayList<User>();
    return mapper.writeValueAsString(user);
}
```

**返回时间戳的两种方式**

```java
@RequestMapping("/user/t3")
@ResponseBody
public String json3() throws JsonProcessingException {
    ObjectMapper mapper = new ObjectMapper();
    Date date = new Date();
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    return mapper.writeValueAsString(sdf.format(date));
}

@RequestMapping("/user/t4")
@ResponseBody
public String json4() throws JsonProcessingException {
    ObjectMapper mapper = new ObjectMapper();
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    // 不适用时间戳的方式
    mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    mapper.setDateFormat(sdf);
    Date date = new Date();

    return mapper.writeValueAsString(date);
}
```

**封装工具类**

```java
public class JsonUtils {
    public static String getJson(Object object) {
        return getJson(object, "yyyy-MM-dd HH:mm::ss");
    }
    public static String getJson(Object object, String dateFormat) {
        ObjectMapper mapper = new ObjectMapper();
        // 不使用时间戳
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        // 自定义日期格式对象
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
        // 指定日期格式
        mapper.setDateFormat(sdf);
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

#### FastJson 的使用

>   fastjson.jar是阿里开发的一款专门用于Java开发的包，可以方便的实现json对象与JavaBean对象的转换，实现JavaBean对象与json字符串的转换，实现json对象与json字符串的转换。

添加 pom 依赖

```xml
<!-- https://mvnrepository.com/artifact/com.alibaba/fastjson -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.79</version>
</dependency>
```

三个主要的类：

-   JSONObject 代表 json 对象
-   JSONArray 代表 json 对象数组
-   JSON 代表 JSONObject 和 JSONArray 的转化

**测试**

主要使用 `JSON.toJSONString(user)` `JSON.parseObject(str, User.class)`  

```java
public class FastJsonDemo {
    public static void main(String[] args) {
        User user1 = new User(1,"马多多1",22);
        User user2 = new User(2,"马多多1",22);
        User user3 = new User(3,"马多多1",22);
        User user4 = new User(4,"马多多1",22);
        List<User> userList = new ArrayList<>();
        userList.add(user1);
        userList.add(user2);
        userList.add(user3);
        userList.add(user4);

        System.out.println("Java Object to JSON str:");
        String str1 = JSON.toJSONString(userList);
        System.out.println("JSON.toJSONString(userList) ==> " + str1);
        String str2 = JSON.toJSONString(user1);
        System.out.println("JSON.toJSONString(user1) ==> " + str2);

        System.out.println("\nJSON str to Java Object");
        User jp_user1 = JSON.parseObject(str2, User.class);
        System.out.println("JSON.parseObject(str2, User.class) ==> " + jp_user1) ;

        System.out.println("\nJava Object to JSON Object");
        JSONObject jsonObject1 = (JSONObject) JSON.toJSON(user2);
        System.out.println("(JSONObject) JSON.toJSON(user2) ==> " + jsonObject1.getString("name"));

        System.out.println("\nJSON object to Java Object");
        User to_java_user = JSON.toJavaObject(jsonObject1, User.class);
        System.out.println("JSON.toJavaObject(jsonObject1, User.class) ==> " + to_java_user);
    }
}
```



## day04 整合ssm

[狂神说SpringMVC05：整合SSM框架 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247484004&idx=1&sn=cef9d881d0a8d7db7e8ddc6a380a9a76&scene=19#wechat_redirect)

### 搭建环境

-   IDEA
-   MySQL
-   Tomcat9
-   Maven

**数据库**

注意 `COMMENT` 后面是字符串

```mysql
CREATE DATABASE `ssmbuild`;

USE `ssmbuild`;

DROP TABLE IF EXISTS `books`;

CREATE TABLE `books`(
`bookID` INT(10) NOT NULL AUTO_INCREMENT COMMENT '书id',
`bookName` VARCHAR(100) NOT NULL COMMENT '书名',
`bookCounts` INT(11) NOT NULL COMMENT '数量',
`detail` VARCHAR(200) NOT NULL COMMENT '描述',
KEY `bookID` (`bookID`)
)ENGINE=INNODB DEFAULT CHARSET=utf8

INSERT INTO `books`(`bookID`,`bookName`,`bookCounts`,`detail`)VALUES
(1,'Java多线程的艺术',1,'多线程、高并发基础'),
(2,'MySQL必知必会',10,'多看多练'),
(3,'Linux就该这么学',5,'要复习要实践');
```

**导入 Maven 依赖**

-   Junit
-   数据库驱动 mysql-connector-java
-   数据库连接池 c3p0
-   Servlet JSP 依赖 servlet-api / jsp-api / jstl
-   Mybatis 依赖 mybatis / mybatis-spring
-   Spring 依赖 spring-webmvc / spring-jdbc
-   Lombok

**设置 Maven 静态资源过滤**

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

**建立基本结构和配置框架**

-   com.ysama.pojo

-   com.ysama.dao

-   com.ysama.service

-   com.ysama.controller

-   mybatis-config.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE configuration
           PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-config.dtd">
    <configuration>
    
    </configuration>
    ```

-   applicationContext.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">
    
    </beans>
    ```

### Mybatis 层

1.   数据库配置文件 database.properties

     ```properties
     jdbc.driver=com.mysql.jdbc.Driver
     jdbc.url=jdbc:mysql://localhost:3306/ssmbuild?useSSL=true&useUnicode=true&characterEncoding=utf8
     jdbc.username=ysama
     jdbc.password=123456
     ```

2.   IDEA 关联数据库
     要勾选显示 ssmbuild
     ![image-20220224105852343](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220224105852343.png)

3.   编写 MyBatis 核心配置文件

     ```xml
     <?xml version="1.0" encoding="UTF-8" ?>
     <!DOCTYPE configuration
             PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
             "http://mybatis.org/dtd/mybatis-3-config.dtd">
     <configuration>
         <!--    默认别名为类名的小写-->
         <typeAliases>
             <package name="com.ysama.pojo"/>
         </typeAliases>
         <mappers>
             <mapper resource="com/ysama/dao/BookMapper.xml"/>
         </mappers>
     </configuration>
     ```

4.   数据库对应实体类 com.ysama.pojo.Books

     ```java
     @Data
     @NoArgsConstructor
     @AllArgsConstructor
     public class Books {
         private int bookID;
         private String bookName;
         private int bookCounts;
         private String detail;
     }
     ```

5.   Dao 层的 Mapper 接口

     ```java
     public interface BookMapper {
         int addBook(Books book);
         
         int deleteBookById(int id);
         
         int updateBook(Books books);
         
         Books queryBookById(int id);
         
         List<Books> queryAllBook();
     }
     ```

6.   编写接口对应的 Mapper.xml 文件。

     ```xml
     <?xml version="1.0" encoding="UTF-8" ?>
     <!DOCTYPE mapper
             PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
             "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
     <mapper namespace="com.ysama.dao.BookMapper">
         <!--增加一个Book-->
         <insert id="addBook" parameterType="Books">
             insert into ssmbuild.books(bookName, bookCounts, detail)
             values (#{bookName}, #{bookCounts}, #{detail})
         </insert>
         <!--根据id删除一个Book-->
     <!--    fixme: @Param("bookID")-->
         <delete id="deleteBookById" parameterType="int">
             delete from ssmbuild.books where bookID = #{id}
         </delete>
         <!--更新Book-->
         <update id="updateBook" parameterType="Books">
             update ssmbuild.books
             set bookName = #{bookName}, bookCounts = #{bookCounts}, detail = #{detail}
             where bookID = #{bookID};
         </update>
         <!--根据id查询,返回一个Book-->
         <select id="queryBookById" resultType="Books">
             select * from ssmbuild.books
             where bookID = #{bookID}
         </select>
         <!--查询全部Book-->
         <select id="queryAllBook" resultType="Books">
             select * from ssmbuild.books
         </select>
     
     </mapper>
     ```

7.   编写 Service 层的接口和实现类
     BookService

     ```java
     public interface BookService {
         int addBook(Books book);
         int deleteBookById(int id);
         int updateBook(Books books);
         Books queryBookById(int id);
         List<Books> queryAllBook();
     }
     ```

     ```java
     public class BookServiceImpl implements BookService {
         // 调用 dao 层的操作
         // set 接口，方便 Spring 管理
         private BookMapper bookMapper;
         public void setBookMapper(BookMapper bookMapper){
             this.bookMapper = bookMapper;
         }
     
         @Override
         public int addBook(Books book) {
             return bookMapper.addBook(book);
         }
     
         @Override
         public int deleteBookById(int id) {
             return bookMapper.deleteBookById(id);
         }
     
         @Override
         public int updateBook(Books books) {
             return bookMapper.updateBook(books);
         }
     
         @Override
         public Books queryBookById(int id) {
             return bookMapper.queryBookById(id);
         }
     
         @Override
         public List<Books> queryAllBook() {
             return bookMapper.queryAllBook();
         }
     }
     ```

### Spring 层

**Spring 配置文件分为多个 xml 文件，可以通过 Import 导入，也可以让IDEA 自动配置。**

spring-dao.xml

1.   关联数据库配置文件
2.   连接池
     -   dbcp 半自动化操作，不能自动连接
     -   c3p0 自动化操作，自动化的加载配置文件，可以自动设置到对象中
     -   druid
     -   hikari
3.   配置 SqlSessionFactory 对象
4.   配置扫描 Dao 接口包，动态实现 Dao 接口注入到 spring 容器中

**Spring整合MyBatis**

spring-dao.xml

```xml-dtd
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
    <!--    配置整合 mybatis-->
    <!--    1.关联数据库文件-->
    <context:property-placeholder location="classpath:database.properties"/>
    <!--    2.数据库连接池 -->
    <!--    c3p0 自动化操作（自动的加载配置文件 并且设置到对象里面）-->
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <!-- 配置连接池属性 -->
        <property name="driverClass" value="${jdbc.driver}"/>
        <property name="jdbcUrl" value="${jdbc.url}"/>
        <property name="user" value="${jdbc.username}"/>
        <property name="password" value="${jdbc.password}"/>

        <!-- c3p0连接池的私有属性 -->
        <property name="maxPoolSize" value="30"/>
        <property name="minPoolSize" value="10"/>
        <!-- 关闭连接后不自动commit -->
        <property name="autoCommitOnClose" value="false"/>
        <!-- 获取连接超时时间 -->
        <property name="checkoutTimeout" value="10000"/>
        <!-- 当获取连接失败重试次数 -->
        <property name="acquireRetryAttempts" value="2"/>
    </bean>
    <!--    3.配置 SqlSessionFactory 对象-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 注入数据库连接池 -->
        <property name="dataSource" ref="dataSource"/>
        <!-- 配置MyBaties全局配置文件:mybatis-config.xml -->
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
    </bean>
    <!--    4.配置扫描 Dao 接口包，动态实现 Dao 接口注入到 Spring 容器 -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!-- 注入sqlSessionFactory -->
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
        <!-- 给出需要扫描Dao接口包 -->
        <property name="basePackage" value="com.ysama.dao"/>
    </bean>
</beans>
```

**Spring整合service层**

spring-service.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
    <!-- 扫描service相关的bean -->
    <context:component-scan base-package="com.ysama.service"/>
    <!--BookServiceImpl注入到IOC容器中-->
    <bean id="BookServiceImpl" class="com.ysama.service.BookServiceImpl">
        <property name="bookMapper" ref="bookMapper"/>
    </bean>
    <!-- 配置事务管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!-- 注入数据库连接池 -->
        <property name="dataSource" ref="dataSource" />
    </bean>
</beans>
```

### SpringMVC层

-   添加 lib 支持

-   添加 web app 支持

-   配置 web.xml 注意乱码过滤配置和 Session 过期时间

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
             version="4.0">
        <!--DispatcherServlet-->
        <servlet>
            <servlet-name>DispatcherServlet</servlet-name>
            <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
            <init-param>
                <param-name>contextConfigLocation</param-name>
                <!--            要加载总的配置文件-->
                <param-value>classpath:applicationContext.xml</param-value>
            </init-param>
            <load-on-startup>1</load-on-startup>
        </servlet>
        <servlet-mapping>
            <servlet-name>DispatcherServlet</servlet-name>
            <url-pattern>/</url-pattern>
        </servlet-mapping>
    
        <!--    解决乱码-->
        <filter>
            <filter-name>encodingFilter</filter-name>
            <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
            <init-param>
                <param-name>encoding</param-name>
                <param-value>utf-8</param-value>
            </init-param>
        </filter>
        <filter-mapping>
            <filter-name>encodingFilter</filter-name>
            <!--        过滤所有乱码-->
            <url-pattern>/*</url-pattern>
        </filter-mapping>
    
        <!--Session过期时间-->
        <session-config>
            <session-timeout>15</session-timeout>
        </session-config>
    </web-app>
    ```

-   配置 spring-mvc.xml

    1.   开启 SpringMVC 注解驱动
    2.   静态资源默认 servlet 配置
    3.   配置视图解析器
    4.   扫描 web 相关的 bean

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:context="http://www.springframework.org/schema/context"
           xmlns:mvc="http://www.springframework.org/schema/mvc"
           xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/mvc
       https://www.springframework.org/schema/mvc/spring-mvc.xsd">
        <!-- 配置SpringMVC -->
        <!-- 1.开启SpringMVC注解驱动 -->
        <mvc:annotation-driven/>
        <!-- 2.静态资源默认servlet配置-->
        <mvc:default-servlet-handler/>
        <!-- 3.配置jsp 显示ViewResolver视图解析器 -->
        <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
            <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
            <property name="prefix" value="/WEB-INF/jsp/"/>
            <property name="suffix" value=".jsp"/>
        </bean>
        <!-- 4.扫描web相关的bean -->
        <context:component-scan base-package="com.ysama.controller"/>
    </beans>
    ```

-   pring配置整合文件，applicationContext.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd">
    
        <import resource="spring-dao.xml"/>
        <import resource="spring-service.xml"/>
        <import resource="spring-mvc.xml"/>
    
    </beans>
    ```

### **Controller 和 视图层编写**

#### 查询书籍

**BookController 类**

```java
@Controller
@RequestMapping("/book")
public class BookController {
    @Autowired
    @Qualifier("BookServiceImpl")
    private BookService bookService;

    @RequestMapping("/allBook")
    public String list(Model model) {
        List<Books> list = bookService.queryAllBook();
        model.addAttribute("list", list);
        return "allBook"; // WEB-INF/jsp/allBook.jsp
    }
}
```

**编写 index.jsp**

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE HTML>
<html>
<head>
   <title>首页</title>
   <style type="text/css">
       a {
           text-decoration: none;
           color: black;
           font-size: 18px;
      }
       h3 {
           width: 180px;
           height: 38px;
           margin: 100px auto;
           text-align: center;
           line-height: 38px;
           background: deepskyblue;
           border-radius: 4px;
      }
   </style>
</head>
<body>
<h3>
   <a href="${pageContext.request.contextPath}/book/allBook">点击进入列表页</a>
</h3>
</body>
</html>
```

**书籍列表页面 allbook.jsp 使用了 bootstrap 美化** 

```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
   <title>书籍列表</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <!-- 引入 Bootstrap -->
   <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<div class="container">

   <div class="row clearfix">
       <div class="col-md-12 column">
           <div class="page-header">
               <h1>
                   <small>书籍列表 —— 显示所有书籍</small>
               </h1>
           </div>
       </div>
   </div>

   <div class="row">
       <div class="col-md-4 column">
           <a class="btn btn-primary" href="${pageContext.request.contextPath}/book/toAddBook">新增</a>
       </div>
   </div>

   <div class="row clearfix">
       <div class="col-md-12 column">
           <table class="table table-hover table-striped">
               <thead>
               <tr>
                   <th>书籍编号</th>
                   <th>书籍名字</th>
                   <th>书籍数量</th>
                   <th>书籍详情</th>
                   <th>操作</th>
               </tr>
               </thead>

               <tbody>
               <c:forEach var="book" items="${requestScope.get('list')}">
                   <tr>
                       <td>${book.getBookID()}</td>
                       <td>${book.getBookName()}</td>
                       <td>${book.getBookCounts()}</td>
                       <td>${book.getDetail()}</td>
                       <td>
                           <a href="${pageContext.request.contextPath}/book/toUpdateBook?id=${book.getBookID()}">更改</a> |
                           <a href="${pageContext.request.contextPath}/book/del/${book.getBookID()}">删除</a>
                       </td>
                   </tr>
               </c:forEach>
               </tbody>
           </table>
       </div>
   </div>
</div>
```

**排查错误思路**

![image-20220224161245863](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220224161245863.png)

**编写 test 类进行底层 Junit 单元测试**

>   Caused by: org.apache.ibatis.exceptions.PersistenceException: 
>
>   Error querying database.  Cause: org.springframework.jdbc.CannotGetJdbcConnectionException: Failed to obtain JDBC Connection; nested exception is java.sql.SQLException: Connections could not be acquired from the underlying database!
>
>   The error may exist in com/ysama/dao/BookMapper.xml
>
>   The error may involve com.ysama.dao.BookMapper.queryAllBook
>
>   The error occurred while executing a query

思路一：jdbc driver 与 mysql8 不兼容，但是之前都没问题

思路二：检查 database.properties 的格式

思路三：检查 c3p0 配置

![image-20220224164651252](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220224164651252.png)

**发现配置写错**

修改后报错 404

![image-20220224164842657](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220224164842657.png)

发现错误原因是 jsp 页面名称大小写不对应

#### 增加书籍

```java
@RequestMapping("/toAddBook")
public String toAddPaper() {
    return "addBook";
}
@RequestMapping("/addBook")
public String addPaper(Books books) {
    System.out.println(books);
    bookService.addBook(books);
    // 重定向
    return "redirect:/book/allBook";
}
```

**addBook.jsp**

```jsp
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
   <title>新增书籍</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <!-- 引入 Bootstrap -->
   <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container">

   <div class="row clearfix">
       <div class="col-md-12 column">
           <div class="page-header">
               <h1>
                   <small>新增书籍</small>
               </h1>
           </div>
       </div>
   </div>
   <form action="${pageContext.request.contextPath}/book/addBook" method="post">
      书籍名称：<input type="text" name="bookName"><br><br><br>
      书籍数量：<input type="text" name="bookCounts"><br><br><br>
      书籍详情：<input type="text" name="detail"><br><br><br>
       <input type="submit" value="添加">
   </form>

</div>
```

**注意：输入栏的 name 要与 Books 类的变量相对应。**

`<input required>` 要求必须输入数据才能提交

#### 修改和删除书籍

分析问题：提交了修改 SQL 请求，但是修改失败，首先考虑事务问题。

**查询以外的事物都需要提交** 设置 aop 织入以后仍然失败。

**查看 SQL 语句，发现执行失败，修改未完成。**

使用隐藏提交

```jsp
<form action="${pageContext.request.contextPath}/book/updateBook" method="post">
    <input type="hidden" name="bookID" value="${book.getBookID()}"/>
    书籍名称：<input type="text" name="bookName" value="${book.getBookName()}"/>
    书籍数量：<input type="text" name="bookCounts" value="${book.getBookCounts()}"/>
    书籍详情：<input type="text" name="detail" value="${book.getDetail() }"/>
    <input type="submit" value="提交"/>
</form>
```

mybatis-config.xml 添加日志功能

```xml
<!--    添加日志功能-->
<settings>
    <setting name="logImpl" value="STDOUT_LOGGING"/>
</settings>
```

allBook.jsp 中更改与删除部分

```jsp
<a href="${pageContext.request.contextPath}/book/toUpdateBook?id=${book.getBookID()}">更改</a> |
<a href="${pageContext.request.contextPath}/book/del/${book.getBookID()}">删除</a>
```

**普通传参的修改和 Restful 风格的删除**

```java
@RequestMapping("/toUpdateBook")
public String toUpdateBook(Model model, int id) {
    Books books = bookService.queryBookById(id);
    System.out.println(books);
    model.addAttribute("book", books);
    return "updateBook"; // WEB-INF/jsp/updateBook.jsp
}
@RequestMapping("/updateBook")
public String updateBook(Model model, Books book) {
    System.out.println(book);
    bookService.updateBook(book);
    return "redirect:/book/allBook";
}
@RequestMapping("/del/{bookId}")
public String deleteBook(@PathVariable("bookId") int id) {
    bookService.deleteBookById(id);
    return "redirect:/book/allBook";
}
```

**updateBook.jsp**

```xml
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
   <title>修改信息</title>
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <!-- 引入 Bootstrap -->
   <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container">

   <div class="row clearfix">
       <div class="col-md-12 column">
           <div class="page-header">
               <h1>
                   <small>修改信息</small>
               </h1>
           </div>
       </div>
   </div>

   <form action="${pageContext.request.contextPath}/book/updateBook" method="post">
       <input type="hidden" name="bookID" value="${book.getBookID()}"/>
      书籍名称：<input type="text" name="bookName" value="${book.getBookName()}"/>
      书籍数量：<input type="text" name="bookCounts" value="${book.getBookCounts()}"/>
      书籍详情：<input type="text" name="detail" value="${book.getDetail() }"/>
       <input type="submit" value="提交"/>
   </form>

</div>
```

### 通过名称查询

```jsp
<!-- allBook.jsp -->
<div class="row clearfix">
    <div class="col-md-4 column">
        <%--            查询书籍--%>
        <form action="${pageContext.request.contextPath}/book/queryBook" method="post">
            <span style="color: red; font-weight: bold">${error}</span>
            <input type="text" name="queryBookName" class="form-control" placeholder="请输入要查询的书籍名称">
            <input type="submit" value="查询" class="btn btn-primary">
        </form>
    </div>
</div>
```

```java
// BookMapper.java
Books queryBookByName(@Param("bookName") String bookName);
```

```xml
<!-- BookMapper.xml -->
<select id="queryBookByName" resultType="Books">
    select * from ssmbuild.books where bookName = #{bookName}
</select>
```

```java
// BookService.java BookServiceImpl.java
public Books queryBookByName(String bookName) {
    return bookMapper.queryBookByName(bookName);
}
```

```java
// BookController.java
@RequestMapping("/queryBook")
public String queryBook(String queryBookName, Model model) {
    Books books = bookService.queryBookByName(queryBookName);
    List<Books> list = new ArrayList<>();
    list.add(books);

    // 如果没查到返回所有书籍
    if (books == null) {
        list = bookService.queryAllBook();
        model.addAttribute("error", "未查到");
    }

    model.addAttribute("list", list);
    return "allBook";
}
```



## day05

### 流程回顾

-   新建项目，导入 pom 依赖，添加 lib 包。
-   添加 web app 支持。
-   web.xml
-   applicationContext.xml
-   com.ysama.controller

### Ajax

>   AJAX = Asynchronous JavaScript and XML（异步的 JavaScript 和 XML）。
>
>   AJAX 是一种在无需重新加载整个网页的情况下，能够更新部分网页的技术。（例如搜索框建议）

传统的网页，更新内容或重新提交表单都需要重新加载整个网页。

使用 Ajax 技术的网页，通过在后台服务器进行少量的数据交换，就可以实现异步局部更新。

**Ajax 应用：**

-   注册、登录时用户名密码的检测。
-   删除数据时，将 ID 发送到后台，在数据库中删除成功后，在页面 DOM 中将数据也删除。

**测试用静态 HTML 实现 ajax 效果**

发现问题：无法访问静态资源

思路一：WEB-INF 下的所有页面或资源只能通过 controller 或者 servlet 进行访问。

思路二：springmvc 拦截了静态资源

解决方法：修改 springmvc 配置文件

```xml
<!--    不处理静态资源-->
<mvc:default-servlet-handler/>
```

**使用 jQuery.ajax**

>   jQuery Ajax 的本质是封装 XMLHttpRequest。
>
>   通过 jQuery Ajax 能够使用 HTTP Get / HTTP Post 从远程服务器上请求文本、HTML、XML 或 JSON – 同时您能够把这些外部数据直接载入网页的被选元素中。

部分参数

>   jQuery.ajax(...)
>
>   url / type / headers / data / contentType / async（异步）/ timeout / complete / success / error

**测试**

-   设置静态资源过滤、注解驱动

-   编写 AjaxController

    ```java
    @RestController
    public class AjaxController {
        @RequestMapping("/a1")
        public void ajaxTest(String name, HttpServletResponse response) throws IOException {
            if ("admin".equals(name)) {
                response.getWriter().println("true");
            } else {
                response.getWriter().println("false");
            }
        }
    }
    ```

-   index.jsp 记得导入 jquery

    ```html
    <%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <html>
     <head>
       <title>$Title$</title>
      <%--<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>--%>
       <script src="${pageContext.request.contextPath}/statics/js/jquery-3.1.1.min.js"></script>
       <script>
           function a1(){
               $.post({
                   url:"${pageContext.request.contextPath}/a1",
                   data:{'name':$("#txtName").val()},
                   success:function (data,status) {
                       alert(data);
                       alert(status);
                  }
              });
          }
       </script>
     </head>
     <body>
    
    <%--onblur：失去焦点触发事件--%>
    用户名:<input type="text" id="txtName" onblur="a1()"/>
    
     </body>
    </html>
    ```

**结合 SpringMVC**

-   实体类 User

-   Controller

    ```java
    @RestController
    public class AjaxController2 {
        @RequestMapping("/a2")
        public List<User> test2() {
            List<User> list = new ArrayList<>();
            list.add(new User("马多多",22,"男"));
            list.add(new User("马多多1",20,"男"));
            list.add(new User("马多多2",21,"男"));
            return list; //由于@RestController注解，将list转成json格式返回
        }
    }
    ```

-   前端页面 不要写在 /WEB-INF 目录下面，否则无法访问。

    ```jsp
    <%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <html>
        <head>
            <title>Title</title>
        </head>
        <body>
            <input type="button" id="btn" value="获取数据"/>
            <table width="80%" align="center">
                <tr>
                    <td>姓名</td>
                    <td>年龄</td>
                    <td>性别</td>
                </tr>
                <tbody id="content">
                </tbody>
            </table>
    
            <script src="${pageContext.request.contextPath}/statics/js/jquery-3.1.1.min.js"></script>
            <script>
    
                $(function () {
                    $("#btn").click(function () {
                        $.post("${pageContext.request.contextPath}/a2",function (data) {
                            console.log(data)
                            var html="";
                            for (var i = 0; i <data.length ; i++) {
                                html+= "<tr>" +
                                    "<td>" + data[i].name + "</td>" +
                                    "<td>" + data[i].age + "</td>" +
                                    "<td>" + data[i].sex + "</td>" +
                                    "</tr>"
                            }
                            $("#content").html(html);
                        });
                    })
                })
            </script>
        </body>
    </html>
    ```

**注册的提示效果**

输入框失去焦点就通过 Ajax 去查询结果再进行显示。

Controller.java

```java
@RequestMapping("/a3")
public String test3(String name, String pwd) {
    String msg = "";
    // 应该是数据库中的操作
    if (name != null) {
        if ("admin".equals(name)) {
            msg = "OK";
        } else {
            msg = "用户名输入错误";
        }
    }
    if (pwd != null) {
        if ("123456".equals(pwd)) {
            msg = "OK";
        } else {
            msg = "密码输入错误";
        }
    }
    return msg;//由于@RestController注解，将msg转成json格式返回
}
```



### 拦截器

>   SpringMVC的处理器拦截器类似于Servlet开发中的过滤器Filter,用于对处理器进行预处理和后处理。开发者可以自己定义一些拦截器来实现特定的功能。

**拦截器是 AOP 思想的具体实现**

|                            过滤器                            |                      拦截器                      |
| :----------------------------------------------------------: | :----------------------------------------------: |
|     servlet 规范中的一部分，任何 java web 工程都可以使用     |      只有使用了SpringMVC框架的工程才能使用       |
| 在url-pattern中配置了 /* 之后，可以对所有要访问的资源进行拦截 | 拦截器只会拦截访问的控制器方法，默认静态资源过滤 |

#### 自定义拦截器

**需要实现 HandlerInterceptor 接口**

1.   新建 model ，添加 pom / lib（在 Artifacts 下 WEB-INF/lib  ） / web 支持。

2.   配置 web.xml / springmvc-servlet.xml

3.   编写拦截器

     ```java
     // com.java.config.MyInterceptor.java
     public class MyInterceptor implements HandlerInterceptor {
         /*
         在请求处理的方法之前执行
         true:执行下一个拦截器
         false:不执行下一个拦截器
          */
         @Override
         public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
             System.out.println("----处理前----");
             return true;
         }
         /* 在请求处理方法执行之后执行 **/
         @Override
         public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
             System.out.println("----处理后----");
         }
         /* 在视图解析器处理后执行 **/
         @Override
         public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
             System.out.println("----清理----");
         }
     }
     ```

4.   在 springmvc 配置文件中配置拦截器

     ```xml
     <!--关于拦截器的配置-->
     <mvc:interceptors>
         <mvc:interceptor>
             <!--/** 包括路径及其子路径-->
             <!--/admin/* 拦截的是/admin/add等等这种 , /admin/add/user不会被拦截-->
             <!--/admin/** 拦截的是/admin/下的所有-->
             <mvc:mapping path="/**"/>
             <!--bean配置的就是拦截器-->
             <bean class="com.kuang.interceptor.MyInterceptor"/>
         </mvc:interceptor>
     </mvc:interceptors>
     ```

5.   编写 Controller 接受请求

6.   index.jsp

     ```jsp
     <a href="${pageContext.request.contextPath}/interceptor">拦截器测试</a>
     ```

7.   启动测试

#### 验证用户是否登录 (认证用户)

[狂神说SpringMVC08：拦截器+文件上传下载 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247484026&idx=1&sn=eba24b51963e8c3293d023cbcf3318dc&scene=19#wechat_redirect)

思路：

1.   index 有登录和主页。
2.   登录界面提交表单，判断用户名是否正确，如果正确向 session 中写入用户信息，返回主页。
3.   拦截用户请求，判断是否登录，如果登录放行，否则跳转到登录页面。

![image-20220225192530628](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220225192530628.png)

-   登录页面 login.jsp
    **注意 input 标签中传递参数对应 name 属性**

    ```jsp
    <%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <html>
    <head>
       <title>Title</title>
    </head>
    
    <h1>登录页面</h1>
    <hr>
    
    <body>
    <form action="${pageContext.request.contextPath}/user/login">
      用户名：<input type="text" name="username"> <br>
      密码：<input type="password" name="pwd"> <br>
       <input type="submit" value="提交">
    </form>
    </body>
    </html>
    ```

-   UserController

    ```java
    @Controller
    @RequestMapping("/user")
    public class LogController {
        //跳转到登陆页面
        @RequestMapping("/jumplogin")
        public String jumpLogin(HttpSession session) throws Exception {
            if (session.getAttribute("user") != null) {
                return "success";
            }
            return "login"; // WEB-INF/jsp/login.jsp
        }
    
        //跳转到成功页面
        @RequestMapping("/jumpSuccess")
        public String jumpSuccess() throws Exception {
            return "success";
        }
    
        // 登录提交
        @RequestMapping("/login")
        public String login(HttpSession session, String username, String pwd) throws Exception {
            // 向 session 记录用户身份信息
            System.out.println("接受前端：" + username);
            // 身份检验
            if ("admin".equals(username)) {
                if ("123456".equals(pwd)) {
                    session.setAttribute("user", username);
                    return "success"; // WEB-INF/jsp/success.jsp
                }
            }
            return "login"; // WEB-INF/jsp/login.jsp
        }
    
        // 退出登陆
        @RequestMapping("logout")
        public String logout(HttpSession session) throws Exception {
            // session 过期
            // session.invalidate(); 可能会累积
            session.removeAttribute("user");
            return "login";
        }
    }
    ```

-   登录成功页面 success.jsp

    ```jsp
    <%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <html>
    <head>
       <title>Title</title>
    </head>
    <body>
    
    <h1>登录成功页面</h1>
    <hr>
    
    ${user}
    <a href="${pageContext.request.contextPath}/user/logout">注销</a>
    </body>
    </html>
    ```

-   index.jsp

    ```jsp
    <%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <html>
     <head>
       <title>$Title$</title>
     </head>
     <body>
     <h1>首页</h1>
     <hr>
    <%--登录--%>
     <a href="${pageContext.request.contextPath}/user/jumplogin">登录</a>
     <a href="${pageContext.request.contextPath}/user/jumpSuccess">成功页面</a>
     </body>
    </html>
    ```

-   编写用户登录拦截器
    **注意一定要设置登陆界面放行 提交登录信息的请求也会被拦截**

    ```java
    public class LoginInterceptor implements HandlerInterceptor {
        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            // 如果是登录页面则放行 不然 /user/login 也会被拦截
            System.out.println("uri:" + request.getRequestURI());
            if (request.getRequestURI().contains("login")) { // login jumplogin 
                // System.out.println("contains:" + request.getRequestURI());
                return true;
            }
            HttpSession session = request.getSession();
            // 如果用户已登录也放行
            if (session.getAttribute("user") != null) {
                return true;
            }
            // 用户没有登录跳转到登录页面
            request.getRequestDispatcher("/WEB-INF/jsp/login.jsp").forward(request, response);
            return false;
        }
    
        @Override
        public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        }
    
        @Override
        public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    
        }
    }
    ```

-   在Springmvc的配置文件中注册拦截器

    ```xml
    <!--关于拦截器的配置-->
    <mvc:interceptors>
        <mvc:interceptor>
            <!--/** 包括路径及其子路径-->
            <!--/admin/* 拦截的是/admin/add等等这种 , /admin/add/user不会被拦截-->
            <!--/admin/** 拦截的是/admin/下的所有-->
            <mvc:mapping path="/**"/>
            <!--bean配置的就是拦截器-->
            <bean class="com.ysama.config.LoginInterceptor"/>
        </mvc:interceptor>
    </mvc:interceptors>
    ```



#### 文件上传下载

如果想使用Spring的文件上传功能，则需要在上下文中配置 MultipartResolver。

前端表单要求：为了能上传文件，必须将表单的method设置为POST，并将enctype设置为multipart/form-data。只有在这样的情况下，浏览器才会把用户选择的文件以二进制数据发送给服务器

>   -   application/x-www=form-urlencoded：默认方式，只处理表单域中的 value 属性值，采用这种编码方式的表单会将表单域中的值处理成 URL 编码方式。
>   -   multipart/form-data：这种编码方式会以二进制流的方式来处理表单数据，这种编码方式会把文件域指定文件的内容也封装到请求参数中，不会对字符编码。
>   -   text/plain：除了把空格转换为 "+" 号外，其他字符都不做编码处理，这种方式适用直接通过表单发送邮件。

Spring MVC使用Apache Commons FileUpload技术实现了一个MultipartResolver实现类：CommonsMultipartResolver。**因此，SpringMVC的文件上传还需要依赖Apache Commons FileUpload的组件。**

-   **导入 pom 依赖包**

```xml
<dependencies>
    <!--文件上传-->
    <dependency>
        <groupId>commons-fileupload</groupId>
        <artifactId>commons-fileupload</artifactId>
        <version>1.3.3</version>
    </dependency>
    <!--servlet-api导入高版本的-->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.1</version>
    </dependency>
</dependencies>
```

-   配置bean：multipartResolver **bena的id必须为：multipartResolver ， 否则上传文件会报400的错误**

```xml
<!--文件上传配置-->
<bean id="multipartResolver"  class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
   <!-- 请求的编码格式，必须和jSP的pageEncoding属性一致，以便正确读取表单的内容，默认为ISO-8859-1 -->
   <property name="defaultEncoding" value="utf-8"/>
   <!-- 上传文件大小上限，单位为字节（10485760=10M） -->
   <property name="maxUploadSize" value="10485760"/>
   <property name="maxInMemorySize" value="40960"/>
</bean>
```

-   前端页面

    ```jsp
    <form action="/upload" enctype="multipart/form-data" method="post">
        <input type="file" name="file"/>
        <input type="submit" value="upload">
    </form>
    ```

CommonsMultipartFile 的 常用方法：

-   **String getOriginalFilename()：获取上传文件的原名**
-   **InputStream getInputStream()：获取文件流**
-   **void transferTo(File dest)：将上传文件保存到一个目录文件中**

**Controller** 两种上传方法

```java
@Controller
public class FileController {
    //@RequestParam("file") 将name=file控件得到的文件封装成CommonsMultipartFile 对象
    //批量上传CommonsMultipartFile则为数组即可
    @RequestMapping("/upload")
    public String fileUpload(@RequestParam("file") CommonsMultipartFile file , HttpServletRequest request) throws IOException {

        //获取文件名 : file.getOriginalFilename();
        String uploadFileName = file.getOriginalFilename();

        //如果文件名为空，直接回到首页！
        if ("".equals(uploadFileName)){
            return "redirect:/index.jsp";
        }
        System.out.println("上传文件名 : "+uploadFileName);

        //上传路径保存设置
        String path = request.getServletContext().getRealPath("/upload");
        //如果路径不存在，创建一个
        File realPath = new File(path);
        if (!realPath.exists()){
            realPath.mkdir();
        }
        System.out.println("上传文件保存地址："+realPath);

        InputStream is = file.getInputStream(); //文件输入流
        OutputStream os = new FileOutputStream(new File(realPath,uploadFileName)); //文件输出流

        //读取写出
        int len=0;
        byte[] buffer = new byte[1024];
        while ((len=is.read(buffer))!=-1){
            os.write(buffer,0,len);
            os.flush();
        }
        os.close();
        is.close();
        return "redirect:/index.jsp";
    }

    /*
* 采用file.Transto 来保存上传的文件
*/
    @RequestMapping("/upload2")
    public String  fileUpload2(@RequestParam("file") CommonsMultipartFile file, HttpServletRequest request) throws IOException {

        //上传路径保存设置
        String path = request.getServletContext().getRealPath("/upload");
        File realPath = new File(path);
        if (!realPath.exists()){
            realPath.mkdir();
        }
        //上传文件地址
        System.out.println("上传文件保存地址："+realPath);

        //通过CommonsMultipartFile的方法直接写文件（注意这个时候）
        file.transferTo(new File(realPath +"/"+ file.getOriginalFilename()));

        return "redirect:/index.jsp";
    }
}
```

**文件下载步骤**

1.   设置 response 响应头
2.   读取文件 InputStream
3.   写出文件 OutputStream
4.   执行操作
5.   关闭流（先开后关）

```java
@RequestMapping(value="/download")
public String downloads(HttpServletResponse response ,HttpServletRequest request) throws Exception{
   //要下载的图片地址
   String  path = request.getServletContext().getRealPath("/upload");
   String  fileName = "基础语法.jpg";

   //1、设置response 响应头
   response.reset(); //设置页面不缓存,清空buffer
   response.setCharacterEncoding("UTF-8"); //字符编码
   response.setContentType("multipart/form-data"); //二进制传输数据
   //设置响应头
   response.setHeader("Content-Disposition",
           "attachment;fileName="+URLEncoder.encode(fileName, "UTF-8"));

   File file = new File(path,fileName);
   //2、 读取文件--输入流
   InputStream input=new FileInputStream(file);
   //3、 写出文件--输出流
   OutputStream out = response.getOutputStream();

   byte[] buff =new byte[1024];
   int index=0;
   //4、执行 写出操作
   while((index= input.read(buff))!= -1){
       out.write(buff, 0, index);
       out.flush();
  }
   out.close();
   input.close();
   return null;
}
```

**前端**

```jsp
<a href="/download">点击下载</a>
```

