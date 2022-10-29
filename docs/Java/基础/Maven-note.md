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
