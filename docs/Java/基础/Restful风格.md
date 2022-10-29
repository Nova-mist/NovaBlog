# REST 风格

[什么是REST API？ - YouTube](https://www.youtube.com/watch?v=lsMQRaeKNDk)

[什麼是API？CRUD？Restful API又是什麼？ - YouTube](https://www.youtube.com/watch?v=PlaKAMShvHc)

[What is REST - REST API Tutorial (restfulapi.net)](https://restfulapi.net/)

> **restful web service** is a service that uses REST APIs to communicate.
>
> While REST is a set of constraints, RESTful is an API adhering to those constraints.
>
> REST 是一种风格规范，RESTful 是形容遵守这种规范的接口。
>
> REST 规范：
>
> - 统一接口
> - 客户端-服务端的架构
> - 无状态，服务端不使用过去保存的上下文
> - 响应可缓存
> - 分层系统
> - 功能可扩展

本质是通过不同的 HTTP 请求一个相同的路径，会有不同的功能。

CRUD:

- Create -> Post
- Read -> Get
- Update -> Put
- Delete -> Delete

| POST   | /api/hotels   | 创建，会返回 id  |
| ------ | ------------- | ---------------- |
| GET    | /api/hotels   | 获取全部列表     |
| GET    | /api/hotels/1 | 根据 id 获取单个 |
| PUT    | /api/hotels/1 | 更新单个         |
| DELETE | /api/hotels/1 | 删除单个         |
