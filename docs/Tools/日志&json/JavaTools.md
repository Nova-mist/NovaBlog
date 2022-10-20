## JSON

常用的库：

- fastjson
- jaskson
- gson

将 Java 对象转换成 json 格式也是**序列化操作**。

> 序列化：将 bean、amp、collection 等转为 json 字符串。

### FastJson

#### 序列化

- 空值序列化

```java
// Null也会序列化
String person = JSON.toJSONString(person, SerializerFeature.WriteMapNullValue);
```

- 日期格式处理

```java
// 在实体类的时间属性上使用@JSONField注解

@JSONField(format = "yyyy-MM-dd HH:mm:ss")
private Date registerDate;
@JSONField(format = "yyyy-MM-dd HH:mm:ss")
private LocalDateTime birthDay;
```

- 引用探测，在序列化含有多个相同 item 的集合时会用 `$ref` 表示重复项，以节省空间。
  **禁用引用探测**

```java
JSON.toJSONString(list, SerializerFeature.DisableCircularReferenceDetect);
```

- 定制 json 格式，使用 SerializeFilter 设置。

  ✅例子：key 值大写

![image-20221010002021055](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210100020491.png)

#### 反序列化

- 默认忽略类中不存在的属性

```java
Person person = JSON.parseObject(jsonStr, Person.class);
```

- 🟢处理泛型。在反序列化后可以自动获取到泛型类型，不需要强制转换类型。

```java
// ResultVO
@Data
public class ResultVO<T> {
	private Boolean success = Boolean.TRUE;
	private T data;
    private ResultVO() {}
    
    public static <T> ResultVO<T> buildSuccess(T t) {
        ResultVO<T> resultVO = new ResultVO<>();
        resultVO.setData(t);
        return resultVO;
    }
}
```

```java
ResultVO<Person> personResultVO = ResultVO.buildSuccess(person);
// 序列化
String voJsonStr = JSON.toJSONString(personResultVO);

// 传入反序列化的类型
ResultVO<Person> deSerializedVO = JSON.parseObject(voJsonStr, new TypeReference<ResultVO<Person>>(){});
// 获取对象 不需要强制类型转换
Person data = deSerializedVO.getData();
```

#### 通用配置

- 美化输出 `prettyFormat = true` 

- 

```java
@JSONField(name = "address")
private String addr;
```

- 忽略指定属性（不参与序列化与反序列化）

```java
@JSONField(name = "password", serialize = false, deserialize = false)
private String pwd;
```



### JackSon

jsr319 处理 jdk 8时间日期 api

**安装依赖**

需要使用 `jackson-datatype-jsr310` 模块来处理 Java8 的时间日期类型，例如 LocalDate。

使用前要注册模块。

```xml
<!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.4</version>
</dependency>

<!-- jsr310 -->
<!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.datatype/jackson-datatype-jsr310 -->
<dependency>
    <groupId>com.fasterxml.jackson.datatype</groupId>
    <artifactId>jackson-datatype-jsr310</artifactId>
    <version>2.13.4</version>
</dependency>
```



#### 序列化

ObjectMapper 线程安全。

```java
private static ObjectMapper objectMapper = new ObjectMapper();
private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

// 全局配置
static {
    // 不显示空值
    // objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    
    // 美化输出
    // objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
    
    // 自动注册modules
    objectMapper.findAndRegisterModules();
}

String jsonStr = objectMapper.writeValueAsString(user);
```

- 默认显示空值，如需不显示要显式设置

- 时间日期格式化

  - 局部设置：通过 `@JsonFormat` 注解
    ```java
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date birth;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private LocalDateTime registrationDate;
    ```

  - 全局设置
    ```java
    static {
        // Date格式
        // 但是SimpleDateFormat线程不安全会传递给ObjectMapper
        objectMapper.setDateFormat(new SimpleDateFormat(DATE_TIME_FORMAT));
    
        // LocalDateTime格式
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT)));
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT)));
    
        objectMapper.registerModule(javaTimeModule)   
    }
    ```

#### 反序列化

反序列化的 LocalDateTime 等 **Java8 的时间日期类型**也要设置 javaTimeModule。

```java
// 反序列化配置
static {
	// 忽略不存在的属性
    // objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
}
```

```java
User user = objectMapper.readValue(jsonStr, User.class);
System.out.println(user);
```

- 处理泛型

```java
@Data
public class ResultDTO<T> {
    private Boolean success = Boolean.TRUE;
    private T data;
    private ResultDTO() {}

    public static <T> ResultDTO<T> buildSuccess(T t) {
        ResultDTO<T> resultDTO = new ResultDTO<>();
        resultDTO.setData(t);
        return resultDTO;
    }
}

```

```java
ResultDTO<User> userResultDTO = ResultDTO.buildSuccess(bob);
// 序列化
String dtoSerializationResult = objectMapper.writeValueAsString(userResultDTO);
// 反序列化
ResultDTO<User> dtoDeserializationResult = objectMapper.readValue(dtoSerializationResult, new TypeReference<ResultDTO<User>>() {
});
```

#### 通用配置

- 属性命名格式：驼峰转下划线

🟠注意：如果设置了**驼峰转下划线**，反序列化的时候就**不会识别驼峰格式**

```java
static {
    // 驼峰转下划线
    objectMapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
}
```

- 指定属性名（反序列化的时候也要用此名字）

```java
@JsonProperty("password")
private String pwd;
```

- 忽略指定属性（有值也不会反序列化）

```java
@JsonIgnore
private String pwd;
```

#### 更新对象

用新的对象的非空值替换旧的对象的值。

- 后者有值，替换前者
- 后者空值，保留前者

```java
User updateUser = objectMapper.updateValue(originalUser, newUser);
```





## Logger

### 概述

日志框架：

- log4j / log4j2 (apache)
- jul (jdk自带 java.util.logging)
- logback (qos)

日志门面：

- jcl (apache)
- slf4j (qos)

### Jul

```java
Logger logger = Logger.getLogger("abc");
// method1
logger.log(Level.xx, "msg");
// method2
logger.warning("msg")
```

输出信息就是红色（Tomcat 的日志底层也是调用 jul），因为使用了 `System.err`

通过 Handler 来控制 Level 输出。

**默认日志级别 FINE**

#### 继承关系

- 所有 logger 默认的父级是 `java.util.logging.LogManager$RootLogger`
- 通过名字中的 `.` 来决定父子关系

```java
Logger logger1 = Logger.getLogger("a");
Logger logger2 = Logger.getLogger("a.b");
Logger logger3 = Logger.getLogger("a.b.c");

// sout
logger3.getParent().getName();
logger3.getParent() == logger2;
logger1.getParent().getName();
```

#### 修改输出级别

![The previous context describes this graphic](https://docs.oracle.com/javase/8/docs/technotes/guides/logging/logging1.gif)

```java
Logger logger = logger.getLogger("abc");
logger.setLevel(Level.ALL);

// method1
// 获取父级logger并设置handler(appender)级别
Handler[] handlers = logger.getParent().getHandlers();
for (Handler handler : handlers) {
    handler.setLevel(Level.ALL);
}

// method2
// 设置自己的handler
ConsoleHandler selfHandler = new ConsoleHandler();
logger.addHandler(selfHander);
logger.setUseParentHandlers(false); // 不继承父级Handler
logger.info("logger3 info");
```

由于 Handler 默认继承，如果也设置了本 logger 自己的 Handler，就会出现**日志重复输出**问题，需要关闭继承父级 Handler。

#### 配置文件

> 默认配置文件 `$JAVA_HOME/jre/lib/logging.properties`

![image-20221011141600638](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210111416247.png)

1. 在 `resources` 目录新建 `logging.properties`
   ```properties
   .level = INFO # 全局level
   com.ysama.logger.level = WARNING # 指定包level
   ```

2. 加载配置文件并设置
   ```java
   // JulService
   static LogManager logManager = LogManager.getLogManager();
   static {
       logManager.readConfiguration(JulService.class.getClassLoader().getResourceAsStream("logging.properties"));
   }
   
   // 使用动态包名匹配指定的level
   Logger logger = Logger.getLogger(JulService.class.getName());
   ```

   

### Log4j

引入依赖 `log4j` 🔴注意漏洞

开创了日志的分级别输出。

首先会根据设定过滤 Level，再通过 appender 判断 Level 是否输出到控制台、文件等。

> ALL < FINSET < FINER < FINE < CONFIG < INFO < WARNING < SEVERE < OFF

所有日志技术都有父子关系的概念，使用 `.` 来确定。

**Logger 是线程同步的。**

```java
private static Logger logger = Logger.getLogger(Log4jService.class);

public void test() {
    logger.trace("trace");
}
```

**日志级别**

> trace < debug < info < warn < error < fatal

![image-20221011145942725](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210111459786.png)

#### 配置文件

运行必须要有配置文件，默认去 classpath 下寻找。

在 `resources` 目录下新建 `log4j.properties` 

🟢可以去官方找模板

```properties
# 必须要给rootLogger关联appender 否则会报错
log4j.rootLogger=INFO,xxx

# 配置控制台的appender，xxx是名字
log4j.appender.xxx = org.apache.log4j.ConsoleAppender
log4j.appender.xxx.Target = System.out
# 单个的appender的Level过滤
log4j.appender.xxx.Threshold = INFO
# 日志格式
log4j.appender.xxx.layout = org.apache.log4j.PatternLayout

＃d：date ％-5p：日志级别％20c：全类名％L：第几行％m：自己打印的message 
log4j.appender.xxx.layout.ConversionPattern = %d{yyyy-MM-dd HH:mm:ss} %-5p %20c %L:%m %n

# 注意日志重复输出问题 因为继承了rootLogge
com.ysama.logger = ERROR,xxx
```

> DailyRollingFileAppender 每天都输出一次日志
>
> 如果只保留7天日志？
>
> 1. linux 设置 crontab
>    ```bash
>    find /home/ysama/logs/ -type f -mtime +7 -exec rm -f {} \;
>    ```
>
> 2. RollingFileAppender 可以指定单个文件最大size以及保留多少个日志文件

![image-20221011145041645](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210111450885.png)



### Jcl

引入依赖 `commons-logging`

Jcl 只是一个日志门面，底层可以设置使用不同的api。

**默认使用 Jul 作为底层 api**

```java
// JclService
private Log log = LogFactory.getLog(JclService.class);

public void test() {
    log.trace("trace");
    log.debug("debug");
    log.info("info");
    log.warn("warn");
    log.error("error");
    log.fatal("fatal");
}
```

#### 切换使用 log4j-api

1. 引入 log4j 依赖
2. 添加 log4j 配置文件

之后就会自动切换为 log4j



#### 切换 api 原理

> jcl 对不同的日志做了适配，使用适配器的设计模式，在运行时通过类加载器的机制动态获取 loggerImpl

☕查看源码：

- `LogFactory` -> `getFactory()`，会自动寻找配置文件 `commons-logging.properties`，返回工厂实例

- `LogFactory` -> `getInstance()`，从抽象类找到实例 `LogFactoryImpl`，接着找到 `newInstance()` -> `discoverLogImplementation()` 方法

- 在上面找到的方法中看到有一行代码：
  ```java
  // 只要获取到一个Logger实例就会退出循环
  for(int i=0; i<classesToDiscover.length && result == null; ++i) {
      result = createLogFromClass(classesToDiscover[i], logCategory, true);
  }
  ```

  查看变量，找到了 log4j 的一个 logger 实现
  ```java
  private static final String[] classesToDiscover = {
      LOGGING_IMPL_LOG4J_LOGGER,
      "org.apache.commons.logging.impl.Jdk14Logger",
      "org.apache.commons.logging.impl.Jdk13LumberjackLogger",
      "org.apache.commons.logging.impl.SimpleLog"
  };
  
  private static final String LOGGING_IMPL_LOG4J_LOGGER = "org.apache.commons.logging.impl.Log4JLogger";
  ```

- `createLogFromClass()` 方法负责创建上面各个 logger 实现类的实例。

  在方法中首先会尝试使用 `Class.forNmae` 寻找 `org.apache.commons.logging.impl.Log4JLogger`，`Log4JLogger` 中引用了 log4j 的 Logger，但因为没有导入 log4j 依赖于是报错导致 logAdatper 没有赋值，会返回空的 Logger。（如果成功会返回 Log4JLogger 适配器实例）

- `Jdk14Logger` 中引入的是 **jul 的 Logger**，是一种适配器模式。



### slf4j + logback

```xml
<!-- https://mvnrepository.com/artifact/ch.qos.logback/logback-classic -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.4.3</version>
    <scope>test</scope>
</dependency>


<!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-api -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>2.0.3</version>
</dependency>

```

同时自带了 `slf4j-api` 和 `logback-core`，但还是再引入一次 `slf4j-api` 最好，避免找不到依赖。

🟠 需要使用 `logback.xml` 配置文件

```xml
<configuration>
    <!-- 也可以用${user.home} -->
    <property name="LOG_HOME" value="./logs" />
    <property name="appName" value="test" />

    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="appLogAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_HOME}/${appName}.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!-- 超出容量后会重命名 -->
            <fileNamePattern>${LOG_HOME}/${appName}-%d{yyyy-MM-dd}-%i.log</fileNamePattern>
            <maxHistory>1</maxHistory>
            <maxFileSize>100MB</maxFileSize>
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <!-- additivity=false表示不继承父级appender -->
    <logger name="com.ysama.TestSlf4j" level="FINE" additivity="false">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="appLogAppender" />

    </logger>

    <root level="debug">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="appLogAppender" />
    </root>
</configuration>
```



### 日志之间切换

![image-20221012133026611](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210121330071.png)

一般的搭配情况：

1. jcl 门面 + log4j / jul 底层 api
2. slf4j 门面 + logback 底层 api
3. slf4j 门面 + 引入适配器包 + [jcl 的体系] / log4j / jul 底层。（抽象层 + 中间层 + 实现层）
   **原理：将 log4j 等的 Logger 包装成 slf4j 的 Logger，最终输出用的是 log4j。**
4. 本项目使用的是 slf4j + logback，引入的依赖使用了 log4j，需要将引入依赖的日志输出**桥接**到  slf4j 门面进行输出，不需要再单独设置 log4j 的配置文件。

![image-20221012141414803](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210121414008.png)

#### slf4j + log4j

1. 引入依赖 `slf4j` + `slf4j-log4j`

注意依赖的 `<scope>` 不能是 test，去掉即可。否则会报错 `No SLF4J providers were found.`

**注意版本问题**

```xml
<!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-log4j12 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>2.0.3</version>
</dependency>


<!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-api -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>2.0.3</version>
</dependency>
```

2. 在 `resources` 目录下新建 `log4j.properties` 配置文件。



#### log4j 桥接到 slf4j

1. 准备测试环境：

   - log4j 依赖模块
   - slf4j + logback 主模块

2. 主模块依赖

   引入了子模块的 service 但是**排除了子模块的 log4j 依赖**（桥接器的优先级要高于log4j）

   ```xml
   <dependency>
       <groupId>org.example</groupId>
       <artifactId>module-6-logger-log4j</artifactId>
       <version>1.0-SNAPSHOT</version>
       <exclusions>
           <exclusion>
               <artifactId>log4j</artifactId>
               <groupId>log4j</groupId>
           </exclusion>
       </exclusions>
   </dependency>
   <!-- slf4j + logback -->
   <!-- https://mvnrepository.com/artifact/ch.qos.logback/logback-classic -->
   <dependency>
       <groupId>ch.qos.logback</groupId>
       <artifactId>logback-classic</artifactId>
       <version>1.4.3</version>
       <scope>test</scope>
   </dependency>
   
   
   <!-- https://mvnrepository.com/artifact/org.slf4j/slf4j-api -->
   <dependency>
       <groupId>org.slf4j</groupId>
       <artifactId>slf4j-api</artifactId>
       <version>2.0.3</version>
   </dependency>
   
   <!-- 桥接依赖的log4j -->
   <!-- https://mvnrepository.com/artifact/org.slf4j/log4j-over-slf4j -->
   <dependency>
       <groupId>org.slf4j</groupId>
       <artifactId>log4j-over-slf4j</artifactId>
       <version>2.0.3</version>
   </dependency>
   ```

桥接器的内部包名和类名和 log4j 相同（api 相同），但是具体的实现则是调用了 slf4j 的 api。**子依赖调用的 log4j 接口的内部实现是 slf4j 接口。**
