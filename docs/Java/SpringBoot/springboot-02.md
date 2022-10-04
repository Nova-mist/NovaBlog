---
title: springboot-02
date: 2022-03-14 16:17:17
tags:
  - Java
  - SpringBoot
---

**配置文件相关、自动配置原理**

<!-- more -->

## 运行原理

[狂神说SpringBoot02：运行原理初探 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247483743&idx=1&sn=431a5acfb0e5d6898d59c6a4cb6389e7&scene=19#wechat_redirect)

### 启动器

项目的父依赖 `spring-boot-starter-parent` 再向上还有一个父依赖 `spring-boot-dependencies`，即管理SpringBoot版本控制中心。

>   以后导入依赖就可以默认不写版本。
>
>   但是如果导入的包没有在依赖中管理就需要手动配置版本。

包含的启动器依赖见 [官方文档](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.build-systems.starters)。

**springboot-boot-starter-xxx**：就是spring-boot的场景启动器。

>   SpringBoot将所有的功能场景都抽取出来，做成一个个的starter （启动器），只需要在项目中引入这些starter即可，所有相关的依赖都会导入进来 ， 我们要用什么功能就导入什么样的场景启动器即可。

### 主启动类

默认主启动类

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

**@SpringBootApplication**：标注SpringBoot的主配置类，通过运行这个类的main方法来启动SpringBoot应用。该注解中还有其他注解：

-   **@ComponentScan**：自动扫描并加载符合条件的组件或bean到IOC容器中。
-   **@SpringBootConfiguration**
    -   @Configuration：说明是一个配置类，对应Spring的xml配置文件。
    -   @Component：说明启动类也是一个Spring组件，负责启动应用。
-   **@EnableAutoConfiguration**：开启自动配置功能。
    -   @AutoConfigurationPackage：自动配置包。
    -   @Import(AutoConfigurationImportSelector.class)：给容器导入组件。

AutoConfigurationImportSelector：自动配置导入选择类

这个类中有一个方法getCandidateConfigurations

```java
// 获得候选的配置
protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
    //这里的getSpringFactoriesLoaderFactoryClass（）方法
    //返回的就是我们最开始看的启动自动导入配置文件的注解类；EnableAutoConfiguration
    List<String> configurations = SpringFactoriesLoader.loadFactoryNames(this.getSpringFactoriesLoaderFactoryClass(), this.getBeanClassLoader());
    Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you are using a custom packaging, make sure that file is correct.");
    return configurations;
}
// ...
protected Class<?> getSpringFactoriesLoaderFactoryClass() {
    return EnableAutoConfiguration.class;
}
```

接着调用了SpringFactoriesLoader 类的静态方法loadFactoryNames，进而又调用了loadSpringFactories方法。

在loadSpringFactories方法中，会去获取资源**"META-INF/spring.factories"**，并将读取到的资源遍历，封装成一个Properties类。

### spring.factories

在依赖 `spring-boot-autoconfigure` 下找到spring.factories文件，打开会发现很多自动配置的文件，**就是自动配置的根源**。

![image-20220302154828923](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220302154828923.png)

![image-20220302155100763](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220302155100763.png)

**打开一个自动配置类查看，例如WebMVCAutoConfiguration，会发现属于JavaConfig配置类，并且注入了Bean。**

![image-20220302155221789](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/image-20220302155221789.png)

### 步骤总结

1.  SpringBoot在启动的时候从类路径下的META-INF/spring.factories中获取**EnableAutoConfiguration指定的值**（来自于导入的对应的start启动器）。所有自动配置类都在路径下，但只有符合指定的条件才会生效。
2.  将这些值作为自动配置类导入容器 ， 自动配置类就开始生效 ， 帮我们进行自动配置工作（导入并配置好场景所需的所有组件），就不用手动编写配置并注入。
3.  整个J2EE的整体解决方案和自动配置都在springboot-autoconfigure的jar包中。

### SpringApplication

SpringApplication.run方法分两部分：

-   SpringApplication的实例化
-   run方法的执行

**这个类主要做了以下四件事情：**

1、推断应用的类型是普通的项目还是Web项目

2、查找并加载所有可用初始化器 ， 设置到initializers属性中

3、找出所有的应用程序监听器，设置到listeners属性中

4、推断并设置main方法的定义类，找到运行的主类

**run方法的流程分析图**

![img](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/640)



## yaml配置注入

### 语法

配置文件的作用：修改SpringBoot自动配置的默认值。

yaml语法特点：

1.   空格不能省略
2.   用缩进控制层级关系
3.   属性和值大小写敏感

application.yaml例子

```yaml
# 普通的key-value形式
name: ysama
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
```

application.properties例子

```properties
# 只能保存键值对
name=ysama
student.name=ysama
student.age=22

server.port=8082
```

### 赋值

**原生的赋值方式**：使用@Component、@Value、@Autowired注解。

Alt+Insert 设置有参无参构造器、setter/getter、toString方法。

```java
@Component //注册bean
@Qualifier("dog1") // 限定符
public class Dog {
    @Value("阿黄")
    private String name;
    @Value("18")
    private Integer age;
}
```

```java
@SpringBootTest
class DemoApplicationTests {
    @Autowired //将狗狗自动注入进来
    @Qualifier("dog1")
    Dog dog;
    @Test
    public void contextLoads() {
        System.out.println(dog); //打印看下狗狗对象
    }
}
```

**使用yaml配置的赋值方式**

```yaml
person:
  name: ysama
  age: 22
  happy: false
  birth: 2000/10/04
  maps: {a1: b1, a2: b2}
  lists:
    - a
    - b
    - c
  dog:
    name: ok
    age: 23
```

```java
/*
@ConfigurationProperties作用：
将配置文件中配置的每一个属性的值，映射到这个组件中；
告诉SpringBoot将本类中的所有属性和配置文件中相关的配置进行绑定
参数 prefix = “person” : 将配置文件中的person下面的所有属性一一对应
*/
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

**yaml配置的应用：将之前的配置文件修改为配置类，通过yaml配置进行注入。**

### 问题

**出现问题报错，但不影响程序运行，添加依赖可修复。**

>   Spring Boot Configuration Annotation Processor not configured.

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

### 配置文件中的变量

```yaml
person:
    name: qinjiang${random.uuid} # 随机uuid
    age: ${random.int}  # 随机int
    happy: false
    birth: 2000/01/01
    maps: {k1: v1,k2: v2}
    lists:
      - code
      - girl
      - music
    dog:
      name: ${person.hello:other}_旺财 # 前项不存在就取冒号后的值
      age: 1
```



### 其他的注入形式

**@PropertySource ：**加载指定的配置文件；

**@configurationProperties**：默认从全局配置文件中获取值；

```java
@Component //注册bean
@PropertySource(value = "classpath:user.properties")
public class User {
    //直接使用@value
    @Value("${my.name}") //从配置文件中取值
    private String name;
    @Value("#{9*2}")  // #{SPEL} Spring表达式
    private int age;
    @Value("男")  // 字面量
    private String sex;
}
```

### 配置注入和@value对比

|                | @ConfigurationProperties | @Value     |
| -------------- | ------------------------ | ---------- |
| 功能           | 批量注入配置文件中的属性 | 一个个指定 |
| 松散绑定       | 支持                     | 不支持     |
| SpEL表达式     | **不支持**               | **支持**   |
| JSR303数据校验 | 支持                     | 不支持     |
| 复杂类型封装   | 支持                     | 不支持     |

说明：

1.   松散绑定就是支持松散的语法，即yaml中的 `last-name` 等同于实体类中的 `lastName` ，默认 `-` 后面跟着的字母是大写的。
2.   JSR303数据校验就是在字段是增加一层过滤器验证，可以保证数据的合法性。
3.   复杂类型封装：yml中可以封装对象 ，使用value就不支持。
4.   SpEL表达式：即**Spring表达式语言**，可以缩减代码量，主要用于
     -   注解@Value
     -   XML配置
     -   创建Expression对象来执行SpEL
5.   **如果在业务中只需要获取配置文件的某个值可以使用@Value；如果需要专门编写JavaBean来和配置文件进行映射就直接使用@ConfigurationProperties从配置文件中获取值。**



## JSR303数据校验

Springboot中可以用**@validated**来校验数据，如果数据异常则会统一抛出异常，方便异常中心统一处理。

**例如Email的格式校验**

```java
@Component //注册bean
@ConfigurationProperties(prefix = "person")
@Validated  //数据校验
public class Person {
    @Email(message="邮箱格式错误") //name必须是邮箱格式
    private String name;
}
```

### 问题

**@Email报错**

解决方法：导入相关依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### 常见参数

```java
@NotNull(message="名字不能为空")
private String userName;
@Max(value=120,message="年龄最大不能查过120")
private int age;
@Email(message="邮箱格式错误")
private String email;

/*
空检查
@Null       验证对象是否为null
@NotNull    验证对象是否不为null, 无法查检长度为0的字符串
@NotBlank   检查约束字符串是不是Null还有被Trim的长度是否大于0,只对字符串,且会去掉前后空格.
@NotEmpty   检查约束元素是否为NULL或者是EMPTY.
    
Booelan检查
@AssertTrue     验证 Boolean 对象是否为 true  
@AssertFalse    验证 Boolean 对象是否为 false  
    
长度检查
@Size(min=, max=) 验证对象（Array,Collection,Map,String）长度是否在给定的范围之内  
@Length(min=, max=) string is between min and max included.

日期检查
@Past       验证 Date 和 Calendar 对象是否在当前时间之前  
@Future     验证 Date 和 Calendar 对象是否在当前时间之后  
@Pattern    验证 String 对象是否符合正则表达式的规则

.......等等
除此以外，我们还可以自定义一些数据校验规则
**/
```



## 多环境切换

### 配置文件的加载位置

[21. Externalized Configuration (spring.io)](https://docs.spring.io/spring-boot/docs/1.0.1.RELEASE/reference/html/boot-features-external-config.html)

配置文件 `application.properties` 加载优先级顺序：

1. `file:./config/` 项目路径（与 src 目录平行）
2. `file:./`
3. `classpath:/config` 资源路径 resources 中的 config目录
4. `classpath:/` 就是 resource 目录

**高优先级的配置会覆盖低优先级的配置，低优先级独有的配置会保留。**

例如，在最低级的配置文件中设置一个项目访问路径的配置来测试：

```properties
# 配置项目的访问路径 http://localhost:8080/myapp/hello
# 高优先的8080会覆盖掉
server.port=8085
server.servlet.context-path=/myapp
```

### 多配制文件

-   **默认使用application.properties主配置文件**
-   application-test.properties 代表测试环境配置
-   application-dev.properties 代表开发环境配置

通过在主配置文件中激活来切换环境（**还是会补全独有的配置，如上例**）：

```properties
# 指定使用dev环境 切换不同的端口号
spring.profiles.active=dev
```

### yaml多文档块

可以将多个配置写在同一个文件中。

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

### 注意

1.   环境的切换属于平行关系，只有配置文件优先级属于层级关系才涉及到覆盖和补全。
2.   application.properties和application.yaml不要同时出现，会发生冲突，**如果同时存在默认使用properties的配置**。



## 自动配置原理

### 分析原理

[狂神说SpringBoot05：自动配置原理 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247483766&idx=1&sn=27739c5103547320c505d28bec0a9517&scene=19#wechat_redirect)

-   一旦配置类生效，就会给容器中添加各种组件。

-   这些组件的属性就是从对应的properties类中获取的。

-   properties类中的属性和配置文件绑定，即配置的属性在xxxProperties类中封装着。

-   **在配置文件中配置某个功能时可以参照属性类。**

    ```java
    //从配置文件中获取指定的值和bean的属性进行绑定
    @ConfigurationProperties(prefix = "spring.http") 
    public class HttpProperties {
        // .....
    }
    ```

属性类（spring.factories）通过@ConfigurationProperties(prefix="")与配置文件application.yaml关联。

（**查看代码的过程**）yaml中任意配置 --> xxxProperties.java --> (spring.factories) xxxAutoConfiguration.java 通过@EnableConfigurationProperties绑定了xxxProperties.java但是不满足条件注解@ConditionalOnxxx（没有在pom.xml配置starter启动器）所以没有生效。

**xxxxAutoConfigurartion：自动配置类，给容器中添加组件。**

**xxxxProperties：封装配置文件中相关属性。**

### 概括

>   SpringBoot启动时会加载大量的自动配置类，每个配置类中又默认配置了一些组件并且会从properties类中获取属性，而properties类又和配置文件绑定，**如果想要修改或添加一些组件的属性就可以在配置文件中设定**。

### @Conditional

@Conditional指定的条件成立才会给容器中添加组件，配置类才会生效。

![640 (1)](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources@main/images/2022/640%20(1).jpg)

**查看自动配置类的生效情况**：

```properties
#开启springboot的调试类
debug=true
```

Positive matches:（自动配置类启用的：正匹配）

Negative matches:（没有启动，没有匹配成功的自动配置类：负匹配）

Unconditional classes: （没有条件的类）

