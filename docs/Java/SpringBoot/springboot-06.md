## TODO：复习拦截器、过滤器





## SpringSecurity

身份认证、权限控制。（认证与授权）

框架是基于 AOP 原理的。

### 配置环境

1. 导入前端静态页面（使用了 thymeleaf 模板）

2. 在 `pom.xml` 中导入 thymeleaf 和 spring security 的**整合依赖**。
   ```xml
   <dependencies>
       <!-- thymeleaf -->
       <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-thymeleaf -->
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-thymeleaf</artifactId>
           <version>2.7.4</version>
       </dependency>
       <!-- spring security -->
       <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-security -->
       <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-security</artifactId>
           <version>2.7.4</version>
       </dependency>
   </dependencies>
   ```

3. 根据前端页面的接口编写 Controller，实现页面的跳转。

   ```java
   @Controller
   public class RouteController {
       @RequestMapping({"/","index"})
       public String index(){
           return "index";
       }
   
       @RequestMapping("/toLogin")
       public String toLogin(){
           return "views/login";
       }
   
       @RequestMapping("/logout")
       public String logout(){
           return "views/login";
       }
   
       @RequestMapping("/level1/{id}")
       public String level1(@PathVariable("id") int id){
           return "views/level1/"+id;
       }
   
       @RequestMapping("/level2/{id}")
       public String level2(@PathVariable("id") int id){
           return "views/level2/"+id;
       }
   
       @RequestMapping("/level3/{id}")
       public String level3(@PathVariable("id") int id){
           return "views/level3/"+id;
       }
   }
   ```

4. 创建启动类
   ```java
   @SpringBootApplication
   public class Application {
       public static void main(String[] args) {
           SpringApplication.run(Application.class, args);
       }
   }
   ```

5. 修改配置文件 `application.properties`，关闭缓存实现热部署
   ```properties
   spring.thymeleaf.cache=false
   server.port = 7775
   ```

6. 启动，查看效果
   **注意：请求会默认被拦截到内置的登录页面*（Spring Boot 自动配置）**
   ![image-20221006131845148](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210061318891.png)

   用户名为 `user` ，密码则是在控制台自动生成的。
   ![image-20221006132001442](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210061320183.png)

   登录之后会跳转到前端模板页面，也就是说模板中的登录界面其实是无用的。

### 用户认证和授权

[参考文档 Spring Security Reference](https://docs.spring.io/spring-security/site/docs/5.3.13.RELEASE/reference/html5/#jc)

方法一：配置类继承 `WebSecurityConfigurerAdapter`

实现两个方法：

1. `void configure(HttpSecurity http)` 匹配页面、设定权限
2. `void configure(AuthenticationManagerBuilder auth)` 用户认证并授权。可以在内存中存储临时的用户名和密码（便于测试）

```java
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    ...
}
```

🟢方法二：配置类的**静态子类** 继承  `WebSecurityConfigurerAdapter`

```java
@EnableWebSecurity
public class WebSecurityConfig {
    @Configuration
    @Order(1) // 优先级
    public static class SimpleWebSecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {
        @Bean
        public UserDetailsService userDetailsService() {
            ...
        }

        // 页面权限
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http.authorizeRequests().antMatchers("/").permitAll()
                .antMatchers("/level1/**").hasRole("vip1")
                .antMatchers("/level2/**").hasRole("vip2")
                .antMatchers("/level3/**").hasRole("vip3");
            // 没有权限默认重定向到自定义的登陆界面
            http.formLogin().loginPage("/toLogin").usernameParameter("user").passwordParameter("pwd").loginProcessingUrl("/login");

            // 使用内置登录界面
            // http.formLogin(withDefaults());
        }

        // 用户认证并授权 已经由userDetailsService()实现
        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
            super.configure(auth);
        }
    }
}
```

用户认证的步骤还可以通过单独注入 Bean 的方式实现

```java
@Bean
public UserDetailsService userDetailsService() {
    // 自动编码用户名和密码
    User.UserBuilder users = User.withDefaultPasswordEncoder();
    InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
    manager.createUser(users.username("ysama").password("123456").roles("vip1","vip2").build());
    manager.createUser(users.username("root").password("123456").roles("vip1", "vip2", "vip3").build());
    manager.createUser(users.username("guest").password("123456").roles("vip1").build());

    return manager;
}
```



#### TODO：JDBC 认证

https://docs.spring.io/spring-security/site/docs/5.3.13.RELEASE/reference/html5/#servlet-authentication-jdbc



### 注销与记住我

```java
// 登录
http.formLogin().loginPage("/toLogin").usernameParameter("user").passwordParameter("pwd").loginProcessingUrl("/login");

// 注销，开启注销功能，跳到首页
http.logout()
    .deleteCookies("JSESSIONID","remember-me","rem-token")
    .logoutSuccessUrl("/");

// 开启记住我功能 cookie，默认保存两周，自定义接收前端的参数
http.rememberMe().rememberMeParameter("remember").rememberMeCookieName("rem-token").tokenValiditySeconds(100);
```

通过 Cookies 来实现记住我的功能，可以设定 Cookies 名字、过期时间。

🟠存在的问题：

1. 点击注销之后，还可以访问到首页的权限内容，需要关闭浏览器。



### 自定义登录界面

[参考文档此小节](https://docs.spring.io/spring-security/site/docs/5.3.13.RELEASE/reference/html5/#servlet-authentication-form)

```java
// RouterController
@RequestMapping({"/toLogin","/login"})
public String toLogin(){
    return "views/login";
}
```

```java
// WebSecuriryConfig
http.formLogin().loginPage("/toLogin").usernameParameter("user").passwordParameter("pwd").loginProcessingUrl("/login");
```

```html
<!-- index.html -->
<form th:action="@{/login}" method="post">
    <input type="text" placeholder="Username" name="user">
    <input type="password" name="pwd">
</form>
```

上面代码的操作：

1. 设置使用了自定义的界面，会使用拦截器全局路由到 `/toLogin` ，转到 `views/index.html`
2. 也可以访问 `/login` 页面，会转发到 `/toLogin` 路由，是 GET 请求
3. 登录页面中提交表单的地址，是一个 POST 请求，需要设置 `loginProcessingUrl("/login")`，因为 Spring Security 默认处理 POST 的 `/login` 请求，并且如果不是默认的表单名字也需要设置 Parameter



### 搭配 thymeleaf 根据权限显示内容

 导入依赖，最新的 [3.1.0.M1](https://mvnrepository.com/artifact/org.thymeleaf.extras/thymeleaf-extras-springsecurity5/3.1.0.M1) 版本会报错。

> java.lang.NoSuchMethodError: org.thymeleaf.context.IWebContext.getExchange()Lorg/thymeleaf/web/IWebExchange;] with root cause

```xml
<!-- https://mvnrepository.com/artifact/org.thymeleaf.extras/thymeleaf-extras-springsecurity5 -->
<dependency>
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-springsecurity5</artifactId>
    <version>3.0.4.RELEASE</version>
</dependency>
```

就可以在 html 中使用新特性了，参考 [thymeleaf-extras-springsecurity 仓库](https://github.com/thymeleaf/thymeleaf-extras-springsecurity)。

使用标签属性来根据权限显示页面

```html
<!--未登录-->
<div sec:authorize="!isAuthenticated()">
    <a class="item" th:href="@{/toLogin}">
        <i class="address card icon"></i> 登录
    </a>
</div>

<div class="column" sec:authorize="hasRole('vip1')">
    <p>
        有相应权限才会显示
    </p>
</div>
```



### 参考

- [kuangshen-SpringSecurity: 狂神讲的SpringSecurity (gitee.com)](https://gitee.com/dotJunz/kuangshen-spring-security)



## Shiro

### 概念

> Apache Shiro 是一个 Java 安全权限框架。

JaveSE / JaveEE

一些功能：

- 身份验证
- 权限控制：角色权限或者特定做某事的权限
- 任何环境都可使用 Session API
- 在身份验证、访问权限控制的过程中或者 session 生命周期中都可以**做出响应**
- 合并多个用户权限的数据源，最终呈现用户的完整权限

**High-Level Overview**

![Shiro Basic Architecture Diagram](https://shiro.apache.org/images/ShiroBasicArchitecture.png)



### 10-minute-tutorial

**获取当前 Subject**

```java
Subject currentUser = SecurityUtils.getSubject();
```

`Subject` 其实就是用户，取决于当前线程与传入的请求。

**获取 Session**

```java
Session session = currentUser.getSession();
session.setAttribute( "someKey", "aValue" );
```

这个 Session 旨在用户可以在应用中使用相同的 API

- Web App 中基于 HttpSession
- no-web app 中就是 Enterprise Session

**用户登录**

```java
currentUser.login(token);
```

登录之后就可以操作当前用户：

- 打印姓名
- 判断角色
- 判断权限

> 【过时的文章】
>
> [Securing Web Applications with Apache Shiro | Apache Shiro](https://shiro.apache.org/webapp-tutorial.html)
>
> 在 jsp 的 web app 中整合 shiro：
>
> 1. 配置 `web.xml`
> 2. `shiro.ini`
> 3. 在 jsp 中使用 `<shiro>` 标签
> 4. 从后端读取角色和权限信息



### 整合进 Spring

方法一：依赖 `shiro-spring`，传统 Spring 项目

1. 导入前端静态页面，两个简单子页面、一个登录页面

2. 创建 `UserRealm` 继承 `AuthorizingRealm`，重写**授权**和**认证**方法。

3. `ShiroConfig` 配置类中分别注入：

   - UserRealm
   - DefaultWebSecurityManager
   - ShiroFilterFactoryBean

   🟠这里的写法值得学习，多个 @Bean 的链式调用

4. 在 `ShiroFilterFactoryBean` 中设置访问权限和登录跳转

5. 在 Controller 中进行用户登录操作 `subject.login()`，此时就会转到 `UserRealm` 中进行授权和认证操作

6. 整合 MyBatis，在 `UserRealm` 中查询数据库

7. 搭配 thymeleaf 根据权限显示内容

> 这里创建三个 Bean 和 Realm 类的操作对应着官方文档中 [整合进Spring Standalone Applications](https://shiro.apache.org/spring-framework.html)，注意有更好的 Web App 版本。

---

✅方法二：参考 [官网](https://shiro.apache.org/spring-boot.html) ，使用整合依赖 `shiro-spring-boot-web-starter`

1. 导入依赖

   ```xml
   <dependency>
     <groupId>org.apache.shiro</groupId>
     <artifactId>shiro-spring-boot-web-starter</artifactId>
     <version>1.9.1</version>
   </dependency>
   ```

2. 注入一个 Realm 类的实现，设置用户名、密码和角色权限。
   ```java
   @Bean
   public Realm realm() {
       TextConfigurationRealm realm = new TextConfigurationRealm();
       realm.setUserDefinitions("joe.coder=password,user\n" +
                                "jill.coder=password,admin");
   
       realm.setRoleDefinitions("admin=read,write\n" +
                                "user=read");
       realm.setCachingEnabled(true);
       return realm;
   }
   ```
   
3. 注入一个 `ShiroFilterChainDefinition` 来管理请求映射的权限。
   因为默认开启了注解，所以也可以直接在 Controller 类中使用 `@RequiresRoles` 和 `@RequiresPermissions` 直接在方法上检查权限。

   ```java
   @Bean
   public ShiroFilterChainDefinition shiroFilterChainDefinition() {
       DefaultShiroFilterChainDefinition chainDefinition = new DefaultShiroFilterChainDefinition();
       chainDefinition.addPathDefinition("/**", "anon"); // all paths are managed via annotations
       
       return chainDefinition;
   }
   ```

   ```java
   @Controller
   public class AccountInfoController {
   
       @RequiresRoles("admin")
       @RequestMapping("/admin/config")
       public String adminConfig(Model model) {
           return "view";
       }
   }
   ```
   
4. 配置文件
   ```properties
   shiro.loginUrl = /login.html
   
   # Let Shiro Manage the sessions
   shiro.userNativeSessionManager = true
   
   # disable URL session rewriting
   shiro.sessionManager.sessionIdUrlRewritingEnabled = false
   
   # 是否开启功能
   shiro.web.enabled=true
   ```

   关闭 shiro 之后，还有 `@RequiresRoles` 注解的方法就会报错。



### 学习官方案例

看的是官方示例项目 [shiro/samples/spring-boot-web at main · apache/shiro (github.com)](https://github.com/apache/shiro/tree/main/samples/spring-boot-web)

**两个和静态页面紧密相关的注解**

```java
@ControllerAdvice
@Configuration
public class SecurityConfig {
    
    @Bean
    public Realm realm() {}
    
     @Bean
    public ShiroFilterChainDefinition shiroFilterChainDefinition() {}
    
	@ModelAttribute(name = "subject")
    public Subject subject() {
        return SecurityUtils.getSubject();
    }
}
```

因为页面中需要解析用户的身份验证情况，所以要使用 `@ModelAttribute` 在请求之前在响应中并绑定一个当前用户的属性。

- `ModelAttribute` 需要写在 `@Controller` 控制类中，只处理此 Controller 的请求。
- 或者与 `@ControllerAdvice` 搭配写在 `@Configuration` 配置类中，会参与**全局的请求**。

![image-20221009115918635](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210091159108.png)

**关于登录表单**

如果不去指定 `action` 属性，默认会 POST 请求到当前网页地址。但凡写个 `/test` 提交的时候地址就会不一样。

```html
<form name="loginform" action="" method="POST" accept-charset="UTF-8" role="form">
    <fieldset>
        <div class="form-group">
            <input class="form-control" placeholder="Username or Email" name="username" type="text"/>
        </div>
        <div class="form-group">
            <input class="form-control" placeholder="Password" name="password" type="password" value=""/>
        </div>

        <input class="btn btn-lg btn-success btn-block" type="submit" value="Login"/>
    </fieldset>
</form>
```

**登录的请求路径**

- Controller 中接受的路径来源于页面中的登录页面链接 `/login`，然后会交给视图解析器处理返回模板中的登录页面。

- 登录页面中的表单提交路径 `/api/login` 对应着配置文件中的 `shiro.loginUrl` 和 ShiroFilterChainDefinition 的过滤器设置
  ```java
  @Bean
  public ShiroFilterChainDefinition shiroFilterChainDefinition() {
      DefaultShiroFilterChainDefinition chainDefinition = new DefaultShiroFilterChainDefinition();
      chainDefinition.addPathDefinition("/api/login", "authc"); // need to accept POSTs from the login form
      chainDefinition.addPathDefinition("/logout", "logout");
      chainDefinition.addPathDefinition("/admin/**", "anon"); // 交给注解处理
  
      return chainDefinition;
  }
  ```

**登录和注销请求需要显示声明**，其余的请求可以交给注解处理：

`@RequiresGuest` `@RequiresUser ` `@RequiresRoles`

![image-20221009120831573](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210091208710.png)

**角色的权限则是在注入 Realm 的方法中设置。**

#### 总结

使用 `shiro-spring-boot-web-starter` 来集成 shiro，总体只需要两个步骤：

1. 将 Realm 实例通过 `@Bean` 方法注入容器，需要进行一些设置，如用户和权限声明。
2. 注入 ShiroFilterChainDefinition 实例，最基础的可以用 DefaultShiroFilterChainDefinition 的方法 `addPathDefinition` 设置请求过滤器。

✅上面两个步骤中的设置部分就可以与 Service 层或配置文件交互，进行列表配置。

相比于传统整合，`SecurityManager` 和 `ShiroFilterFactoryBean` 都是由 SpringBoot 自动配置的。

==TODO：shiro.loginUrl 其实应该是指定登录页面，应该有个自动验证身份的自动配置会默认处理此POST命令，导致GET和POST必须是相同页面==

自己处理身份验证，就是在 controller 中

```java
Subject subject = SecurityUtils.getSubject();
try {
    subject.login(new UsernamePasswordToken(username, password));
    System.out.println("登录成功!");
} catch (AuthenticationException e) {
    e.printStackTrace();
    System.out.println("登录失败!");
}
```







参考：

- [Shiro 和 spring boot 的集成 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/75848572)





**配置 shiro**

==TODO: 还需要 ini 文件吗==

```properties
shiro.loginUrl = /login.html

# Let Shiro Manage the sessions
shiro.userNativeSessionManager = true

# disable URL session rewriting
shiro.sessionManager.sessionIdUrlRewritingEnabled = false

# 可以禁用shiro
shiro.web.enabled=false
```



**测试**

```
@RestController = @Controller + @ResponseBody
```

返回的是文本，不交给**视图解析器**处理。

只有 `@Controller` 则会被视图解析器解析。

==TODO：视图解析器是怎么被 Spring Boot 配置的？==

> 从 ThymeleafAutoConfiguration 找到 ThymeleafProperties
>
> 可以看到 Thymeleaf 处理解析的前后缀
>
> ```
> private static final Charset DEFAULT_ENCODING = StandardCharsets.UTF_8;
> 
> public static final String DEFAULT_PREFIX = "classpath:/templates/";
> 
> public static final String DEFAULT_SUFFIX = ".html";
> ```



### 使用

#### 身份验证 Authentication

[Java Authentication Guide with Apache Shiro | Apache Shiro](https://shiro.apache.org/java-authentication-guide.html)

1. 收集用户的身份标识（principals）和证书（credentials）
2. 将上面两个提交给身份验证系统
3. 结果是成功、重试或拒绝

```java
// 获取当前用户
Subject currentUser = SecurityUtils.getSubject();
// 传递姓名密码等
// 需要在try-catch块中 登陆失败会抛出异常
try {
    currentUser.login(token);
} catch () {} 

currentUser.logout();
```

Subject 对象支持两个方法：`isRemembered()` 和 `isAuthenticated()`

> 注意：如果用户被记住了，**并不代表**该用户已经被认证。
>
> 记住用户只是为了在低权限层面提供服务，例如定制化界面。如果需要使用高级权限一定要进行认证。



#### 授权 Authorization

[Java Authorization Guide with Apache Shiro | Apache Shiro](https://shiro.apache.org/java-authorization-guide.html)

核心元素：

1. `permissions` 描述了**资源类型**和能对其进行的**操作**，`能干什么事`
   - 资源层面，操作抽象的事物
   - 实例层面，操作具体的事物
   - 属性层面，操作具体事物上的几个具体属性
2. `Roles` 用一系列特定的权限简化了对角色和权限的管理
   - 隐式角色：`用户是 admin`
   - 显示角色：`用户能干什么事因为是 admin 角色`
3. `Users` 可以做特定的事情

**使用授权的三种方法**

- 编程式

```java
Subject currentUser = SecurityUtils.getSubject();

// 角色检测
if (currentUser.hasRole("administrator")) {
    // do sth.
} else {
}

// 权限检测
// String perm = "printer:print:laserjet4400n";
Permission printPermission = new PrinterPermission("laserjet3000n","print");

if (currentUser.isPermitted(printPermission)) {
    //do one thing
} else {
}
```

- 注解式，与 Spring 整合并开启注解

```java
// 权限控制
@RequiresPermissions("account:create")
public void openAccount( Account acct ) {
    //create the account
}

// 角色控制
@RequiresRoles( "teller" )
public void openAccount( Account acct ) {
    //do something in here that only a teller
    //should do
}
```

- 通过 JSP 标签来进行控制



#### 数据访问对象 Realm

[Apache Shiro Realms | Apache Shiro](https://shiro.apache.org/realm.html)

因为数据源会同时存放身份验证数据（密码）和授权数据（角色或权限），所以 `Realm` 可以进行身份验证和授权操作。

配置 Realm 的两种方法：

1. ✅在 `ini` 文件中配置 Realm
2. 使用实体类继承 Realm，并重写方法

```ini
fooRealm = com.company.foo.Realm
barRealm = com.company.another.Realm
bazRealm = com.company.baz.Realm

securityManager.realms = $fooRealm, $barRealm, $bazRealm
```



### 深入自动配置类

![image-20221009145035989](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210091450166.png)

**自动配置的先后顺序：**

1. `ShiroWebMvcAutoConfiguration` 中通过导入 `ShiroRequestMappingConfig` 类、判断有请求映射处理器并且是 servlet-based 的 web 应用才会生效，还会检查 `shiro.web.enabled` 的配置是否开启 shiro。

2. `ShiroWebAutoConfiguration` 继承了 `AbstractShiroWebConfiguration` ，确保在一些组件没有被显示注入的时候会注入默认实现类，例如 `SessionsSecurityManager` / `ShiroFilterChainDefinition` 等。

3. `ShiroAutoConfiguration` 继承了 `AbstractShiroConfiguration`，是 shiro 的最基础配置，会读取 `classpath:shiro.ini` 并注入 Realm 实例，使用配置文件就不用去实现 Realm 类。


在 `shiro.ini` 中就可以设定用户、角色和权限，但是 SpringBoot 项目中是要**与数据库交互**，所以还是要专注于 Java Config。

![image-20221009150843226](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210091508545.png)



## 多线程任务

1. 开启异步 `@EnableAsync`

2. 使用注解 `@Async`
   ```java
   // service
   @Async
   public void hello() {
       try {
           Thread.sleep(3000);
       } catch(InterruptedException e) {
           e.printStackTrace();
       }
       System.out.println("Hello...")
   }
   ```
   
3. 这样 Controller 中调用此方法后，还是能正常继续处理请求（网页不会卡在加载中）。

**遇到报错**

如果报错则使用 `@EnableAsync(proxyTargetClass = true)`

![image-20221008160045937](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210081600411.png)



## 邮件任务

> 怎么去看配置？
>
> 依赖 -> AutoConfigure -> ConfigProperties

1. 导入依赖 `spring-boot-starter-mail`
   ```xml
   <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-mail -->
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-mail</artifactId>
       <version>2.7.4</version>
   </dependency>
   ```

2. 配置文件

   ```yaml
   spring:
     mail:
       username: 邮箱地址
       password: 开启smtp时的授权密码
       host: smtp.163.com
   ```

3. 测试类中进行测试
   **发送方必须是自己的邮箱**

**简单邮件**

```java
@Autowired
JavaMailSenderImpl mailSender;

@Test
void testSend() {
    SimpleMailMessage mailMessage = new SimpleMailMessage();
    // set mailMessage
    mailMessage.setSubject("测试");
    mailMessage.setText("中午好");
    mailMessage.setFrom("");
    mailMessage.setTo("");
    mailSender.send(mailMessage);
}
```

**复杂邮件**

```java
@Test
void testSend2() {
	MimeMessage mimeMessage = mailSender.createMimeMessage();
    // 使用Helper来添加内容和附件等
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true); // ture表示允许分多个部分
    helpr.setSubject("");
    helper.setText(""); // 可以是富文本
    helper.addAttachment(""); // 附件
   	
    helper.setTo("");
    helper.setFrom("");
    mailSender.send(mailMessage);
}
```

`MimeMessage` 可以包含 HTML 文本，也能使用 `<style>` 标签然后指定 class。

居中的排版可以使用 flexbox 来实现

**使用内嵌图片**

通过 contentId 获取

```java
message.setText("my text <img src='cid:myLogo'>", true); // true开启html支持
message.addInline("myLogo", new ClassPathResource("img/mylogo.gif"));
```

![image-20221008130248949](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210081302048.png)

## 定时任务

1. 开启定时功能 `@EnableScheduling` 可以加到 Config 类上
2. 在 Service 的方法上使用 `@Scheduled(cron = "")` 需要使用 cron 表达式

> cron 表达式
>
> 秒 分 时 日 月 周几   
>
> 使用在线表达式工具

注意：应用开启之后，方法的计划任务就**已经开始**了，不是要去调用它才会开始。

如果写在测试类中由于应用执行完 `@Test` 方法就会结束所以没法测试。需要添加 [Awaitility](https://github.com/awaitility/awaitility) 依赖但是没有必要，直接启动 web 应用就行了。

==TODO：怎么去开启与停用==



## 多任务项目结构

一、将开启异步、定时任务的注解都放到 Config 类上。

```java
@Configuration
@EnableScheduling
@EnableAsync(proxyTargetClass = true)
public class TaskConfig {
}
```

这样在 Service 层就能直接使用相应注解。

二、记得要声明 Service 接口再去实现，`@Autowired` 装配的是实现类。

三、运行测试类要有主运行类

```java
@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
```

```java
@SpringBootTest
public class SendMailTest {
    @Test
    void test(){}
}
```





## 分布式 Dubbo / Zookeeper

### 概念

> 分布式系统是若干独立计算机的集合，这些计算机对于用户来说就像单个相关系统。

架构的变化：

- 单一应用架构 ORM
- 垂直应用架构 MVC
- 分布式服务架构 RPC：抽取核心业务，形成服务中心
- 流动计算架构 SOA：资源调度和治理中心

RPC（Remote Procedure Call）**远程过程调用**。

核心模块：通讯、序列化。

> 两台服务器A，B，一个应用部署在A服务器上，想要调用B服务器上应用提供的函数/方法，由于不在一个内存空间，不能直接调用，需要通过网络来表达调用的语义和传达调用的数据。

![rpc architecture](https://learn.microsoft.com/en-us/windows/win32/rpc/images/prog-a11.png)



### Dubbo

![//imgs/architecture.png](https://dubbo.apache.org/imgs/architecture.png)

| 节点        | 角色说明                               |
| ----------- | -------------------------------------- |
| `Provider`  | 暴露服务的服务提供方                   |
| `Consumer`  | 调用远程服务的服务消费方               |
| `Registry`  | 服务注册与发现的注册中心               |
| `Monitor`   | 统计服务的调用次数和调用时间的监控中心 |
| `Container` | 服务运行容器                           |

**需要安装 zookeeper 来提供服务的注册与发现。**

> 实现服务发现的方式有很多种，Dubbo 提供的是一种 Client-Based 的服务发现机制，通常还需要部署额外的第三方注册中心组件来协调服务发现过程，如常用的 Nacos、Consul、Zookeeper 等

zookeeper 是服务端，Java 程序是客户端。

还可以使用 dubbo-admin 来可视化管理服务。



### 项目测试

[Annotation 配置 | Apache Dubbo](https://dubbo.apache.org/zh/docs3-v2/java-sdk/reference-manual/config/annotation/)

参考官方文档和项目进行配置。

**consumer 和 provider 要有相同的包结构，然后 provider 作为依赖被引用**

> 报错：@Service interfaceClass() or interfaceName() or interface class must be present
>
> 原因：@DubboService 修饰的类必须是实现接口的形式。
>
> 于是父项目最好要有三个模块：
>
> - interface
> - provider
> - consumer

`@DubboService` 注解应用于 provider 的服务类上，并且必须是一个服务接口的**实现类**。

`@EnableDubbo` 要加在 provider 和 consumer 的启动类上。

`@DubboReference` 注解则是使用在 consumer 模块中，**在静态方法中使用时需要从容器中取**。

父项目依赖：

✅ `<dependencyManagement>` 的作用就是统一管理子模块依赖版本。

```xml
<properties>
    <maven.compiler.source>8</maven.compiler.source>
    <maven.compiler.target>8</maven.compiler.target>
    <spring.version>4.3.16.RELEASE</spring.version>
    <dubbo.version>3.0.7</dubbo.version>
    <junit.version>4.13.1</junit.version>
    <slf4j-log4j12.version>1.7.25</slf4j-log4j12.version>
    <spring-boot.version>2.3.1.RELEASE</spring-boot.version>
    <spring-boot-maven-plugin.version>2.1.4.RELEASE</spring-boot-maven-plugin.version>
</properties>

<dependencyManagement>
    <dependencies>
        <!-- Spring Boot -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-bom</artifactId>
            <version>${dubbo.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-dependencies-zookeeper</artifactId>
            <version>${dubbo.version}</version>
            <type>pom</type>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
        <version>${slf4j-log4j12.version}</version>
    </dependency>
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
    </dependency>

    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

子模块依赖：

```xml
<dependencies>
    <!-- dubbo -->
    <dependency>
        <groupId>org.apache.dubbo</groupId>
        <artifactId>dubbo</artifactId>
    </dependency>
    <dependency>
        <groupId>org.apache.dubbo</groupId>
        <artifactId>dubbo-dependencies-zookeeper</artifactId>
        <type>pom</type>
    </dependency>

    <!-- dubbo starter -->
    <dependency>
        <groupId>org.apache.dubbo</groupId>
        <artifactId>dubbo-spring-boot-starter</artifactId>
    </dependency>

    <!-- spring starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-autoconfigure</artifactId>
    </dependency>
</dependencies>
```

**关于 zookeeper**

官方示例项目中使用了一个内置的 zookeeper。

在我测试的时候，可以直接使用 docker 容器。[zookeeper - Official Image | Docker Hub](https://hub.docker.com/_/zookeeper)

```bash
$ docker run --name some-zookeeper --restart always -d zookeeper
```

会自动暴露 2181 端口，很方便。



#### 总结

1. 使用 Docker 启动 zookeeper 容器挂在后台。
2. 仔细配置好父项目和子模块的依赖
3. 子模块的配置文件 `application.yml` 
4. 使用 `@DubboService` 、 `@DubboReference` 、 `EnableDubbo` 等注解。
5. 依次启动 provider 类和 consumer 类。



### 参考

- [shiro_kuang: 分享第一次学习shiro，整合springboot，在idea中。 学习视频来源（狂神说Java） (gitee.com)](https://gitee.com/fenggbinn/shiro_kuang)
