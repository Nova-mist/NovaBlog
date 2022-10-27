# Maven 相关



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