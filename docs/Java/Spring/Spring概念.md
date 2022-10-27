---
title: Spring 概念研究
date: 2022-09-28 17:00:00
tags:
  - Spring
---



![blog-image-20220928-1664354739](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202209281646816.jpg)







## @Bean versus @Component

### 基础概念

[@Component, @Repository & @Service 注解的区别 Stack Overflow](https://stackoverflow.com/questions/6827752/whats-the-difference-between-component-repository-service-annotations-in)

| Annotation    | Meaning                 |
| :------------ | :---------------------- |
| `@Component`  | 通用模板                |
| `@Repository` | 持久层模板              |
| `@Service`    | 服务层模板              |
| `@Controller` | 表现层模板 (spring-mvc) |



<!-- more -->

@Component 是通用的注解，其余的注解会根据用途在以后加入特殊功能。

这些注解都服务于相同的核心功能：

- 自动扫描
- 依赖注入

因此可以在**通用的使用场景**替换使用（但不建议混用，每个层使用特定注解便于区分结构）。

`<context:component-scan>` 只会扫描 @Component 注解，但是 @Controller, @Service, @Repository 都在内部包含了 @Component 所以也可以被扫描。

---

@Controller 在处理 dispatcher 方面是**不可替代**的。

Dispatcher 会扫描使用了 @Controller 的类，并检测内部**使用了 @RequestMapping 的方法**，用来分发请求，这种场景下 @Controller 不能被 @Component, @Service 等注解替换。

💥但如果在**类上**也使用了 @RequestMapping, 其他能够注册 bean 的注解都可以替代，例如 @Bean, @Component, @Service。**（不推荐，基本上都是 @Controller 搭配类内类外 @RequestMapping）**

---

[java - Spring: @Component versus @Bean - Stack Overflow](https://stackoverflow.com/questions/10604298/spring-component-versus-bean)

@Component 等注解作用于类上。

@Beans 注解作用于**方法**上，也是用来在 Spring 容器中注册类，并且需要配合所在的 Config 类上的 @Configuration 注解使用。



### Spring Boot 语境

**@Component 使用场景：**

> 整合 mybatis
>
> 在 dao 层的 UserMapper 接口上使用 @Mapper，在类内查询方法上使用 @Select 直接写 mysql 语句。
>
> 在 service 层的 UserServiceImplement 类上使用 @Service 注册，在内部通过 @Autowired 自动注入 UserMapper 类。
>
> 在 Controller 层或者测试类再通过 @Autowired 自动注入 UserService 来调用数据。

**@Beans 使用场景：**

```java
@Configuration
public class UserConfig {
    @Bean
    public User user() {
        return new User();
    }
}
```

在**主方法**中获取创建好的实例

```java
@SpringBootApplication
public class SpringbootApplication {

	public static void main(String[] args) {
		// 获取 Spring 容器对象
		ConfigurableApplicationContext context = SpringApplication.run(SpringbootApplication.class, args);

		// 获取 bean
		Object user = context.getBean("user");
        // 或者直接通过类来获取 不需要 @Bean 方法注入
        // Object user = context.getBean(User.class)
		System.out.println(user);
	}
}
```

当然也可以在**测试类**中通过 @Autowired 来自动注入使用了 @Component, @Qualifier, @Value的 User 类。**@Autowired 是不能写在 psvm 方法中的。**

```java
@SpringBootTest
class SpringbootRedisApplicationTests {
	@Autowired
    @Qualifier("user1")
	User user;
	@Test
	void getUser() {
		System.out.println(user);
	}
}
```

🟠两种获取 User 实例方法的区别在于：使用 @Bean 注解的 Config 类内**方法**可以创建不同属性的 User 实例并返回；而直接自动注入的 User 实例如果不使用 @Qualifier 限定符 就都是相同的，所以这种方法更适合创建 Service 等组件类来调用内部逻辑方法。

第二种方法可以见【SpringBoot Note】-【读取配置数据】



## 自定义注解

```java
package com.ysama.springbootredis.condition;
import java.lang.annotation.*;

// 元注解
@Target({ElementType.TYPE, ElementType.METHOD}) // 决定可以使用的位置 
@Retention(RetentionPolicy.RUNTIME) // 其作用的时机
@Documented // 生成javadoc
// 此处可以组合其他的注解 装饰器模式？
public @interface YsamaConditionOnClass {
    String[] value(); // 接收注解参数
}
```

可以组合 `@Conditional(ClassCondition.class)` 来控制 Bean 的创建（ClassCondition 是自定义的类名）







## 依赖注入 Dependency Injection

[Spring Dependency Injection (concretepage.com)](https://www.concretepage.com/spring/spring-dependency-injection)

### 使用 xml 配置

> Constructor and Setter based Dependency Injection using XML Configuration

在 `springContext.xml` 中注册 bean，由 Spring 容器创建各个实例，在使用的时候通过 id 在 Spring 容器中获取。

```java
ApplicationContext context
                = new ClassPathXmlApplicationContext(
                "springContext.xml");
Product p = (Product) context.getBean("product")
```

- 构造器注入，CDI
- Setter 注入，SDI

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="mycompany" class="com.concretepage.bean.Company">
        <property name="compId" value="100"/>
        <property name="compName" value="ConcretePage"/>
    </bean>
    <bean id="myaddress" class="com.concretepage.bean.Address">
        <constructor-arg index="0" value="200"/>
        <constructor-arg index="1" value="Varanasi"/>
    </bean>
    <bean id="product" class="com.concretepage.bean.Product">
        <property name="company" ref="mycompany"/>
        <property name="address" ref="myaddress"/>
    </bean>
    <bean id="employee" class="com.concretepage.bean.Employee">
        <constructor-arg index="0" ref="mycompany"/>
        <constructor-arg index="1" ref="myaddress"/>		   
    </bean>				
</beans> 
```



### 在 Config 类中使用 @Bean 注入

> Constructor and Setter based Dependency Injection using JavaConfig

构造器注入和 Setter 注入不需要在 `xml` 中注册，只要在 constructor 和 setter 方法上打上 `@Bean(name="")` 即可。

使用 `@Bean` 注解可以指定 id 从而产生不同的 bean，`@Component` 则不能使用 id 所以只能有一个 bean。 

```java
// 配置类不需要特征值 可以@Component注入
@Configuration
public class AppConfig {
    @Bean(name="mycompany")
    public Company getCompany() {
        // 可以使用setter或者constructor
        Company comp = new Company();
        comp.setCompId(100);
        comp.setCompName("ConcretePage");
        return comp;
    }
}
```

可以使用类名或者 bean 名来获取 bean。

```java
AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
ctx.register(AppConfig.class);
ctx.refresh();

// 通过bean名来获取
Product product = (Product)ctx.getBean("product");
// 通过类名获取 Spring容器中只能有一个此类型的bean
Employee employee = ctx.getBean(Employee.class);

ctx.close();
```



### 使用 @Component 注入并用 @Autowire 使用

> Spring Dependency Injection with @Autowire Annotation
>
> 🟠Spring provides `@Autowire` annotation that can make field, constructor or setter method autowired using spring dependency injection.

1. 通过 `@Component / @Service / @Controller` 注入一个类。

2. 开启注解扫描

   - `xml` 文件中声明

     ```xml
     <context:annotation-config/>
     <context:component-scan base-package="com.ysama.pojo"/>
     ```

   - 使用配置类。
     如果已经有了 `AppConfig.java` 但没有使用 `@ComponentScan` ，不会识别 `xml` 中的 `<context:component-scan />`

     ```java
     // AppConfig.java
     @Configuration
     @ComponentScan(basePackages="com.ysama.pojo")
     public class AppConfig {
     } 
     ```

3. @Autowire 的使用方法是用在类内使用的；在静态方法中 psvm 只能从容器中通过类名获取，因为是单一的 bean

   ```java
   // 在类内调用 自动装配对象的方法
   // 1. make field autowired
   @Service
   public class FarmerService {
      @Autowired	
      private CalcUtil calcUtil;
      public int getFieldArea() {
   	   return calcUtil.multiply(12, 15);
      }
   }
   
   // 2. make setter autowired
   @Service
   public class FarmerService {
       private CalcUtil calcUtil;
   
       @Autowired
       public void setCalcUtil(CalcUtil calcUtil) {
           this.calcUtil = calcUtil;
       }
   
       public int getFieldArea() {
           return calcUtil.multiply(12, 15);
       }
   }
   
   // 3. make constructor autowired
   @Service
   public class FarmerService {
       private CalcUtil calcUtil;
   
       // right
       @Autowired
       public FarmerService(CalcUtil calcUtil) {
           this.calcUtil = calcUtil;
       }
       
   	// wrong -> No qualifying bean of type 'int' available
       @Autowired
       public FarmerService(CalcUtil calcUtil, int i) {
           this.calcUtil = calcUtil;
       }
   
       public int getFieldArea() {
           return calcUtil.multiply(12, 15);
       }
   }
   ```

   ```java
   // 在静态方法中需要从Spring容器中获取
   AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
   ctx.register(AppConfig.class);
   ctx.refresh();
   FarmerService farmer = ctx.getBean(FarmerService.class);
   System.out.println("Field Area:"+ farmer.getFieldArea());
   ctx.close();
   ```

🟠关于 `@Autowire(required=false)`

**不允许存在多个使用 @Autowired 注解的构造器**

`Autowire` 默认 `required` 选项是 *true*，表示如果这个自动装配的依赖没有被解决，会抛出错误并且外层 bean 也无法继续注入。

> *if we set the required value as false, then at the time of bean wiring, Spring will leave the bean unwired if the dependency is not resolved. As per Spring's best practices, we should avoid setting required ...*

[@Autowired with required = false - Hands-On High Performance with Spring 5 ](https://www.oreilly.com/library/view/hands-on-high-performance/9781788838382/f7b7d332-c80d-4cd1-87b1-d7b5e1b146a0.xhtml)



### 总结：使用注解和使用配置文件的依赖注入

| 使用 @Component 注解                                         | 使用 @Bean 注解                                              | 使用配置文件                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 唯一同类型 bean，最适合类内自动装配然后调用方法              | 可以有多个 id 的同类型 bean，使用在方法上，在方法内部手动使用 constructor 或 setter 实例化对象并返回 | bean 都注册在配置文件中，可以有多个同类型的 bean 使用不同 id、不同的注入方法 |
| @Component、@Service、@Controller、@Configuration            | @Bean(name="")                                               | 在 `springContext.xml` 配置文件中声明各个 `<bean>` 的依赖关系 |
| @Autowired 可作用于 field、2️⃣constructor、setter              | @Autowired 可作用于 field、constructor、setter               | 1️⃣constructor 注入、setter 注入                               |
| 需要开启注解包扫描（配置类 > 配置文件），@Component 作用于类上 | 需要在配置类中使用 @Bean 作用于 getXXX 方法上（唯一类型或多个不同的 id） |                                                              |
| 在类中直接使用 @Autowired 然后调用其方法（唯一）；<br />✅在静态域中通过**类名（唯一）**从 Spring 容器中获取 | 在类中直接使用 @Autowired 然后调用其方法（唯一）；<br />在静态域中通过**类名（对应 @Bean 唯一类型）或 bean 名（对应 @Bean 不同 id）**从 Spring 容器中获取 | 在静态域通过**类名或 bean 名**从 Spring 容器中获取           |

✅可以使用 @Component 修饰实体类（默认开启注解） 并配置注解扫描包，在实体类的 psvm 中通过 `context.getBean(Car.class)` 获取刚刚使用 @Component 注入到 Spring 容器的唯一实体类。

1️⃣在不使用注解的时候，如果有多个构造方法，就需要在 `xml` 中注册多个 id 不同的 bean，它们对应着不同的构造方法。

![image-20220928001205482](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202209280012039.png)

注意：在构造方法上使用 @Autowired 时候

- 2️⃣如果 Spring 容器中存在多个同类型的参数（@Bean声明或配置文件中声明），需要使用 @Qualifier 来修饰参数以区分不同 id 的 bean （等到配置自动扫描包注入的时候注入的 @Component 都是相同的 bean）
- 如果参数不是注入的 bean，例如 int 类型，还会报错（只适用于参数都是 bean 的情况？）。
- 只能有一个构造器使用 `@Autowired`，并且 `@Qualifier` 不能修饰构造器

![image-20220928160235614](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202209281602439.png)

![image-20220928003004260](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202209280030573.png)



### 【旧】使用配置文件的两种注入方式

[Spring Dependency Injection with Example - GeeksforGeeks](https://www.geeksforgeeks.org/spring-dependency-injection-with-example/)

[Core Technologies (spring.io)](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-dependencies)

在 `springContext.xml` 文件中注册各个 bean 的依赖关系

1. Constructor-based Dependency Injection
2. Setter-based Dependency Injection

【命名空间注入】：p-namespace / c-namespace对应前两种注入方式的简写形式。

Constructor 注入配置中的 `name` 字段对应的是类构造函数的参数名，也可以使用 `index` 字段。

Setter 注入配置中的 `name` 字段对应的是变量名，但如果在父类中存在唯一的某种类型变量，该变量的会自动关联到 Spring 容器中该类型的 bean，`name` 字段不一致也没有影响（但再声明一个该类型变量就会因为无法确定关联而出错）。

> Vehicle = Tyre + Engine

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
    <bean id="tyre1Bean" class="com.ysama.pojo.Tyres">
        <property name="name" value="MRF">
        </property>

        <property name="place" value="India">
        </property>

        <property name="message" value="Make in India">
        </property>

    </bean>

    <bean id="ToyotaBean" class="com.ysama.pojo.ToyotaEngine">
        <property name="company" value="Toyota">
        </property>

        <property name="cost" value="300000.00">
        </property>

    </bean>

    <bean id="tyre2Bean" class="com.ysama.pojo.Tyres">
        <property name="name" value="TVS">
        </property>

        <property name="place" value="India">
        </property>

        <property name="message" value="Make in India">
        </property>

    </bean>

    <bean id="InjectwithSetter" class="com.ysama.pojo.Vehicle">
        <property name="engine" ref="ToyotaBean">
        </property>

        <property name="tyre" ref="tyre1Bean">
        </property>

    </bean>

    <bean id="InjectwithConstructor" class="com.ysama.pojo.Vehicle">
        <constructor-arg name="engine" ref="ToyotaBean">
        </constructor-arg>

        <constructor-arg name="tyre" ref="tyre2Bean">
        </constructor-arg>
    </bean>
</beans>
```





##  XML 配置注解扫描

 `context:annotation-config`  ：开启注解，可以使用 `@Autowired`，但还要在 xml 中注册 bean。

`context:component-scan` ：**在上面的基础上**，可以自动扫描 `@Component` / `@Controller`

**多个扫描路径**

```xml
<context:component-scan base-package="x.y.z.service, x.y.z.controller" /> 
```

参考：

- [Difference between vs | Baeldung](https://www.baeldung.com/spring-contextannotation-contextcomponentscan)
- [java - multiple packages in context:component-scan, spring config - Stack Overflow](https://stackoverflow.com/questions/5269450/multiple-packages-in-contextcomponent-scan-spring-config)



