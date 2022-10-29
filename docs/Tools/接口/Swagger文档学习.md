# Swagger 文档学习

[Swagger 官网](https://swagger.io/)

> OpenAPI Specification 是 RESTful APIs 的标准。
>
> 搭配 Swagger Tools 使用。
>
> 设计接口、生成代码模板、接口文档化、自动测试。



## OpenAPI（OAS3）

[About Swagger Specification | Documentation | Swagger](https://swagger.io/docs/specification/about/)

> API specifications can be written in YAML or JSON.

Swagger 是基于 OpenAPI Specification 的一系列工具，可以用来设计、构建、文档化 REST APIs.

- Swagger Editor 在浏览器上就可以写接口规范
- Swagger UI 生成接口文档、进行测试
- Swagger Codegen 生成代码模板

**整体结构** [Basic Structure (swagger.io)](https://swagger.io/docs/specification/basic-structure/)

YAML 的格式。



---

### API Server and Base Path

**API Server**

```yaml
servers:
  - url: https://api.example.com/v1  
    description: Production server
  - url: /v1 # 如果是相对路径会使用 OpenAPI定义文件的服务器地址
  - url: / # 没有地址的写法
```

>  if the definition hosted at `http://localhost:3001/openapi.yaml` specifies `url: /v2`, the `url` is resolved to `http://localhost:3001/v2`.
>
>  servers / info / externalDocs / OAuth2 模块都能用

**模板**

```yaml
servers:
  - url: https://{customerId}.saas-app.com:{port}/v2
    variables:
      customerId:
        default: demo
        description: Customer ID assigned by the service provider
      port:
        enum:
          - '443'
          - '8443'
        default: '443'
```

**使用临时服务器**

1. 专门处理文件的上传与下载
2. Deprecated but still functional 弃用但还能使用的接口

```yaml
servers:
  - url: https://api.example.com/v1
paths:
  /files:
    description: File upload and download operations
    servers:
      - url: https://files.example.com
        description: Override base path for all operations with the /files path
    ...
  /ping:
    get:
      servers:
        - url: https://echo.example.com
          description: Override base path for the GET /ping operation
```

---

### Media Types

[Media Types (swagger.io)](https://swagger.io/docs/specification/media-types/)

可以指定 request 和 response 的媒体类型，JSON、XML、images。

```yaml
application/json
application/xml
application/x-www-form-urlencoded # post的默认数据传输格式
multipart/form-data
text/plain; charset=utf-8
text/html
application/pdf
image/png
```

多个媒体类型使用相同的数据格式，可以写成组件。



---

### Paths and Operations

[Paths and Operations (swagger.io)](https://swagger.io/docs/specification/paths-and-operations/)

```yaml
paths:
  /ping:
    get:
      responses:
        '200':
          description: OK
```

在此基础上进行扩展

- tags
- parameters

**路径中不能有请求参数**

```yaml
# ❌
paths:
  /users?role={role}:
```

```yaml
# ✅
paths:
  /users:
    get:
      parameters:
        - in: query
          name: role
          schema:
            type: string
            enum: [user, poweruser, admin]
          required: true
```

**不同参数的请求要有不同的路径**

```
GET /users/findByName?firstName=value&lastName=value
GET /users/findByRole?role=value
```

**可以使用临时服务器**



---

### Describing Parameters

[Describing Parameters (swagger.io)](https://swagger.io/docs/specification/describing-parameters/)

```yaml
paths:
  /users/{userId}:
    get:
      summary: Get a user by ID
      parameters:
        - in: path # 定义参数类型 path/query/header/cookie
          name: userId
          schema:
            type: integer
          required: true
          description: Numeric ID of the user to get
```

**在 query 类型参数中需要对特殊字符进行编码**

> schema 和 content 关键词用来描述参数内容
>
> content 用来处理复杂的序列化情况。

必填参数和默认参数不能一起使用。

可以指定一组固定的参数。

可以有空值和 NULL 值。

get、delete 等关键词可以和 parameters 平级，也可以在内部覆盖 parameters 关键词。



---

### Parameter Serialization

[参数序列化](https://swagger.io/docs/specification/serialization/)

> Serialization means translating data structures or object state into a format that can be transmitted and reconstructed later. 
>
> 把数据或对象转换成可以传输的形式，并且之后可以还原。

通过两个关键字来控制：

- style 如果界定多个值，取决于参数类型
- explode 是否数组和对象中的每个内容单独生成参数

**不同的组合在传输数值、数组、对象的时候有不同的 uri 形式。**



---

### Request Body

[请求数据](https://swagger.io/docs/specification/describing-request-body/)

Request Body 默认是可选的。

```yaml
paths:
  /avatar:
    put:
      summary: Upload an avatar
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
            example:
              name: Fluffy
              petType: dog
```

`content` 可以使用通配符。

**可以配置文件上传**



---

### Responses

[响应数据](https://swagger.io/docs/specification/describing-responses/)

每个api 行为都要有响应数据。

```yaml
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ArrayOfUsers'
            application/xml:
              schema:
                $ref: '#/components/schemas/ArrayOfUsers'
            text/plain:
              schema:
                type: string
```

如果需要返回文件一般是二进制数据格式。

```yaml
paths:
  /report:
    get:
      summary: Returns the report in the PDF format
      responses:
        '200':
          description: A PDF file
          content:
            application/pdf:
              schema:
                type: string
                format: binary
```



---

### Data Types

[Data Types (swagger.io)](https://swagger.io/docs/specification/data-models/data-types/)

- string (this includes dates and files)
- number
- integer
- boolean
- array
- object



---

### Adding Examples

[Adding Examples (swagger.io)](https://swagger.io/docs/specification/adding-examples/)

使用示例值给用户提示、生成模拟请求。

示例也可以写成组件再引用，简化格式。

---

### Tags

直接加就行。

```yaml
paths:
  /pet/findByStatus:
    get:
      summary: Finds pets by Status
      tags:
        - pets
      ...
  /pet:
    post:
      summary: Adds a new pet to the store
      tags:
        - pets
      ...
  /store/inventory:
    get:
      summary: Returns pet inventories
      tags:
        - store
      ...
```



### 认证授权

[Authentication (swagger.io)](https://swagger.io/docs/specification/authentication/)

> Authentication and Authorization
>
> 身份验证、授权

OpenAPI 使用术语**安全方案（security scheme）**来描述认证和授权。

**🟠如何使用**

1. 使用 `securitySchemes` 关键词来创建**多个**安全方案。

   ```yaml
   components:
     securitySchemes:
       BasicAuth:
         type: http
         scheme: basic
         # 具体的方法看文档中相应的方案
   ```

2. 使用 `security` 来在整个 API 或单个行为上应用**选择的**安全方案。

   ```yaml
   security:
     - ApiKeyAuth: []
     - OAuth2:
         - read
         - write
   # The syntax is:
   # - scheme name:
   #     - scope 1
   #     - scope 2
   
   # specific operations
   paths:
     /users:
       get:
         summary: Get a list of users
         security:
           - OAuth2: [read]     # <------
         ...
       post:
         summary: Add a user
         security:
           - OAuth2: [write]    # <------
         ...
   ```

**Scopes**

只有 OAuth 2 and  两种安全方案可以使用 scopes（作用域），其余的不使用 scope 只能写空数组 `[]` 。

在 `security` 模块使用的 scope 必须要在 `securitySchemes` 模块中提前声明。

作用域可以被 override 覆写。

**认证的组合**

可以使用多种认证组合。

```yaml
# can use either OAuth 2 or a pair of API keys
security:
  - oauth2: [scope1, scope2]
  - apiKey1: []
    apiKey2: []
```

---

**🟢认证方法**

- HTTP 认证，使用 `Authorization` 标头
  - Basic，只发送 base64 编码的用户名和密码
  - Bear，**token authentication**，前端要发送后端生成的 token
- API Keys，header / query string / cookies 都可以，可以使用多个 Key，其实也是 **Token**
- **Cookie**，会有跨站请求攻击风险 CSRF，每个请求都要带着 cookie
- OAuth 2.0 / OpenID Connect Discovery，复杂，以后再说吧，但是不能控制复杂的权限了（也用不上）。

[Cookie Authentication (swagger.io)](https://swagger.io/docs/specification/authentication/cookie-authentication/)



### 标准结构

```yaml
path:
  /user:
    post:
      tags:
        - user
    summary:
    description:
    operationId: getPostById
    [requestBody]
    responses:
      '200':
        description:
        content:
            application/json:
              schema:
                required:
                  - id
                properties:
                  id:
                    type:
                    description:
```



```yaml
requestBody:
        description: 发送新文章的内容
        content:
          application/json:
            schema:
              required:
                - title
                - content
                - updateAt
              type: object
              properties:
                title:
                  type: string
                  description: 文章标题

```



```yaml
parameters:
- name: pid
in: path
description: post id
required: true
schema:
type: integer
format: int64
```



```yaml
responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'          
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'
        '400':
          description: Invalid ID supplied
        '404':
          description: Pet not found
        '405':
          description: Validation exception
          
responses:
        '200':
          description: 创建成功 返回id
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Post'          
        '400':
          description: Invalid ID supplied
        '404':
          description: Pet not found
        '405':
          description: Validation exception
```







## Swagger Tools

![image-20220814171812030](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202208141718584.png)

> 使用流程
>
> 1. Swagger Editor 编写实时交互的接口定义
> 2. Swagger Codegen 使用定义好的接口来生成模板代码
> 3. Swagger UI 渲染接口文档、测试

### Swagger Editor

[swagger-api/swagger-editor: Swagger Editor (github.com)](https://github.com/swagger-api/swagger-editor)

使用 Docker 安装，是一个网页 App

```bash
docker pull swaggerapi/swagger-editor

# 挂载的配置文件就是最后导出的JSON文件
docker run -d -p 8070:8080 -v /home/ysama/swagger:/home/tmp -e SWAGGER_FILE=/home/tmp/swagger.json swaggerapi/swagger-editor
```

http://localhost:8070/



### Swagger UI

[swagger-api/swagger-ui: Swagger UI is a collection of HTML, JavaScript, and CSS assets that dynamically generate beautiful documentation from a Swagger-compliant API. (github.com)](https://github.com/swagger-api/swagger-ui)

使用 Docker 安装，是一个网页 App

```bash
# 把配置文件复制到挂载目录
ls /mnt/c/users/ysama/downloads/
sudo cp /mnt/c/users/ysama/downloads/openapi.json /home/ysama/swagger/
ls /home/ysama/swagger/

docker pull swaggerapi/swagger-ui

# 启动容器的时候 挂载配置文件 指定首页路径
docker run -d -p 8071:8080 -e BASE_URL=/swagger -e SWAGGER_JSON=/home/tmp/openapi.json -v /home/ysama/swagger:/home/tmp swaggerapi/swagger-ui
```

http://localhost:8071/swagger/

相当于不能更改的 Editor，展示的成品。

Editor 其实也可以实时测试。



### Swagger Codegen

[swagger-api/swagger-codegen: swagger-codegen contains a template-driven engine to generate documentation, API clients and server stubs in different languages by parsing your OpenAPI / Swagger definition. (github.com)](https://github.com/swagger-api/swagger-codegen)

**安装的方法**

1. 下载源码，用 maven 编译。
2. **直接下载稳定版本的 jar 包**
3. 使用 Docker 容器。

```bash
cd /home
mkdir swagger-codegen
cd swagger-codegen

wget https://repo1.maven.org/maven2/io/swagger/codegen/v3/swagger-codegen-cli/3.0.34/swagger-codegen-cli-3.0.34.jar -O swagger-codegen-cli.jar

# 安装 jdk
sudo apt install openjdk-8-jre-headless

# 查看帮助
java -jar swagger-codegen-cli.jar --help

# generate client
sudo java -jar swagger-codegen-cli.jar generate \
   -i http://petstore.swagger.io/v2/swagger.json \
   -l spring \
   -o tmp/server/petstore/springboot
   
ls tmp/server/petstore/springboot

# 复制到windows桌面
sudo cp -r  tmp/server/petstore/springboot /mnt/d/desktop/springboot
```

🟠生成 SpringMVC 、SpringBoot 的步骤这里看 [Server stub generator HOWTO · swagger-api/swagger-codegen Wiki (github.com)](https://github.com/swagger-api/swagger-codegen/wiki/Server-stub-generator-HOWTO)

**直接在生成的 SpringBoot 项目中开发**

http://localhost:8080/v2/hello



## 相关文章

[Swagger Codegen: From Server to Client | by Jennifer Fu | JavaScript in Plain English](https://javascript.plainenglish.io/swagger-codegen-from-server-to-client-d6a13910ed1f)