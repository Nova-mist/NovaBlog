---
title: springboot-04
date: 2022-03-14 16:21:13
tags:
  - Java
  - SpringBoot
---



**MVC自动配置原理、一个员工管理系统的相关功能配置。**

<!-- more -->

## MVC自动配置原理

查看 [官方文档](https://docs.spring.io/spring-boot/docs/current/reference/html/web.html#web.servlet.spring-mvc.auto-configuration)

>   If you want to keep those Spring Boot MVC customizations and make more [MVC customizations](https://docs.spring.io/spring-framework/docs/5.3.16/reference/html/web.html#mvc) (interceptors, formatters, view controllers, and other features), you can add your own `@Configuration` class of type `WebMvcConfigurer` but **without** `@EnableWebMvc`.

如果想要保留Spring Boot MVC自定义的功能并且想要扩展新的功能，可以添加自定义的配置类：

-   加上@Configuration注解
-   不加@EnableWebMvc注解
-   实现WebMvcConfigurer接口



### 自定义视图解析器

>   ContentNegotiatingViewResolver 内容协商视图解析器，自动配置了ViewResolver，根据方法的返回值获得视图对象（View），再由视图对象决定如何渲染、转发、重定向。

**（查看源码的过程）**WebMvcAutoConfiguration类 --> 返回ContentNegotiatingViewResolver的方法viewResolver --> ContentNegotiatingViewResolver类 --> 返回视图对象的方法resolveViewName --> getCandidateViews方法，此方法中将所有视图解析器进行遍历循环。

```java
Iterator var5 = this.viewResolvers.iterator();
```

--> initServletContext方法中得知是在容器中获取视图解析器的：

```java
protected void initServletContext(ServletContext servletContext) {
        Collection<ViewResolver> matchingBeans = BeanFactoryUtils.beansOfTypeIncludingAncestors(this.obtainApplicationContext(), ViewResolver.class).values();
        ViewResolver viewResolver;
        if (this.viewResolvers == null) {
            this.viewResolvers = new ArrayList(matchingBeans.size());
            Iterator var3 = matchingBeans.iterator();

            while(var3.hasNext()) {
                viewResolver = (ViewResolver)var3.next();
                if (this != viewResolver) {
                    this.viewResolvers.add(viewResolver);
                }
            }
        }
    // ...
}
```

**因此只要手动在容器中添加一个视图解析器，ContentNegotiatingViewResolver类就会自动将它配置好。**

```java
@Configuration
public class MyMvcConfig implements WebMvcConfigurer {
    // 注入到容器中
    @Bean
    public ViewResolver myViewResolver() {
        return new MyViewResolver();
    }
    // 视图解析器需要实现ViewResolver接口
    private static class MyViewResolver implements ViewResolver {
        @Override
        public View resolveViewName(String viewName, Locale locale) throws Exception {
            return null;
        }
    }
}
```

**断点调试**

在DispatcherServlet类中的doDispatch方法上打断点，调式并访问网页，可以看到自定义的视图解析器被自动装配了。

![image-20220306094652250](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220306094652250.png)

### 格式转换器

在WebMvcAutoConfiguration类下找到格式转换器：

```java
@Bean
@Override
public FormattingConversionService mvcConversionService() {
	Format format = this.mvcProperties.getFormat();
	WebConversionService conversionService = new WebConversionService(new DateTimeFormatters()
	.dateFormat(format.getDate()).timeFormat(format.getTime()).dateTimeFormat(format.getDateTime()));
	addFormatters(conversionService);
	return conversionService;
}
```

可以看到从属性对象中获取了日期格式 getormat --> WebMvcProperties属性类中发现**@ConfigurationProperties(prefix = "spring.mvc")** 可以使用配置文件来修改日期格式。

```java
spring.mvc.format.date=dd/MM/yyyy
```

### 分析原理

SpringBoot中有很多的xxxConfiguration配置类（不区别于xxxAutoConfiguration自动配置类），这些配置类用来扩展原始的功能，需要注意分析。

**官方推荐的扩展实现方法**

```java
//应为类型要求为WebMvcConfigurer，所以我们实现其接口
//可以使用自定义类扩展MVC的功能
@Configuration
public class MyMvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 浏览器发送/test ， 就会跳转到test页面；
        registry.addViewController("/test").setViewName("test");
    }
}
```

**不使用注解@EnableWebMvc的原因**

自动配置类WebMvcAutoConfiguration中有一个注解**@ConditionalOnMissingBean(WebMvcConfigurationSuport.class)**，如果容器中没有该组件那么自动配置失效。

然而如果在自定义的配置类中加上了**@EnableWebMvc**注解，注解内部会导入一个继承了WebMvcConfigurationSupport的DelegatingWebMvcConfiguration类，**所以SpringBoot对SpringMVC的自动配置失效，需要自己去配置。**



## 员工管理系统

### 准备工作

1.   导入静态资源（static路径）和模板（templates路径）

2.   配置pom依赖，加入lombok。

3.   创建类

     >   pojo层Department / Employee
     >
     >   dao层DepartmentDao / EmployeeDao 创建静态数据模拟数据库

     使用@Mapper不需要在spring中配置扫描地址，而是通过mapper.xml中namespace的属性找到相关mapper类

     使用@Repository需要配置扫描包地址，spring会生成dao层的bean注入到ServiceImpl中

### 首页实现

>   controller层IndexController
>
>   或在config层MyMvcConfig自定义视图控制
>
>   两者方式不冲突

```java
// HelloController.java
@Controller
public class HelloController {
    @RequestMapping({"/t1","/t2"})
    public String hello(Model model) {
        // classpath:/templates/test1.html
        model.addAttribute("msg","TestMessage");
        return "test1";
    }
}
```

```java
// MyMvcConfig.java
@Configuration
public class MyMvcConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("index");
        registry.addViewController("/index.html").setViewName("index");
        registry.addViewController("/index.html").setViewName("index");
        registry.addViewController("/main.html").setViewName("dashboard");
    }
}
```

**将首页改为thymeleaf模板格式**

```properties
# 关闭引擎的缓存
spring.thymeleaf.cache=false
```

```
添加约束 <html lang="en" xmlns:th="http://www.thymeleaf.org">
修改链接格式 <link th:href="@{/css/bootstrap.min.css}" rel="stylesheet">
```

链接使用的@表示资源根目录，便于在配置文件中统一修改。

```properties
server.servlet.context-path=/ysama
# 访问 http://localhost:8080/ysama/
```

### 页面国际化

[狂神说SpringBoot13：页面国际化 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247483834&idx=1&sn=e28706bf0c3ded1884452adf6630d43b&scene=19#wechat_redirect)

**首先确保所有File Encodings都是UTF-8格式**

**在resources目录下新建i18n目录，编写国际化配置文件**：

-   login.properties
-   login_zh_CN.properties
-   login_en_US.properties

使用下栏Resource Bundle页面编辑属性

也可以直接复制配置

```properties
# 默认
login.btn=登录
login.password=密码
login.remember=记住我
login.tip=请登录
login.username=用户名
# 英文
login.btn=Sign in
login.password=Password
login.remember=Remember me
login.tip=Please sign in
login.username=Username
# 中文
login.btn=登录
login.password=密码
login.remember=记住我
login.tip=请登录
login.username=用户名
```

**配置原理**

MessageSourceAutoConfiguration自动化格式转换类

在属性类MessageSourceProperties中查看配置变量

![image-20220310094440835](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220310094440835.png)

**配置页面国际化值**

```
信息的格式message用# <h1 class="" th:text="#{login.tip}">Please sign</h1>
另一种格式 <button class="" type="submit">[[#{login.btn}]]</button>
```

**配置国际化解析**

在WebMvcAutoConfiguration类中有一个区域信息解析器LocaleResolver：

```java
@Override
@Bean
@ConditionalOnMissingBean(name = DispatcherServlet.LOCALE_RESOLVER_BEAN_NAME)
public LocaleResolver localeResolver() {
    // 容器中没有就自己配，有的话就用用户配置的
    if (this.webProperties.getLocaleResolver() == WebProperties.LocaleResolver.FIXED) {
        return new FixedLocaleResolver(this.webProperties.getLocale());
    }
    AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();
    localeResolver.setDefaultLocale(this.webProperties.getLocale());
    return localeResolver;
}
```

查看类AcceptHeaderLocaleResolver可知，实现LocaleResolver接口就可以自定义区域信息解析器。

具体要重写一个resolveLocale方法，而此方法默认根据请求头带的区域信息获取Locale信息进行国际化。

![image-20220310135942852](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220310135942852.png)

**如果想要点击链接实现语言切换就需要自定义LocaleResolver，并在链接上携带区域信息。**

前端页面：

```html
<!-- 这里传入参数不需要使用 ？使用 （key=value）-->
<a class="btn btn-sm" th:href="@{/index.html(l='zh_CN')}">中文</a>
<a class="btn btn-sm" th:href="@{/index.html(l='en_US')}">English</a>
```

config层的MyLocaleResolver

```java
//可以在链接上携带区域信息
public class MyLocaleResolver implements LocaleResolver {

    //解析请求
    @Override
    public Locale resolveLocale(HttpServletRequest request) {

        String language = request.getParameter("l");
        Locale locale = Locale.getDefault(); // 如果没有获取到就使用系统默认的
        //如果请求链接不为空
        if (!StringUtils.isEmpty(language)){
            //分割请求参数
            String[] split = language.split("_");
            //国家，地区
            locale = new Locale(split[0],split[1]);
        }
        return locale;
    }
    @Override
    public void setLocale(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Locale locale) {
    }
}
```

**还需要将自定义解析器注入到容器中**

```java
// MyMvcConfig
// ...
@Bean
public LocaleResolver localeResolver(){
    return new MyLocaleResolver();
}
```

**总结**

![image-20220310141850806](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220310141850806.png)

### 登录功能

```
提交表单 <form class="" th:action="@{/user/login}">
```

为input标签添加name属性，便于controller接收参数

```
<input type="text" name="username" ...>
<input type="password" name="password" ...>
```

配置controller层LoginController

```java
@Controller
public class LoginController {
    @RequestMapping("/user/login")
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        Model model) {
        // 具体的业务
        if (!StringUtils.isEmpty(username) && "123456".equals(password)) {
            // 登录成功后重定向到主页
            return "redirect:/main.html";
        } else {
            // 登录失败的提示
            model.addAttribute("msg", "用户名或者密码错误！");
            return "index";
        }
    }
}
```

![image-20220310151018579](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220310151018579.png)

**登录失败的提示，只有错误时才显示。**

```html
<!-- 如果msg的值为空则不显示消息 -->
<p style="color: red" th:text="${msg}" th:if="${not #strings.isEmpty(msg)}"></p>
```

### 登录拦截器

LoginHandlerInterceptor类

```java
public class LoginHandlerInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 登陆成功后 保存了用户的session
        Object loginUser = request.getSession().getAttribute("loginUser");

        if (loginUser == null) {
            request.setAttribute("msg", "没有权限，请先登录");
            request.getRequestDispatcher("/index.html").forward(request, response);
            return false;
        } else {
            return true;
        }
    }
}
```

**在自定义配置类MyMvcConfig中配置拦截器**

```java
// MyMvcConfig
// ...
@Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new LoginHandlerInterceptor())
        .addPathPatterns("/**")
        .excludePathPatterns("index.html", "/", "/user/login", "/css/**", "/js/**", "/img/**");
}
```

### CRUD

**员工列表展示**

编写EmployeeController调用service层，service层再调用dao层。

修改前端样式，可以提取公共页面。

**添加员工信息**

流程：

1.   按钮提交
2.   跳转到添加页面
3.   添加员工成功
4.   返回首页

前端页面添加一个按钮，还需要跳转之后的页面中加入bootstrap表单模板，**为组件添加name属性，便于提交到后端**。

前端可以使用Controller类中为model添加的属性

![image-20220310165055716](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220310165055716.png)

**修改员工信息**

-   注意前端的时间格式
-   修改的时候也需要获取原有信息 getEmployeeById(id)
-   添加隐藏inptu标签解决id自增问题

**Restful风格controller**

![image-20220310165941850](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220310165941850.png)

**删除员工信息**

![image-20220310170218040](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220310170218040.png)

### 404处理

只需要在templates目录下新建error目录，添加404.html。

### 注销功能

在controller中编写：

```java
@RequestMapping("/user/logout")
public String logout(HttpSession session) {
    session.invalidate();
    return "redirect:/index.html";
}
```



## 写网站的步骤

![image-20220310230819256](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220310230819256.png)
