# Spring 整合 swagger

## 前概

首先要搞清楚 swagger 的两种使用用法：

- 基于现有代码进行接口可视化、生成文档。
- 先编写 API 接口规范 `openapi.yaml` ，基于生成的代码模板进行开发。

两种用法的流程大方向是相反的。

---

在 SpringBoot 中集成 Swagger。

在前后端分离的项目中使用，管理、测试接口文档。

> 前后端分离
>
> 后端：后端控制层、服务层、数据访问层
>
> 前端：前端控制层、视图层、静态 json 伪数据

**Swagger**

- 动态更新 RestFul api 文档
- 在线测试接口



[狂神说SpringBoot14：集成Swagger终极版 (qq.com)](https://mp.weixin.qq.com/s?__biz=Mzg2NTAzMTExNg==&mid=2247483909&idx=1&sn=201ee629b9ce3b9276a263e18812e607&scene=19#wechat_redirect)



## 【旧】SpringBoot 集成 Swagger

1. 导入依赖
   - springfox-swagger2
   - springfox-swagger ui
2. 编写一个 Controller
3. 编写 swagger 配置类并用注解启用【可以使用 Swagger Editor】
4. 访问 http://localhost:8080/swagger-ui



### 配置扫描接口

```java
// SwaggerConfig.java
@Bean
public Docket docket() {
    return new Docket(DocumentationType.SWAGGER_2)
        .apiInfo(apiInfo())
        .select()// 通过.select()方法，去配置扫描接口,RequestHandlerSelectors配置如何扫描接口
        .apis(RequestHandlerSelectors.basePackage("com.ysama.swagger.controller"))
        // 配置如何通过path过滤,即这里只扫描请求以/api开头的接口
        .paths(PathSelectors.ant("/api/**"))
        .build();
}
```

**RequestHandlerSelectors 可调用的方法**

> ```
> any() // 扫描所有，项目中的所有接口都会被扫描到
> none() // 不扫描接口
> // 通过方法上的注解扫描，如withMethodAnnotation(GetMapping.class)只扫描get请求
> withMethodAnnotation(final Class<? extends Annotation> annotation)
> // 通过类上的注解扫描，如.withClassAnnotation(Controller.class)只扫描有controller注解的类中的接口
> withClassAnnotation(final Class<? extends Annotation> annotation)
> basePackage(final String basePackage) // 根据包路径扫描接口
> ```

**PathSelectors 可调用的方法**

> ```
> any() // 任何请求都扫描
> none() // 任何请求都不扫描
> regex(final String pathRegex) // 通过正则表达式控制
> ant(final String antPattern) // 通过ant()控制
> ```



### 配置启用条件

```java
@Bean
public Docket docket() {
    return new Docket(DocumentationType.SWAGGER_2)
        .apiInfo(apiInfo())
        .enable(false) // 默认为true
        .select()
        .apis()
        .paths()
        .build()
}
```

**多环境切换**

> application.properties
>
> application-dev.properties
>
> application-pro.properties

```properties
# application.properties
spring.profiles.active=dev
```

```java
// SwaggerConfig.java
@Bean
public Docket docket(Environment environment) {
    // 设置要显示swagger的环境
    Profiles of = Profiles.of("dev", "test");
    // 判断当前是否处于该环境
    // 通过 enable() 接收此参数判断是否要显示
    boolean b = environment.acceptsProfiles(of);

    return new Docket(DocumentationType.SWAGGER_2)
        .apiInfo(apiInfo())
        .enable(b) //配置是否启用Swagger
        .select()     .apis(RequestHandlerSelectors.basePackage("com.ysama.swagger.controller"))
        .build();
}
```



### 配置 api 分组

```java
@Bean
public Docket docket1(){
   return new Docket(DocumentationType.SWAGGER_2).groupName("group1");
}
@Bean
public Docket docket2(){
   return new Docket(DocumentationType.SWAGGER_2).groupName("group2");
}
@Bean
public Docket docket3(){
   return new Docket(DocumentationType.SWAGGER_2).groupName("group3");
}
```



### 添加注释

Swagger的所有注解定义在io.swagger.annotations包下

| Swagger注解                                            | 简单说明                                             |
| ------------------------------------------------------ | ---------------------------------------------------- |
| @Api(tags = "xxx模块说明")                             | 作用在模块类上                                       |
| @ApiOperation("xxx接口说明")                           | 作用在接口方法上                                     |
| @ApiModel("xxxPOJO说明")                               | 作用在模型类上：如VO、BO                             |
| @ApiModelProperty(value = "xxx属性说明",hidden = true) | 作用在类方法和属性上，hidden设置为true可以隐藏该属性 |
| @ApiParam("xxx参数说明")                               | 作用在参数、方法和字段上，类似@ApiModelProperty      |

**接口示例**

```java
@ApiOperation("Hello接口")
@PostMapping("/hello")
@ResponseBody
public String hello(@ApiParam("这个名字会被返回")String username){
   return "hello" + username
}
```



## 【新】🟢Spring 整合 swagger

### SpringBoot

1. 引入依赖

```xml
<!-- swagger -->
<!-- https://mvnrepository.com/artifact/io.springfox/springfox-swagger2 -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>

<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
```

2. Swagger 配置类

```java
@Configuration
@EnableSwagger2
public class SwaggerConfig {


    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
            .select()
            .apis(RequestHandlerSelectors.any())
            .paths(PathSelectors.any())
            .build().apiInfo(apiInfo());
    }

    // 自定义信息 可选设置
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
            .title("Swagger Test")
            .description("SpringBoot Integration with Swagger")
            .version("1.0.0")
            .termsOfServiceUrl("http://example.com")
            .license("Whatever")
            .licenseUrl("http://example.com")
            .build();
    }

}
```

3. 设置自动扫描包（SpringBoot 默认设置）
4. 访问 http://localhost:8082/swagger-ui.html，查看效果。Swagger 默认只扫描使用 `Controller` 注解的类，`@RestController` 不识别。



### SpringMVC

1. 先配置好 SpringMVC web 模块。
   - `web.xml`
   - `springmvc-config.xml` 配置扫描器 + 开启注解
   - 两种接口：由 ResourceViewResolver 处理的普通请求；直接返回信息的 Restful api 使用 `@Response` 注解。
   - 访问 `/hello` 能返回信息，访问 `/index` 能返回 jsp 页面。
2. 引入依赖

🟠因为项目需要发布成 war 包部署到 Tomcat 上，所以 Swagger 依赖的 `provided` 依赖**不会被添加到 war 包中**，需要在项目中直接引入。

> 进入 springfox-swagger2 的 [maven 仓库](https://mvnrepository.com/artifact/io.springfox/springfox-swagger2/2.9.2)就可以看到：
>
> - Compile Dependencies 这些依赖具有传递性，会直接添加到项目中。
> - Provided Dependencies 默认这些依赖由 JDK 或 容器提供，所以在打包的时候不会被添加到 war 包中。（**这一点是很多出错的原因**）
>
> 另外的例子：
>
> 因为 Tomcat 默认就有 `servlet-api` 和 `jsp-api` 依赖，所以可以不引入依赖，编译的时候不需要，是 runtime 依赖。
>
> 但是使用 jsp 的时候要用到 JSTL 标签库，Tomcat 中没有此依赖，所以需要显式引入：`taglibs-standard-impl` 和 `taglibs-standard-spec`。打包的时候就会被添加，属于 runtime 依赖。

```xml
<!-- swagger -->
<!-- https://mvnrepository.com/artifact/io.springfox/springfox-swagger2 -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>

<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>

<!-- provided -->
<!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-autoconfigure -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-autoconfigure</artifactId>
    <version>2.7.4</version>
</dependency>

<!-- https://mvnrepository.com/artifact/joda-time/joda-time -->
<dependency>
    <groupId>joda-time</groupId>
    <artifactId>joda-time</artifactId>
    <version>2.10.14</version>
</dependency>
<!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.4</version>
</dependency>

<!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-core -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-core</artifactId>
    <version>2.13.4</version>
</dependency>
```

3. Swagger 配置类，同上。

4. 在 xml 中或使用 `@ComponentScan` 注解设置自动扫描包。

5. 为 Swagger 设置资源映射。

   - xml 方式

     ```xml
     <!-- swagger -->
     <mvc:resources mapping="swagger-ui.html" location="classpath:/META-INF/resources/" />
     <mvc:resources mapping="/webjars/**" location="classpath:/META-INF/resources/webjars/" />
     ```

   - JavaConfig 方式

     ```java
     @Configuration
     @EnableWebMvc
     public class SwaggerWebMvcConfigurerAdapter extends WebMvcConfigurerAdapter {
         @Bean
         public ViewResolver viewResolver() {
             InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
             viewResolver.setViewClass(JstlView.class);
             viewResolver.setPrefix("/WEB-INF/views/");
             viewResolver.setSuffix(".jsp");
             return viewResolver;
         }
     
     
         @Bean
         public MessageSource messageSource() {
             ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
             messageSource.setBasename("messages");
             return messageSource;
         }
     
         @Override
         public void addResourceHandlers(ResourceHandlerRegistry registry) {
             super.addResourceHandlers(registry);
     
             registry.addResourceHandler("swagger-ui.html")
                     .addResourceLocations("classpath:/META-INF/resources/");
     
             registry.addResourceHandler("/webjars/**")
                     .addResourceLocations("classpath:/META-INF/resources/webjars/");
         }
         @Override
         public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
             configurer.enable();
         }
     }
     ```
