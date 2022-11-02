---
title: Spring笔记
date: 2021-10-27 01:01:38
tags:
  - Java
---

<img src="https://raw.githubusercontent.com/Nova-mist/HexoBlogResources/main/images/2021/october/blog-image-20211027-1635268244.jpg" alt="blog-image-20211027-1635268244" style="zoom: 25%;" />

跟着[【狂神说Java】Spring5最新完整教程IDEA版通俗易懂_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1WE411d7Dv) 学习的一些笔记。

<!-- more -->

## 1 概述

>   官网 http://spring.io/
>
>   下载 https://repo.spring.io/libs-release-local/org/springframework/spring/
>
>   GitHub https://github.com/spring-projects

创建 Spring 的主要目的是用来替代更加重量级的 EJB（Enterprise JavaBean）

**核心特点：**

-   依赖注入（Dependency Injection，DI）
-   面向切面编程（Aspect-Oriented Programming，AOP）

**Spring 框架七大模块**

**Spring Boot --> Spring Cloud**

>   Spring Boot 是 Spring 的一套快速配置脚手架，可以基于Spring Boot 快速开发单个微服务
>
>   Spring Cloud独立使用开发项目，但是Spring Cloud离不开Spring Boot，属于依赖的关系

 

**导入包**

1.   spring-webmvc
2.   spring-jdbc

 

## 2. IOC 理论推导

inversion of control
set 动态注入
就像网站页面的自定义，**耦合性大大下降**

>   **控制反转是一种通过描述（XML或注解）并通过第三方去生产或获取特定对象的方式。在Spring中实现控制反转的是IoC容器，其实现方法是依赖注入（Dependency Injection,DI）。**

```java
// UserServiceImpl.java
private UserDao userDao;
// set动态注入
public void setUserDao(UserDao userDao) {
    this.userDao = userDao;
}
// myTest.java
// 由测试代码创建需要使用的对象
UserService service = new UserServiceImpl();
((UserServiceImpl)service).setUserDao(new UserDaoMysqlImpl());
service.getUser();
```

 

### 3. HelloSpring

**一定要在上一层导入 spring-webmvc**

**Spring 配置写法**

[Core Technologies (spring.io)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#spring-core)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
    <!--bean就是java对象，由Spring创建和管理-->
    <bean id="hello" class="完整的包路径">
        <property name="name" value=""/>
    </bean>
</beans>
```

id 和 name 相当于变量名，value 值 & ref 引用另外一个bean

```java
@Test
public void test(){
   //解析beans.xml文件 , 生成管理相应的Bean对象
   ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
   //getBean : 参数即为spring配置文件中bean的id .
   Hello hello = (Hello) context.getBean("hello");
   hello.show();
}
```

可以向容器传入多个配置文件

>   要实现不同的操作 , 只需要在xml配置文件中进行修改，**即对象由Spring 来创建 , 管理 , 装配**

 

## 4. IOC 构建对象的方式

**在创建Bean的时候，容器中的对象就已经创建。**

- 无参
- 有参

**配置文件的有参三种写法**

```xml
<!-- 第一种根据index参数下标设置 -->
<bean id="userT" class="com.ysama.pojo.UserT">
<constructor-arg index="0" value=""/>
</bean>
```

```xml
<!-- 第二种根据参数名字设置 -->
<bean id="userT" class="com.ysama.pojo.UserT">
<constructor-arg name="name" value=""/>
</bean>
```

```xml
<!-- 第三种根据参数类型设置 -->
<bean id="userT" class="com.ysama.pojo.UserT">
   <constructor-arg type="java.lang.String" value=""/>
</bean>
```

**推荐直接通过参数名构造**

 

## 5. Spring配置

```xml
<!--设置别名：在获取Bean的时候可以使用别名获取-->
<alias name="userT" alias="userNew"/>
```

-   如果配置id,又配置了name,那么name是别名
-   **name可以设置多个别名,可以用逗号,分号,空格隔开**
-   class是bean的全限定名=包名+类名

**团队的合作通过import来实现 .** 导入到同一个beens总配置

```xml
<import resource="{path}/beans.xml"/>
```

 

## 6. 依赖注入

### 6.1 Set注入

**bean对象中的所有属性，由容器来注入。**

-   构造器注入
-   Set 注入
    -   [Core Technologies (spring.io)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-collection-elements) 常量、集合、空值、Null、properties

**声明了类型就可以不用强转**

```xml
ApplicationContext context = new ClassPathXmlApplicationContext("userbeans.xml");
User user = context.getBean("user", User.class);
```



### 6.2 命名空间注入

**需要在头文件中加入约束文件**

[Core Technologies (spring.io)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-p-namespace)

-   P命名空间注入 :  **Property**

```xml
 导入约束 : xmlns:p="http://www.springframework.org/schema/p"
 
 <!--P(属性: properties)命名空间 , 属性依然要设置set方法-->
 <bean id="user" class="" p:name="" p:age=""/>
相当于<property nam="name/age" value=""></property>
```

-   c 命名空间注入 :  **Constructor**

```xml
 导入约束 : xmlns:c="http://www.springframework.org/schema/c"
 <!--C(构造: Constructor)命名空间 , 属性依然要设置set方法-->
 <bean id="user" class="" c:name="狂神" c:age=""/>
```

**需要添加有参、无参构造器**

### 6.3 Bean的作用域

[Core Technologies (spring.io)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes)

>   bean就是由IoC容器初始化、装配及管理的对象。

-   单例模式 singleton

    ```xml
     <bean id="ServiceImpl" class="cn.csdn.service.ServiceImpl" scope="singleton">
    ```

    ```java
     @Test
     public void test03(){
         ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
         User user = (User) context.getBean("user");
         User user2 = (User) context.getBean("user");
         System.out.println(user==user2);
     }
    ```

-   原型模式 Prototype

-   Request
    每个HTTP请求都会有各自的bean实例

-   Session

-   application

-   websocket



## 7. Bean自动装配

装配Bean的三种方式：

1.   在 xml 中显示配置
2.   在 java 中显示配置
3.   **隐式的自动装配**

### 7.1 按名称自动装配

```xml
<bean id="user" class="" autowire="byName">
   <property name="" value=""/>
</bean>
```

>   当一个bean节点带有 autowire byName的属性时。
>
>   1.  将查找其类中所有的set方法名，例如setCat，获得将set去掉并且首字母小写的字符串，即cat。
>   2.  去spring容器中寻找是否有此字符串名称id的对象。
>   3.  如果有，就取出注入；如果没有，就报空指针异常。

### 7.2 按类型自动装配

```xml
<bean id="user" class="" autowire="byType">
   <property name="" value=""/>
</bean>
```

同一类型的对象，在 Spring 容器中唯一。



### 7.3 注解自动装配

[Core Technologies (spring.io)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-annotation-config)

[狂神说Spring04：自动装配 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247484114&idx=1&sn=e5c923959587068e5cbeaf0fe6971912&scene=19#wechat_redirect)

1、在spring配置文件中引入context文件头

```
xmlns:context="http://www.springframework.org/schema/context"

http://www.springframework.org/schema/context
http://www.springframework.org/schema/context/spring-context.xsd
```

2、**开启属性注解支持！**

```
<context:annotation-config/>
```

**@Autowired**

```java
public class User {
   @Autowired
   private Cat cat;
   @Autowired
   private Dog dog;
   private String str;

   public Cat getCat() {
       return cat;
  }
   public Dog getDog() {
       return dog;
  }
   public String getStr() {
       return str;
  }
}
```

**可以去掉 set 方法**

```java
@Nullable 字段可以为null
```

```java
//如果允许对象为null，设置required = false,默认为true
@Autowired(required = false)
private Cat cat;
```

**@Qualifier**

-   @Autowired是根据类型自动装配的，加上@Qualifier则可以根据byName的方式自动装配
-   @Qualifier不能单独使用。

```java
@Autowired
@Qualifier(value = "cat2")
private Cat cat;
@Autowired
@Qualifier(value = "dog2")
private Dog dog;
```

**@Resource**

-   @Resource如有指定的name属性，先按该属性进行byName方式查找装配；
-   其次再进行默认的byName方式进行装配；
-   如果以上都不成功，则按byType的方式自动装配。
-   都不成功，则报异常。

```java
public class User {
   //如果允许对象为null，设置required = false,默认为true
   @Resource(name = "cat2")
   private Cat cat;
   @Resource
   private Dog dog;
   private String str;
}
```

>   **@Autowired先byType，@Resource先byName。**



## 8. 使用注解开发

>   在spring4之后，想要使用注解形式，必须得要引入aop的包

**实际开发中一般会使用注解**

### 8.1 bean的实现

1.   配置文档中引用context约束

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:context="http://www.springframework.org/schema/context"
      xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd">

</beans>
```

2.   配置扫描哪些包下的注解

```xml
<!--指定注解扫描包-->
<context:component-scan base-package="com.ysama.pojo"/>
```

3.   在指定包下编写类，增加注解  **默认类名的小写**

```java
@Component("user")
// 相当于配置文件中 <bean id="user" class="当前注解的类"/>
public class User {
   public String name = "";
}
```

### 8.2 属性注入

1.   不适用 set 方法，直接在直接名上添加@value("值")

     ```java
     @Component("user")
     // 相当于配置文件中 <bean id="user" class="当前注解的类"/>
     public class User {
        @Value("")
        // 相当于配置文件中 <property name="name" value=""/>
        public String name;
     }
     ```

2.   如果提供了set方法，在set方法上添加@value("值");

### 8.3 衍生注解 作用域

**衍生注解：**

-   @Controller：web层
-   @Service：service层
-   @Repository：dao层

**作用域：**

-   singleton 默认单例模式
-   prototype 多例模式

```java
@Controller("user")
@Scope("prototype")
public class User {
   @Value("")
   public String name;
}
```

```xml
<context:annotation-config/>  
```

作用：

-   进行注解驱动注册，从而使注解生效
-   用于激活那些已经在spring容器里注册过的bean上面的注解，也就是显示的向Spring注册
-   **如果不扫描包，就需要手动配置bean**
-   **如果不加注解驱动，则注入的值为null！**

## 9. 使用java配置

[Core Technologies (spring.io)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-java)

```java
// MyConfig.java
@Configuration
public class AppConfig {

    @Bean
    public MyService myService() {
        return new MyServiceImpl();
    }
}
```

**相当于**

```xml
<beans>
    <bean id="myService" class="com.acme.services.MyServiceImpl"/>
</beans>
```

**测试**

```java
@Test
public void test() {
    ApplicationContext applicationContext =
           new AnnotationConfigApplicationContext(MyConfig.class);
   Dog dog = (Dog) applicationContext.getBean("dog");
   System.out.println(dog.name);
}
```

**导入其他配置类**

```java
@Configuration
@Import(MyConfig2.class)  //导入合并其他配置类，类似于配置文件中的 inculde 标签
public class MyConfig {

   @Bean
   public Dog dog(){
       return new Dog();
  }

}
```

@ComponentScan("") 包扫描



## 10 代理模式

[狂神说Spring06：静态/动态代理模式 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247484130&idx=1&sn=73741a404f7736c02bcdf69f565fe094&scene=19#wechat_redirect)

### 10.1 静态代理

```java
// AbstractSubject.java
public interface AbstractSubject {
    public void myMethod();
}
// RealSubject.java
public class RealSubject implements AbstractSubject {
    @Override
    public void myMethod(){
        // do sth.
    }
}
// Proxy.java
public class Proxy implements AbstractSubject {
    private RealSubject realSubject;
    // constructor & setter
    public void myMethod() {
        realSubject.myMethod();
    }
}
// Client.java
public class Client {
    psvm {
        Proxy proxy = new Proxy(new RealSubject());
        proxy.myMethod();
    }
}
```

>   在不改变原来代码的情况下，实现对原有功能的增强。

### 10.2 动态代理

-   基于接口动态代理 JDK
-   基于类的动态代理 cglib

**JDK 原生代码实现**

1.   InvocationHandler
2.   Proxy

```java
Object invoke(Object proxy, 方法 method, Object[] args)；
//生成代理类
public Object getProxy(){
   return Proxy.newProxyInstance(this.getClass().getClassLoader(),
                                 rent.getClass().getInterfaces(),this);
}
```

```java
Host host = new Host();
ProxyInvocationHandler pih = new ProxyInvocationHandler();
// 传入要代理的对象
pih.setRent(host);
// 获取返回的代理对象
Rent proxy = (Rent) pih.getProxy();
proxy.rent();
```

>   动态代理可以代理多个类，代理的是接口



## 11 AOP

### 概念

[狂神说Spring07：AOP就这么简单 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247484138&idx=1&sn=9fb187c7a2f53cc465b50d18e6518fe9&scene=19#wechat_redirect)

在程序运行流程中的**横切关注点**调用**切面**（日志类）的**通知**（日志方法），在**切入点**（方法前后等）向**目标对象**（原有业务方法）织入切面（类似装饰器）**生成代理对象**。

![image-20221030022254604](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210300222681.png)

Spring中支持5种类型的Advice。

- 方法前
- 方法后
- 方法抛出异常
- 类中增加新的方法属性



### 准备

`SpringBoot`

- 导入依赖包

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.2</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-aop</artifactId>
    </dependency>
</dependencies>
```

- 创建 Service 接口和实现类

```java
public interface UserService {
    void add();
    void delete();
    void update();
    void search();
}

@Service("userService")
public class UserServiceImpl implements UserService {
    @Override
    public void add() {
        System.out.println("增加用户");
    }
    @Override
    public void delete() {
        System.out.println("删除用户");
    }
    @Override
    public void update() {
        System.out.println("更新用户");
    }
    @Override
    public void search() {
        System.out.println("查询用户");
    }
}
```

- 创建启动类和测试类

> SpringBoot 中使用 @Service 注解自动将类注入到 Spring 容器中，再通过 @Autowired 自动装配，可以搭配 @Qualifier 装配指定 id 的 bean。
>
> 默认开启了注解、配置包扫描，很方便。
>
> 唯一需要注意的是：测试类中使用 @Autowired 需要有 SpringBoot 启动类。

`Plain Spring`

- 导入依赖包
- 创建启动类和测试类

- Spring 配置文件：显式注入 Bean 或配置注解

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context
    http://www.springframework.org/schema/context/spring-context.xsd">
    
    <!-- 方法一：使用注解-->
    <!-- 配合@Service("userService") -->
    <context:annotation-config/>
    <context:component-scan base-package="com.ysama.service"/>
    
    <!-- 方法二：显式指定 -->
    <!-- <bean id="userService" class="com.ysama.service.UserServiceImpl" /> -->

</beans>
```

- 测试类中手动获取 Bean

```java
public class MyTest {

    @Test
    public void test(){
        // 创建了Spring容器
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");

        // beans.xml中显式注入或使用@Service注解时指定id
        UserService userService = (UserService) context.getBean("userService");

        // 指定类型 不需要强制转换
        UserService userService2 = context.getBean("userService",UserServiceImpl.class);

        // 容器中只存在唯一类的时候不需要指定id
        UserService userService3 = context.getBean(UserServiceImpl.class);

        userService.search();
    }
}
```



### 注意

下面前两种方法实现都用到了 `beans.xml`。在 SpringBoot 中需要在启动类中指定读取配置文件。

```java
@SpringBootApplication
@ImportResource(locations = {"classpath:beans.xml"})
public class MainApp {
    public static void main(String[] args) {
        SpringApplication.run(MainApp.class, args);
    }
}
```

🟢第三种注解实现的方法，就可以直接在 `application.yaml` 中设置自动织入切面。（**推荐 SpringBoot 只用注解**）

```yaml
spring:
  application:
    name: "springboot-aop-annotation-pointcut"
  aop:
    auto: true
    proxy-target-class: true
```



### 11.1 通过 Spring API 实现

1.   类实现API接口

```java
@Component("afterLog")
public class AfterLog implements AfterReturningAdvice {
    @Override
    public void afterReturning(Object returnValue, Method method, Object[] args, Object target) throws Throwable {
        System.out.println("执行了" + args.getClass().getName() + "的" + method.getName() + "方法，返回值：" + returnValue);
    }
}

@Component("log")
public class Log implements MethodBeforeAdvice {
    @Override
    public void before(Method method, Object[] args, Object target) throws Throwable {
        System.out.println(args.getClass().getName() + "的" + method.getName() + "方法被执行了");
    }
}
```

2.   在 Spring 文件中注册，实现aop切入实现，导入约束

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/aop
                           http://www.springframework.org/schema/aop/spring-aop.xsd">

    <aop:config>
        <!--切入点 expression:表达式匹配要执行的方法-->
        <aop:pointcut id="pointcut" expression="execution(* com.ysama.service.UserServiceImpl.*(..))"/>
        <!--执行环绕; advice-ref执行方法 . pointcut-ref切入点-->
        <aop:advisor advice-ref="log" pointcut-ref="pointcut"/>
        <aop:advisor advice-ref="afterLog" pointcut-ref="pointcut"/>
    </aop:config>

</beans>
```

3.   测试

**动态代理的是接口**

使用了 aop 织入切面以后，容器中返回的是 proxy，不能通过类来获取，并且需要**类型转换**。

```java
UserService userService = (UserService) context.getBean("userService");
```



### 11.2 自定义类实现 AOP

```java
// @Component("diy")
public class DiyPointcut {
   public void before(){
       System.out.println("---------方法执行前---------");
  }
   public void after(){
       System.out.println("---------方法执行后---------");
  }
}
```

**在 Spring 中注册，定义了切面 aop:aspect** 

需要导入正确的命名空间

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/aop
                           http://www.springframework.org/schema/aop/spring-aop.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
    <bean id="diy" class="com.ysama.config.DiyPointcut"/>
    <aop:config>
        <!--第二种方式：使用AOP的标签实现-->
        <aop:aspect ref="diy">
            <aop:pointcut id="diyPonitcut" expression="execution(* com.ysama.service.UserServiceImpl.*(..))"/>
            <aop:before pointcut-ref="diyPonitcut" method="before"/>
            <aop:after pointcut-ref="diyPonitcut" method="after"/>
        </aop:aspect>
    </aop:config>
<beans/>
```

### 11.3 注解实现

```java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
// @Component
@Aspect
public class AnnotationPointcut {
    @Before("execution(* com.ysama.service.UserServiceImpl.*(..))")
    public void before(){
        System.out.println("before method");
    }
    @After("execution(* com.ysama.service.UserServiceImpl.*(..))")
    public void after(){
        System.out.println("after method");
    }
    // @Around
}
```

```xml
<?xml version = "1.0" encoding = "UTF-8"?>
<beans xmlns = "http://www.springframework.org/schema/beans"
       xmlns:xsi = "http://www.w3.org/2001/XMLSchema-instance" 
       xmlns:aop = "http://www.springframework.org/schema/aop"
       xsi:schemaLocation = "http://www.springframework.org/schema/beans
                             http://www.springframework.org/schema/beans/spring-beans-3.0.xsd 
                             http://www.springframework.org/schema/aop 
                             http://www.springframework.org/schema/aop/spring-aop-3.0.xsd ">
    <!--第三种方式:注解实现-->
    <bean id="annotationPointcut" class="com.ysama.config.AnnotationPointcut"/>
    <aop:aspectj-autoproxy/>
</beans>
```

>   <aop:aspectj-autoproxy />有一个proxy-target-class属性，默认为false，表示使用jdk动态代理织入增强，当配为<aop:aspectj-autoproxy  poxy-target-class="true"/>时，表示使用CGLib动态代理技术织入增强。不过即使proxy-target-class设置为false，如果目标类没有声明接口，则spring将自动使用CGLib动态代理。

自动为spring容器中那些配置@aspectJ切面的bean创建代理，织入切面。

[＜aop:aspectj-autoproxy /＞作用_决战灬的博客-CSDN博客_aop:aspectj-autoproxy](https://blog.csdn.net/weixin_38987366/article/details/109535930)



### 注解与配置是两种方式

|                      | Plain Spring / SpringMVC       | SpringBoot                                 |
| -------------------- | ------------------------------ | ------------------------------------------ |
| 配置文件             | beans.xml                      | application.yaml                           |
| 使用 @Component 注解 | 需要手动开启注解、设置包扫描   | 默认配置                                   |
| 测试                 | 手动获取 ApplicationContext    | 需要使用启动类                             |
| 注入 bean            | beans.xml 中手动指定、使用注解 | 使用注解                                   |
| 补充                 |                                | **可以使用 @ImportResource 导入 xml 配置** |

> SpringMVC + 充分的 beans.xml = SpringBoot

|          | 配置                                       | 注解                       |
| -------- | ------------------------------------------ | -------------------------- |
| 注入bean | beans.xml 中显式指定                       | @Component("id")           |
| 获取bean | Plain Spring 中手动获取 ApplicationContext | @Autowired 搭配 @Qualifier |
|          |                                            |                            |

