# Maven 相关

## 命令

```xml
<!-- <proxy>
      <id>clash</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>127.0.0.1</host>
      <port>51837</port>
    </proxy> -->
```

```bash
mvn clean install -U
mvn compile exec:java
```

## 依赖范围 Scopes

### 概念

依赖类型：

1. 直接依赖
2. 传递依赖

> **transitive dependencies are required by direct dependencies.**

使用 `mvn dependency:tree` 查看所有依赖。

**依赖范围：**

1. Compile：默认范围
2. Provided：说明此依赖是 JDK 或 容器应该提供的
3. Runtime：只在运行时需要的依赖
4. Test：不具备传递性，只在测试的 classpath 可以访问到。**例子：JUnit 测试库**
5. System：**弃用**，类似 provided scope，需要指定系统中的库路径。
6. Import：相当于引入了某个自定义项目中的所有依赖，不影响传递性。

### 访问性

**依赖的访问性，也就是对应的 classpath 能否找到此依赖**

所以运行时不需要的 provided 和 test 就不会被打包到 jar 包中。

|          | 编译 | 测试 | 运行 | 例子                         |
| -------- | ---- | ---- | ---- | ---------------------------- |
| compile  | √    | √    | √    | spring-core                  |
| provided | √    | √    |      | JUnit                        |
| runtime  |      | √    | √    | servlet-api                  |
| test     |      | √    |      | JDBC实现（编译时只需要接口） |
| system   | √    | √    |      | 本地的类库文件               |

### 依赖传递

以什么样的范围引入了某个依赖 / 项目，该项目中的依赖在本项目中的访问性是如何表现的？

| 父 Scope / 子 Scope | compile  | runtime  |
| ------------------- | -------- | -------- |
| compile             | compile  | runtime  |
| provided            | provided | provided |
| test                | test     | test     |
| runtime             | runtime  | runtime  |

例子：

1. 项目B 中有 compile / test/ provided / runtime 四种范围的依赖 b1 / b2 / b3 / b4
2. 项目A以 runtime 的范围引入了项目B，那么 b1 / b4 在项目A中都是以 runtime 范围引入的，只能在运行和测试时访问到。
3. 而 b2 / b3 根本不会被引入到项目A，**因为 provided 和 test 范围不具备传递性**。

参考：

- [Maven Dependency Scopes | Baeldung](https://www.baeldung.com/maven-dependency-scopes)
- [Maven中的scope总结_野生开发者的博客-CSDN博客_maven scope](https://blog.csdn.net/qgnczmnmn/article/details/118050472)
- [Maven依赖范围Scope及传递性依赖 - 苏黎世湖畔 - 博客园 (cnblogs.com)](https://www.cnblogs.com/sulishihupan/p/15723396.html)
- [dependencies - What is a transitive Maven dependency? - Stack Overflow](https://stackoverflow.com/questions/41725810/what-is-a-transitive-maven-dependency)
- [Maven依赖中scope的runtime和provied的区别_fomeiherz的博客-CSDN博客_maven的runtime](https://blog.csdn.net/fomeiherz/article/details/115413682)

## 可选依赖和依赖排除

[Maven – Optional Dependencies and Dependency Exclusions (apache.org)](https://maven.apache.org/guides/introduction/introduction-to-optional-and-excludes-dependencies.html)

将依赖声明为可选的来避免**依赖传递**。`<optional>` 标签

```xml
<!-- prject A-->
<dependency>
    <groupId>sample.ProjectB</groupId>
    <artifactId>Project-B</artifactId>
    <version>1.0</version>
    <scope>compile</scope>
    <optional>true</optional> <!-- value will be true or false only -->
</dependency>
```

> 项目A引用了项目B作为依赖，并且声明项目B为**可选依赖**。
>
> 此时项目X又引用了项目A作为依赖，但项目B不会被自动引入。

---

通过 `exclusion` 标签在引入依赖的时候显示排除依赖传递。

```xml
<!-- project A -->
<dependency>
    <groupId>sample.ProjectB</groupId>
    <artifactId>Project-B</artifactId>
    <version>1.0-SNAPSHOT</version>
    <exclusions>
        <exclusion>
            <groupId>sample.ProjectD</groupId> <!-- Exclude Project-D from Project-B -->
            <artifactId>Project-D</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

> A-> B，B -> D
>
> A ->x D
>
> 项目A依赖了项目B，项目B依赖了项目D，此时项目D作为依赖被传递给了项目A。
>
> 如果项目A不想引入项目D作为依赖：
>
> 1. 在项目B中将项目D声明为可选依赖
> 2. 在项目A中引入项目B的时候显式排除项目D



## spring-boot-starter-parent

有的项目中会见到如下配置：

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

1. 父项目的 pom 文件中定义了编码、java 版本、资源过滤、插件等配置，本项目会直接继承这些配置。
2. 而 `spring-boot-starter-parent` 的父项目 `spring-boot-dependencies` 中又使用 `<dependencyManagement>` **指定了许多依赖的版本**，本项目再手动引入的时候就无须再指定版本。

> 如果没有引入 `spring-boot-starter-parent`，需要在 `application.properties` 文件中使用 `maven` 占位符时切记要手动配置 `resource`。

参考：

- [spring-boot-starter-parent的作用 - 一首简单的歌 - 博客园 (cnblogs.com)](https://www.cnblogs.com/silenceshining/p/16041854.html)



## dependencyManagement

用来统一项目中的依赖版本，子项目也可以显式指定版本。

**dependencyManagement 声明的依赖并没有被导入项目，必须在子项目再次声明才会真正导入jar包。**



参考：

- [mvn中dependencyManagement的使用 - 一首简单的歌 - 博客园 (cnblogs.com)](https://www.cnblogs.com/silenceshining/p/14295807.html)



## 插件

### maven-compiler-plugin

在 `spring-boot-starter-parent` 中开启了**将方法参数名写入 class 文件**的功能。

```java
public ResultVO demo10(@PathVariable String id);
// @PathVariable(name = "id")
```

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <parameters>true</parameters>
    </configuration>
</plugin>
```

其他 maven 插件：

```
maven-jar-plugin
maven-war-plugin
maven-resources-plugin
```



在 SpringMVC 中的 pom.xml 中见过，用来编译文件，指定版本。

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.0</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>
    </plugins>
</build>
```

参考：

- [Java编译保留方法参数名称_catoop的博客-CSDN博客](https://blog.csdn.net/catoop/article/details/102855248)

### spring-boot-maven-plugin

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <executions>
        <execution>
            <id>repackage</id>
            <goals>
                <goal>repackage</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <mainClass>${start-class}</mainClass>
    </configuration>
</plugin>
```

> `repackage` 目标默认绑定 maven 声明周期中的 `package` 阶段，这样当打包后这个插件就会进一步将所有依赖的 jar 包以及当前项目的代码打包到一个 jar 包中，从而支持 `jar -jar` 启动 Spring Boot 项目。
