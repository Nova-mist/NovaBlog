# SpringBoot 经验

## 项目结构

### 多模块

- 使用 `Spring Initializr` 生成器创建父项目后，只需要 *New Project* 添加子模块，不能再用生成器。
- 在子模块中创建单独的应用启动入口。`@SpringBootApplication`
- 如果某个依赖不是所有子模块都需要，就不要在父项目的依赖中引入，而是在子模块的依赖中引入。（例如在父项目中引入了 `mybatis-spring-boot-starter`，子模块就必须要配置 DataSource，否则就无法启动子应用）

## Mybatis 错误

> 结论：mapper 是无法重载的

![image-20221005164059657](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210051641983.png)

## 获取注入的 Bean

![image-20221006212100745](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210062121449.png)

![image-20221009180113520](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210091801285.png)

## 常见错误

### Autowire 未找到

![image-20221008171939318](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210081719707.png)

类上是否使用了 `@Component` 或 `@Controller` ?

## 使用 ErrorController

会将错误页面转发到 `ERROR_PATH` 路由，然后解析到 `error.html` 视图，可以实现**后端的自定义 404 页面**。

```java
@Controller
public class ErrorControllerImpl implements ErrorController {

    private static final String ERROR_PATH = "/error";

    @Autowired
    private ErrorAttributes errorAttributes;

    @Override
    public String getErrorPath() {
        return ERROR_PATH;
    }

    @RequestMapping(ERROR_PATH)
    String error(HttpServletRequest request, Model model) {
        // 自定义显示错误信息
        Map<String, Object> errorMap = errorAttributes.getErrorAttributes(
                new ServletWebRequest(request),
                ErrorAttributeOptions.of(ErrorAttributeOptions.Include.MESSAGE));
        model.addAttribute("errors", errorMap);
        return "error";
    }
}
```

## SpringBoot 静态资源过滤

SpringMVC web 项目中，前端页面是放在 `webapp` 目录中的。

==TODO：存在静态资源的问题吗，怎么发布？？==

SpringBoot web 项目中，静态资源默认是在 `resources` 下的几个目录中（优先级递减）：

```
classpath:/META-INF/resources/
classpath:/resources/
classpath:/static/
classpath:/public/
```

☕**为什么会这样？**

在 `WebMvcAutoConfiguration` 中存在处理静态资源的代码

![image-20221008180206597](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210081802432.png)

进而可以查看到 `ResourceProperties` 中声明了默认的资源路径

![image-20221008180336815](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210081803183.png)

上面代码的作用：

- 设定了默认的静态资源路径。`classpath:/static/` **等路径**会被映射到生成项目的 `/**`，**这些路径的优先级递减**
- 同样也支持了 webjars，**通过 jar 包的形式也能访问静态资源**，将 `classpath:/META-INF/resources/webjars/` 映射到了生成项目的 `/webjars/**`

> **举例一**
>
> 经过此 SpringBoot 默认配置，在浏览器中可以通过
>
> `http://localhost:8080/assets/img/404.png`
>
> `http://localhost:8080/webjars/404.png`
>
> `http://localhost:8080/404.png`
>
> 这三个地址来访问到下图结构中的图片

![image-20221008181620387](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210081816865.png)

> **举例二**
>
> 发布的项目如果需要在页面中引入 jquery 等静态资源库，因为 SpringBoot 的默认配置，就能直接通过引入依赖的方式以 jar 包的形式访问静态资源
>
> 项目中依赖库的路径就是 `classpath`，每个库文件 jar 包下的 `META-INF/resources/webjars/` 就映射到了 网页路径 `/webjars/**`
>
> 于是在页面中就可以引用 `/webjars/jquery/3.5.1/jquery.js`

✅**自定义静态资源路径**

🟠配置之后，默认的自动配置就会失效。

```yaml
spring:
  resources:
    # 项目中静态路径的路径
    static-locations: classpath:static/
  mvc:
    # 访问网页中的路径形式
    static-path-pattern: /s/* or /**
```

😥也可以用配置类实现 `WebMvcConfigurationSupport` ，重写 `addResourceHandlers` 方法来进行手动配置，可以参考 `WebMvcAutoConfiguration` 里重写的写法。

这样的好处是能处理路径字符串、并且**能有多组映射**（一个Handler 对应一个 Locations）

```java
@Configuration
public class WebConfig extends WebMvcConfigurationSupport {

    private static final String IMG_PATH = "E:\\Pictures\\Star\\anime\\";
    private static final String IMG_PATH_TWO= "E:\\Pictures\\Star\\截图3\\";

    // 静态资源映射
    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/pic/**")
                .addResourceLocations("file:"+IMG_PATH);
        registry.addResourceHandler("/pic/**")
                .addResourceLocations("file:"+IMG_PATH_TWO);
    }
}

```

> 关于 WebMvcConfigurationSupport
>
> This is the main class providing the configuration behind the MVC Java config. It is typically imported by adding @EnableWebMvc to an application @Configuration class.
>
> 此类是提供 MVC 配置的主类，将 @EnableWebMvc 注释加到 @Configuration 配置类上就能自动配置 WebMVC。
>
> An alternative more advanced option is to extend directly from this class and override methods as necessary, remembering to add @Configuration to the subclass and @Bean to overridden @Bean methods.
>
> 另一种更高级的方法是用 @Configuration 配置类继承此类并重写相应的配置方法，@Bean 方法的重写也需要加上 @Bean 注解。
>
> For more details see the javadoc of @EnableWebMvc.

**举例：访问本地磁盘目录中的文件**

```yaml
spring:
  resources:
    static-locations: file:E:\\Pictures\\Star\\anime\\
    # 也能写成列表的形式
      # - file:E:\\Pictures\\Star\\anime\\
      # - file:E:\\Pictures\\Star\\截图3\\
  mvc:
    static-path-pattern: /pic/**
```

访问 `http://localhost:8080/pic/xxx.jpg` 就可以映射到本地目录的 `.../anime/xxx.jpg`

注意：

1. 此配置会覆盖默认的配置，`classpath:/static/` 中的文件就访问不到了。
2. `staic-locations` 不区分大小写，如果是 windows 的文件目录需要使用双反斜杠。
3. `static-path-pattern` 区分大小写，并且 `/*` 只能访问目录下文件，`/**` 可以访问子目录中的文件。

**参考**：

- [【SpringBoot学习（三）静态资源过滤 & 首页跳转】 - moluu - 博客园 (cnblogs.com)](https://www.cnblogs.com/moluu/articles/14187059.html)
- [Spring boot静态资源过滤_每天向前一步的博客-CSDN博客_springboot过滤静态资源](https://blog.csdn.net/m0_46552679/article/details/115188324)
- [Springboot多种方法处理静态资源：设置并访问静态资源目录 - 掘金 (juejin.cn)](https://juejin.cn/post/7022823623844954142)

==TODO：SpringBoot 自动配置原理==

## ClassPath

> classpath一般用来指代“src/main/resources”下的资源路径，此目录类的文件会打包到 `/target/classes` 目录下的路径。

- 配置文件中会用到
- WebMvcConfigurer配置类也会用到
