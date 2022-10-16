# ELK

## 概念

### 全文索引

```mysql
# 单表搜索
select * from product where content like '%哪吒%';

# 全文检索
select * from product_term where term = '哪吒';
```

存入数据之后立刻对其进行分词，建立**倒排索引**的表。

![image-20221012184154383](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210121842197.png)

#### elasticsearch核心概念 vs. 数据库核心概念

| **关系型数据库（比如Mysql）** | **非关系型数据库（Elasticsearch）** |
| ----------------------------- | ----------------------------------- |
| 数据库Database                | 索引Index                           |
| 表Table                       | 索引Index（原为Type）               |
| 数据行Row                     | 文档Document                        |
| 数据列Column                  | 字段Field                           |
| 约束 Schema                   | 映射Mapping                         |





## 安装

✅方法一：正常安装在 windows 上，点击 bat 文件启动 elasticsearch 和 kibana

方法二：使用 docker 容器

> 8.X 初步体验：需要新建 docker 网络，并且直接运行容器，kibana 和 elasticsearch 之间需要登录认证，并且 postman 也用不了。
>
> 需要更改 wsl 内存上限，否则无法运行容器。
>
> 有通过 `docker-compose.yaml` 的方法来一键运行集群
>
> 运行容器的时候控制台会输出 token ，没看到就要进入容器中再生成 
>
> 目录 /usr/share/elasticsearch

**原因竟然是自动开启了安全功能**

![image-20221012222553541](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210122225312.png)

> Name: `elastic` PWD：TeDxP5x+rq*kKsbH*U2V
>
> HTTP : c89766fc47d1582478eddab48d62b5ab8aac63ebf6276c1201fb99bd375a5724
>
> token: eyJ2ZXIiOiI4LjQuMyIsImFkciI6WyIxNzIuMjAuMTEyLjE6OTIwMCJdLCJmZ3IiOiJjODk3NjZmYzQ3ZDE1ODI0NzhlZGRhYjQ4ZDYyYj
> VhYjhhYWM2M2ViZjYyNzZjMTIwMWZiOTliZDM3NWE1NzI0Iiwia2V5IjoiN24tT3pJTUJrbE9yRWtwZ1RVTTU6a28tSERndnlUeS1POWR6UV
> ljSHFfdyJ9

**设置 Postman**

参考：[ES——使用Postman连接Elasticsearch_FlyLikeButterfly的博客-CSDN博客_postman请求es](https://blog.csdn.net/FlyLikeButterfly/article/details/125165771)

1. 要设置 Authorization 的用户名和密码
2. 添加 Content-Type 为 application/json 类型
3. 添加 ca 证书
4. **请求要改为 HTTPS**



## 文档入门

### 默认自带字段解析

不同的数据放在不同的索引中

![image-20221013002359085](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210130024638.png)



### 文档 id

1. 手动输入 id
   数据从其他系统导入时，本身有唯一主键（id）。如数据库中的图书、员工信息等

   ```json
   PUT /test_index/_doc/1
   {
     "test_field": "test"
   }
   ```

2. 使用 GUID 算法自动生成 id。分布式生成不冲突
   ```json
   POST /test_index/_doc
   {
     "test_field": "test1"
   }
   ```

   返回20长度字符，URL安全，base64 编码。

### 定制返回 _source 字段

```
GET /book/_doc/2?_source_includes=name,price
```



### 文档替换与删除

- 使用 PUT 更新文档，`_version` 会增加。
  旧文档的内容**不会立即删除**，只是标记为deleted。适当的时机，集群会将这些文档删除。

- **只能新建**，如果已有就会报错，这样可以防止数据被覆盖

  ```json
  PUT /test_index/_create/1
  {
    "test_field": "test"
  }
  ```

### 局部替换

使用 `PUT /index/type/id` 为文档全量替换

局部替换只修改变动字段

```json
POST /book/_update/1
{
    "doc": {
        "name": "微信小程序开发"
    }
}
```

内部与全量替换是一样的，旧文档标记为删除，新建一个文档。



### 内置脚本

1. 修改文档6的num字段，+1
   ```json
   PUT /test_index/_doc/6
   {
     "num": 0,
     "tags": []
   }
   
   // 更新脚本
   POST /test_index/_update/6
   {
      "script" : "ctx._source.num+=1"
   }
   
   // 查询数据
   GET /test_index/_doc/6
   ```

2. 搜索所有文档，将num字段乘以2输出
   ```json
   GET /test_index/_search
   {
     "script_fields": {
       "my_doubled_field": {
         "script": {
          "lang": "expression",
           "source": "doc['num'] * multiplier",
           "params": {
             "multiplier": 2
           }
         }
       }
     }
   }
   ```

### 并发

![image-20221013102254870](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210131022279.png)

- 悲观锁：每次只有一个线程能够操作数据，并发能力弱。
- 乐观锁：只通过每次对比版本号来控制修改，高并发的情况下，重复次数多，并发能力强。

**es对于文档的增删改都是基于版本号**

es内部主从同步时，是多线程异步。乐观锁机制。

- 基于版本控制
- 会丢弃旧版本的请求

### 使用版本号

```json
PUT /test_index/_doc/5?version=1

// 外部版本号
PUT /test_index/_doc/4?version=2&version_type=external

// 重试次数
POST /test_index/_doc/5/_update?retry_on_conflict=3&version=22&version_type=external
```



### 批量操作

- 批量查询
  ```json
  // 同一个索引下可以省略 _index
  GET /_mget
  {
     "docs" : [
        {
           "_index" : "book",
           "_id" :    1
        },
        {
           "_index" : "test_index",
           "_id" :    6
        }
     ]
  }
  
  // 也可使用muti search api 注意格式最后要空一行 不能格式化
  GET /book/_msearch
  { }
  {"query" : {"match_all" : {}}}
  
  ```

- 批量增删改查 bulk
  [Bulk API | Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html)

  ```json
  // 注意格式最后要空一行 不能格式化
  POST _bulk
  { "index" : { "_index" : "test", "_id" : "1" } }
  { "field1" : "value1" }
  { "delete" : { "_index" : "test", "_id" : "2" } }
  { "create" : { "_index" : "test", "_id" : "3" } }
  { "field1" : "value3" }
  { "update" : {"_id" : "1", "_index" : "test"} }
  { "doc" : {"field2" : "value2"} }
  
  GET /test/_msearch
  { }
  {"query" : {"match_all" : {}}}
  
  ```



## 整合 SpringBoot

[Introduction | Elasticsearch Java API Client](https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/introduction.html)

**Features**

1. 强类型的请求和响应
2. 异步和同步的 api 版本
3. 使用 JSON 格式，方便整合应用
4. 将协议处理委托给http客户端





## Mapping 映射

### mapping 概念

> 自动或手动为index中的_doc建立的一种数据结构和相关配置，简称为mapping映射。
>
> 类似于 mysql 的建表语句，但 elasticsearch 是动态映射，自动设置数据类型和分词方法。

获取 mapping

```json
GET book/_mapping
```

**定制化搜索**

```json
GET book/_search?q=微信 // 在所有field中搜索
GET book/_search?q="微信小程序"
GET book/_search?q=price:38.6 // 指定field
```

> es自动建立mapping的时候，设置了不同的field不同的data type。不同的data type的**分词、搜索**等行为是不一样的。所以出现了_all field和post_date field的搜索表现完全不一样。

### 精准匹配与全文检索

1. 精准匹配：`select * from book where name = 'java'`
2. 全文检索：**支持缩写、格式转换、大小写、同义词、分词**



### 建立倒排索引

1. 分词
2. normalization 规则化，`mum <-> mother`
3. 建立倒排索引

搜索的时候也会分词和规则化。



### 分词器 analyzer

组成：

- character filter：预处理文本，过滤 html 标签、转换符号
- tokenizer：分词
- token filter：处理大小写、无实意的介词助词、规则化（dogs <-> dog）

分类：[Built-in analyzer reference | Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-analyzers.html)

1. Standard analyzer：使用 unicode 分割算法，分割 `-` 不分割 `'`，全部变小写。
2. Simple analyzer：遇到非字母就分割，数字、空格、`-`、`'`，全部变为小写。
3. Whitespace analyzer：只分割空格，不做其他处理。
4. 等等。

分词策略：

- `date` 精确匹配
- `text` 全文检索

**测试分词器**

```json
GET /_analyze
{
  "analyzer": "standard",
  "text": "Text to analyze 80"
}
```

> token 实际存储的term 关键字
>
> position 在此词条在原文本中的位置
>
> start_offset/end_offset字符在原始字符串中的位置

### mapping 数据类型

[Field data types | Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html)

dates、numbers、object、version、text

类型推测 dynamic mapping

**查看 mapping**

```json
GET book/_mapping

// 所有es索引的映射
GET _mapping
```



### 手动管理 mapping

#### 创建映射

在创建索引后 **手动创建**映射

```json
PUT book2

// 设置
PUT book2/_mapping
{
	"properties": {
           "name": {
                  "type": "text"
            },
           "description": {
              "type": "text",
              "analyzer":"english",
              "search_analyzer":"english"
           },
           "pic":{
             "type":"text",
             "index":false
           },
           "studymodel":{
             "type":"text"
           }
    }
}
```

- analyzer 指定分词器

- search_analyzer 搜索时的分词器

- index 属性是否索引，例如图片地址不需要搜索就设置为 false，创建时默认为 true，所以需要**删除索引**并在重新创建时**显式指定**

- ❓store：是否在 `_source` 再存储一份文档

- 可以设置关键词 `keyword` 字段，不进行分词按照整体检索，如手机号、身份证。keyword字段通常用于过虑、排序、聚合等。

- 日期类型不用设置分词器。通常日期类型的字段用于排序。
  **可以指定日期格式**

  ```json
  // 只能在原有基础上新增，无法更新
  PUT /book2/_mapping
  {
      "properties": {
          "timestamp": {
              "type": "date",
              "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd"
          }
      }
  }
  
  PUT /book2/_doc/1
  {
    "name":"Bootstrap开发框架",
    "description":"Bootstrap是由Twitter推出的一个前台页面开发框架，在行业之中使用较为广泛。此开发框架包含了大量的CSS、JS程序代码，可以帮助开发者（尤其是不擅长页面开发的程序人员）轻松的实现一个不受浏览器限制的精美界面效果。",
    "pic":"group1/M00/00/01/wKhlQFqO4MmAOP53AAAcwDwm6SU490.jpg",
    "studymodel":"201002",
    "timestamp":"2021-10-13 18:28:58"
  }
  ```

数值类型的设置

1. 选择范围小的类型，提高检索效率。

2. 浮点数使用比例因子，整型比浮点型更j节省空间
   ```json
   // 输入的价格是23.45则ES中会将23.45乘以100存储在ES中
   "price": {
           "type": "scaled_float",
           "scaling_factor": 100
     },
   ```

#### 修改映射

🟠只能新增索引再重新创建映射，不能更新（涉及数据太多），会报错。

但可以新增字段。

```json
PUT /book2/_mapping/
{
  "properties" : {
    "new_field" : {
      "type" :    "text",
     "index":    "false"
    }
  }
}
```

#### 删除映射

删除索引也就删除了映射。



### 复杂数据类型

- 数组类型，每个 item 类型要一样。

- 空数组

- 对象

```json
PUT /company/_doc/1
{
    "address": {
        "country": "china",
        "province": "guangdong",
        "city": "guangzhou"
    },
    "name": "jack",
    "age": 27,
    "join_date": "2019-01-01",
    "tag": [
        "tag1",
        "tag2"
    ],
    "null_tag": null,
    "null_tag_array": [],
    "null_tag_array2": [null]
}

// 查询
GET /company/_doc/1
// 查看映射，没有空值的映射
GET /company/_mappings
```

![image-20221014001141078](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210140012322.png)





## 索引

### 管理索引

> 直接put数据 PUT index/_doc/1,es会自动生成索引，并建立动态映射dynamic mapping。
>
> 在生产上，我们需要自己手动建立索引和映射，为了更好地管理索引。就像数据库的建表语句一样。

#### 创建索引

1. 设置
2. 映射
3. 别名

```json
PUT /index
{
    "settings": { ... any settings ... },
    "mappings": {
       "properties" : {
            "field1" : { "type" : "text" }
        }
    },
    "aliases": {
    	"default_index": {}
  } 
}
```

🌰：创建索引、插入数据、查询索引

![image-20221014002007038](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210140020371.png)

#### 修改索引

```json
PUT /my_index/_settings
{
    "index" : {
        "number_of_replicas" : 2
    }
}
```

#### 删除索引

```json
DELETE /my_index

DELETE /index_one,index_two

DELETE /index_*
```

🔴删除全部索引 `DELETE /_all`

可以修改 `elasticsearch.yml`，设置 `action.destructive_requires_name: true` 来禁用此功能。



### type 底层结构和弃用原因

`PUT my_index/_doc/1`

在上面的语句中 `_doc` 就是 type 字段，一个索引可以有多个 type，每个 type 中又有多个数据字段。

但在底层 lucence 中没有 type 的概念，所以 es 是将 type 作为文档的一个字段储存。

es 文档的底层存储：

```json
{
   "goods": {
      "mappings": {
        "_type": {
          "type": "string",
          "index": "false"
        },
        "name": {
          "type": "string"
        }
        "price": {
          "type": "double"
        }
        "service_period": {
          "type": "string"
        },
        "eat_period": {
          "type": "string"
        }
      }
   }
}
```

同一索引下，不同type的数据存储其他type的field 大量空值，造成资源浪费。

es9中会删除 type，**不同类型的数据放到不同的索引中**



### 定制 dynamic mapping

遇到新的字段时，映射的建立策略。

#### 是否自动映射

可以在创建 mapping 指定 `dynamic` 属性：

- true 自动映射
- false 插入数据，但不建立映射，于是无法搜索该字段（不在倒排索引表中），但是可以在**搜索其他字段**时关联出现
- strict 遇到新的字段就报错

```json
// false
PUT /my_index
{
    "mappings": {
      "dynamic": "false",
       "properties": {
        "title": {
          "type": "text"
        },
        "address": {
          "type": "object",
          "dynamic": "true"
        }
	    }
    }
}

// 插入值
PUT /my_index/_doc/1
{
  "title": "my article",
  "content": "this is my article",
  "address": {
    "province": "guangdong",
    "city": "guangzhou"
  }
}

// 获取不到字段
GET /my_index/_mapping

// 但可以搜索其他字段被关联出来
GET /my_index/_search?q=guangdong
```

#### 映射策略

es 会根据传入的值推断类型

- **日期检测**：默认按照一定格式识别 date，可以手动关闭 `date_detection` ，日期会被推断为 String 类型，需要的时候显式指定某个字段为 date 类型。

```json
PUT /my_index
{
    "mappings": {
      "date_detection": false,
       "properties": {
        "title": {
          "type": "text"
        },
        "address": {
          "type": "object",
          "dynamic": "true"
        }
	    }
    }
}

// 插入
PUT /my_index/_doc/1
{
  "title": "my article",
  "content": "this is my article",
  "address": {
    "province": "guangdong",
    "city": "guangzhou"
  },
  "post_date":"2019-09-10"
}

// 查看映射
GET /my_index/_mapping
```

可以设置日期检测的格式：

```json
PUT my_index
{
  "mappings": {
    "dynamic_date_formats": ["MM/dd/yyyy"]
  }
}
// 插入数据
PUT my_index/_doc/1
{
  "create_date": "09/25/2019"
}

// 只有符合此格式才会被推断为date类型
// 如果第一次插入2019-09-25，字段类型就固定为了String，再插入09/25/2018也是String
// 如果第一次插入09/25/2019，字段类型就固定为了date，再插入2018-09-25会报错
GET /my_index/_mapping
```

- **数字检测**：默认情况下禁用，将字符串映射为浮点或整数类型。

```json
PUT my_index
{
  "mappings": {
    "numeric_detection": true
  }
}
PUT my_index/_doc/1
{
  "my_float":   "1.0", 
  "my_integer": "1" 
}
```

#### 映射模板

```json
// 插入文档的key名匹配 + value类型匹配 -> 映射为text类型并使用english分词器
PUT /my_index
{
    "mappings": {
            "dynamic_templates": [
                { 
                  "en": {
                      "match":              "*_en", 
                      "match_mapping_type": "string",
                      "mapping": {
                          "type":           "text",
                          "analyzer":       "english"
                      }
                }                  
            }
        ]
	}
}

// 插入数据
PUT /my_index/_doc/1
{
  "title": "this is my first article"
}

PUT /my_index/_doc/2
{
  "title_en": "this is my first article"
}

// 测试搜索
GET my_index/_search?q=first
GET my_index/_search?q=is
```

搜索 `first` 两条内容都可以查到，搜索 `is` 只能查到一条内容，因为在插如 `_doc/2` 的时候匹配到了自定义的映射模板，应用了 english 分词器，于是 `is` 作为停顿词被过滤掉了。

用来匹配的插入属性的模板参数，也可以使用**正则表达式**。

```
"match":   "long_*",
"unmatch": "*_text",
"match_mapping_type": "string",
"path_match":   "name.*",
"path_unmatch": "*.middle",
```

🟢应用：

1. 将 string 映射为 keyword，只使用精确搜索、对字段运行聚合排序，不进行分词。
   ```json
   {
       "strings_as_keywords": {
           "match_mapping_type": "string",
           "mapping": {
               "type": "keyword"
           }
       }
   }
   
   ```

2. 只使用全文搜索功能，不进行排序或精确搜索，可以映射为 text
   ```json
   {
       "strings_as_text": {
           "match_mapping_type": "string",
           "mapping": {
               "type": "text"
           }
       }
   }
   ```

3. 禁用排序用的评分因子，从而节省存储空间。
   ```json
   {
       "strings_as_keywords": {
           "match_mapping_type": "string",
           "mapping": {
               "type": "text",
               "norms": false,
               "fields": {
                   "keyword": {
                       "type": "keyword",
                       "ignore_above": 256
                   }
               }
           }
       }
   }
   ```



### 零停机重建索引

#### 原理 —— 使用 alias

在生产实践中，Java 程序请求的应当是一个**索引别名**，这样在切换索引时程序是无感知的。

1. 设置索引别名
   ```json
   PUT /my_index_v1/_alias/my_index
   ```

2. 在重建索引后切换索引别名
   ```json
   POST /_aliases
   {
       "actions": [
           { "remove": { "index": "my_index_v1", "alias": "my_index" }},
           { "add":    { "index": "my_index_v2", "alias": "my_index" }}
       ]
   }
   ```

#### 重建索引流程

> 场景：
>
> 1. 索引的字段无法修改，只能按照新的mapping重建创建索引，然后将数据批量导入
> 2. 例如插入 *2019-09-10* 字符串会被自动映射为日期格式，后续插入其他字符串的时候会报错，只能重建索引。
> 3. 查询数据的时候是多线程并发，中途重建索引会导致 Java 程序为了更换索引名而停机。

报错案例

```json
PUT /my_index/_doc/1
{
  "title": "2019-09-10"
}

PUT /my_index/_doc/2
{
  "title": "2019-09-11"
}

// 已经被映射成了date类型 插入字符串报错
PUT /my_index/_doc/3
{
  "title": "my first article"
}

// 修改title类型会报错
PUT /my_index/_mapping
{
  "properties": {
    "title": {
      "type": "text"
   	}
  }
}
```

**正确流程**

1. 创建索引的时候指定别名，Java 程序使用索引别名查询。
2. 使用新的 mapping 选项重建索引
3. 使用 scroll api 批量查询旧的索引，使用 bulk api 将结果批量写入新索引（反复循环几轮）
4. 将 prod_index_alias 切换到新的索引上，对于 Java 程序来说是无缝切换的

```json
// 只添加alias是不需要删除索引的
PUT /my_index/_alias/prod_index

// 重建索引
PUT /my_index_new
{
  "mappings": {
    "properties": {
		"title": {
         "type": "text"
        }
    }
  }
}

// 查询
GET /my_index/_search?scroll=1m
{
    "query": {
        "match_all": {}
    },    
    "size":  1
}

// 插入到新的索引
POST /_bulk
{ "index":  { "_index": "my_index_new", "_id": "1" }}
{ "title":    "2019-09-10" }
{ "index":  { "_index": "my_index_new", "_id": "2" }}
{ "title":    "2019-08-09" }

// 操作别名
POST /_aliases
{
    "actions": [
        { "remove": { "index": "my_index", "alias": "prod_index" }},
        { "add":    { "index": "my_index_new", "alias": "prod_index" }}
    ]
}

GET /prod_index/_search
```





## 分词器

### 定制分词器

- 过滤英语停用词，the、a、is...

```json
// 创建分词器
PUT /my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "es_std": { // 名字
          "type": "standard",
          "stopwords": "_english_"
        }
      }
    }
  }
}

// 测试分词器
GET /my_index/_analyze
{
  "analyzer": "standard", 
  "text": "a dog is in the house"
}

GET /my_index/_analyze
{
  "analyzer": "es_std",
  "text":"a dog is in the house"
}
```

- 定制分词器
  1. 定义字符 filter，映射字符 `&=> and`
  2. 定义停用词 filter，过滤 `the` / `a`
  3. 自定义分词器，设置字符 filter、分词器类型、通用 filter。

```json
// 创建
PUT /my_index
{
  "settings": {
    "analysis": {
      "char_filter": {
        "&_to_and": {
          "type": "mapping",
          "mappings": ["&=> and"]
        }
      },
      "filter": {
        "my_stopwords": {
          "type": "stop",
          "stopwords": ["the", "a"]
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "char_filter": ["html_strip", "&_to_and"],
          "tokenizer": "standard",
          "filter": ["lowercase", "my_stopwords"]
        }
      }
    }
  }
}

// 测试
GET /my_index/_analyze
{
  "analyzer": "my_analyzer",
  "text": "tom&jerry are a friend in the house, <img>, HAHA!!"
}

// 设置字段使用自定义分词器
PUT /my_index/_mapping/
{
  "properties": {
    "content": {
      "type": "text",
      "analyzer": "my_analyzer"
    }
  }
}
```

### 中文分词器

#### 安装与使用

```json
GET /_analyze
{
  "analyzer": "standard",
  "text": "中华人民共和国人民大会堂"
}
```

需要效果：中华人民共和国，人民大会堂

✅使用插件 [IK 分词器](https://github.com/medcl/elasticsearch-analysis-ik)

根据es版本下载相应版本包并解压到 `es/plugins/ik中`。（插件版本一定要与es版本相同；目录下面就是文件）

```json
GET /_analyze
{
  "analyzer": "ik_smart",
  "text": "中华人民共和国人民大会堂"
}
```

- ik_max_word: 会将文本做最细粒度的拆分
- ik_smart: 会做最粗粒度的拆分

**存储时指定分词器**

```json
// 创建索引
PUT /my_index
{
    "mappings": {
        "properties": {
            "text": {
                "type": "text",
                "analyzer": "ik_max_word",
                "search_analyzer": "ik_smart"
            }
        }
    }
}

// 插入
PUT /my_index/_doc/1
{
    "title":"中华人民共和国大会堂"
}

// 检索
GET /my_index/_search?q=人
GET /my_index/_search?q=中华
```

#### ik 配置文件

- `IKAnalyzer.cfg.xml` 配置文件，可以扩展字典和停止词字典，支持远程配置。
- `main.dic` 中文词库
- `*.dic` 介词、量词等字典

自定义建立词库：`IKAnalyzer.cfg.xml` -》`my.dic`

```xml
<entry key="ext_dict">my.dic</entry>
```

#### 词库热更新

手动添加词库的不便：

1. 更新词库后需要重启 es
2. es 分布式的

方法一：提供 http 接口给 ik 分词器，会自动更新词库。

方法二：修改源码，手动支持从 mysql 中定时自动加载新词库。

==TODO：修改源码==

[参考视频](https://www.bilibili.com/video/BV1hf4y1E7FD?p=53)

1. 创建自定义线程，在循环中重新加载词典
2. 新增加载 mysql 词典的方法（使用 jdbc 驱动）
3. config 目录下新建 `jdbc-reload.properties` 配置文件
4. mvn package 打包后替换原 jar 包
5. 将 jdbc 依赖放到 lib 目录



## java api 索引管理

### 新增索引

- **创建请求**
- 设置参数
- 指定映射
  - 文本
  - Map 键值对
  - XContentBuilder
- 设置别名
- 额外参数
- **执行操作**
- **获取结果**

异步新增：设置监听方法。

### 删除索引

- 创建操作对象
- 操作索引的客户端
- 执行删除索引操作
- 得到响应

异步删除：设置监听方法。

### 索引信息

1. 索引是否存在
2. 关闭索引
3. 开启索引



## 搜索

### 搜索语法

```json
// 默认搜索全部
GET /book/_search
```

took：耗费了几毫秒

timed_out：是否超时，这里是没有

_shards：到几个分片搜索，成功几个，跳过几个，失败几个。

hits.total：查询结果的数量，3个document

hits.max_score：score的含义，就是document对于一个search的相关度的匹配分数，越相关，就越匹配，分数也高

hits.hits：包含了匹配搜索的document的所有详细数据

**传参**

```json
GET /book/_search?q=name:java&sort=price:desc
```

类似于 sql 的 `select * from book where name like '%java%' order by price desc`

**包含语法**

```json
GET /book/_search?q=name:java

GET /book/_search?q=+name:java

GET /book/_search?q=-name:java
```

**直接搜索所有 field**

```json
GET /book/_search?q=java
```

并不是遍历每个 field，而是去 `_all` 字段中寻找。建立索引时 es 会将所有的分词保存一份副本放到 `_all` 字段中。



**设置超时时间及时返回结果**

10ms 内能查到多少就返回多少

```json
GET /book/_search?timeout=10ms
```

全局设置：配置文件中设置 search.default_search_timeout：100ms。默认不超时。

![image-20221015140158932](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210151402242.png)

### 多索引搜索

```json
// 检索两个索引
GET /book,book2/_search
```

语法：

```
/_search：所有索引下的所有数据都搜索出来
/index1/_search：指定一个index，搜索其下所有的数据
/index1,index2/_search：同时搜索两个index下的数据
/index*/_search：按照通配符去匹配多个索引
```

实际应用：检索生产环境中的日志

log_to_es_20190910

log_to_es_20190911

log_to_es_20180910

**搜索图解**

![image-20221015141003604](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210151410577.png)

### 分页搜索

类似 sql 的 `select * from book limit 1,5`

```json
GET /book/_search?size=10

GET /book/_search?size=10&from=0

GET /book/_search?size=10&from=20

GET /book_search?from=0&size=3
```

**避免 deep paging**

根据相关度评分倒排序，所以分页过深，协调节点会将大量数据聚合分析。

会占用大量带宽、内存、cpu

![image-20221015143207145](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210151432689.png)



### query DSL

es 特有的搜索语法，可以在 GET 的请求体中携带搜索条件。

- 查询全部 GET /book/_search

```json
GET /book/_search
{
  "query": { "match_all": {} }
}
```

- 排序 GET /book/_search?sort=price:desc

```json
GET /book/_search 
{
    "query" : {
        "match" : {
            "name" : " java"
        }
    },
    "sort": [
        { "price": "desc" }
    ]
}
```

- multi_match

```json
GET /book/_search
{
  "query": {
    "multi_match": {
      "query": "java程序员",
      "fields": ["name", "description"]
    }
  }
}
```

- 范围查询

```json
GET /book/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 80,
		"lte": 90
      }
    }
  }
}
```

- 分页查询 GET /book/_search?size=10&from=0

```json
GET  /book/_search 
{
  "query": { "match_all": {} },
  "from": 0,
  "size": 1
}
```

指定返回字段 GET /book/ _search? _source=name,studymodel

```json
GET /book/_search 
{
  "query": { "match_all": {} },
  "_source": ["name", "studymodel"]
}
```

- **关键词搜索**，不会分词

```json
GET /book/_search
{
  "query": {
    "term": {
      "description": "java程序员"
    }
  }
}

GET /book/_search
{
    "query": {
        "terms": {
            "tag": [
                "search",
                "full_text",
                "nosql"
            ]
        }
    }
}
```

- **存在字段**

```json
GET /_search
{
    "query": {
        "exists": {
            "field": "join_date"
        }
    }
}
```

- 根据 id 查询

```json
GET /book/_search
{
    "query": {
        "ids" : {
            "values" : ["1", "4", "100"]
        }
    }
}
```

- 根据前缀查询字段

```json
GET /book/_search
{
    "query": {
        "prefix": {
            "description": {
                "value": "spring"
            }
        }
    }
}
```

- **正则查询**

```json
GET /book/_search
{
    "query": {
        "regexp": {
            "description": {
                "value": "j.*a",
                "flags" : "ALL",
                "max_determinized_states": 10000,
                "rewrite": "constant_score"
            }
        }
    }
}
```

- 🍄模糊查询，适用于：换个字符、多个/少个字符、相邻字符调换顺序。但是查出的结果 `_score` 评分很低。

```json
GET /book/_search
{
    "query": {
        "fuzzy": {
            "description": {
                "value": "jave"
            }
        }
    }
}
```



**通过组合构建复杂的检索语句**

与或非，可以内层嵌套

```json
// 插入
POST /website/_doc/1
{
          "title": "my hadoop article",
          "content": "hadoop is very bad",
          "author_id": 111
}

POST /website/_doc/2
{
          "title": "my elasticsearch  article",
          "content": "es is very bad",
          "author_id": 112
}
POST /website/_doc/3
{
          "title": "my elasticsearch article",
          "content": "es is very goods",
          "author_id": 111
}

// 搜索
GET /website/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "title": "elasticsearch"
          }
        }
      ],
      "should": [
        {
          "match": {
            "content": "elasticsearch"
          }
        }
      ],
      "must_not": [
        {
          "match": {
            "author_id": 111
          }
        }
      ]
    }
  }
}
```

### 全文检索

创建索引

```json
PUT /book/
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "name":{
        "type": "text",
        "analyzer": "ik_max_word",
        "search_analyzer": "ik_smart"
      },
      "description":{
        "type": "text",
        "analyzer": "ik_max_word",
        "search_analyzer": "ik_smart"
      },
      "studymodel":{
        "type": "keyword"
      },
      "price":{
        "type": "double"
      },
      "timestamp": {
         "type": "date",
         "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
      },
      "pic":{
        "type":"text",
        "index":false
      }
    }
  }
}
```

插入数据

```json
PUT /book/_doc/1
{
"name": "Bootstrap开发",
"description": "Bootstrap是由Twitter推出的一个前台页面开发css框架，是一个非常流行的开发框架，此框架集成了多种页面效果。此开发框架包含了大量的CSS、JS程序代码，可以帮助开发者（尤其是不擅长css页面开发的程序人员）轻松的实现一个css，不受浏览器限制的精美界面css效果。",
"studymodel": "201002",
"price":38.6,
"timestamp":"2019-08-25 19:11:35",
"pic":"group1/M00/00/00/wKhlQFs6RCeAY0pHAAJx5ZjNDEM428.jpg",
"tags": [ "bootstrap", "dev"]
}

PUT /book/_doc/2
{
"name": "java编程思想",
"description": "java语言是世界第一编程语言，在软件开发领域使用人数最多。",
"studymodel": "201001",
"price":68.6,
"timestamp":"2019-08-25 19:11:35",
"pic":"group1/M00/00/00/wKhlQFs6RCeAY0pHAAJx5ZjNDEM428.jpg",
"tags": [ "java", "dev"]
}

PUT /book/_doc/3
{
"name": "spring开发基础",
"description": "spring 在java领域非常流行，java程序员都在用。",
"studymodel": "201001",
"price":88.6,
"timestamp":"2019-08-24 19:11:35",
"pic":"group1/M00/00/00/wKhlQFs6RCeAY0pHAAJx5ZjNDEM428.jpg",
"tags": [ "spring", "java"]
}
```

搜索，省略了 `bool:{}`

```json
GET  /book/_search 
{
    "query" : {
        "match" : {
            "description" : "java程序员"
        }
    }
}
```

返回结果默认按照 `_score` 反应的分词匹配度来排序。



### Filter

- filter，只有条件过滤的功能，不影响相关度分数
- 写在 query 中的 match，会计算相对于搜索条件的相关度，**分数影响排序**

> 应用场景：
>
> 使用 query 获取根据匹配分数排序的搜索结果
>
> 使用 filter 筛选出符合条件的结果，经常搭配 query 使用

```json
GET /book/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "description": "java程序员"
          }
        },
        // 新增条件会影响分数
        {
          "range": {
            "price": {
              "gte": 80,
		      "lte": 90
            }
          }
        }
      ]
    }
  }
}

// 正确用法 只是用于过滤结果
GET /book/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match": {
            "description": "java程序员"
          }
        }
      ],
      "filter": {
        "range": {
          "price": {
            "gte": 80,
		     "lte": 90
          }
        }
      }
    }
  }
}
```



### 验证查询计划

```json
GET /book/_validate/query?explain
{
  "query": {
    "mach": { // 此处报错
      "description": "java程序员"
    }
  }
}
```

适用于复杂的搜索，在使用之前可以先验证语法。

explain 类似 mysql 的执行计划，可以看到搜索的目标信息。



### 定制排序规则

默认按照 `_score` 降序排序

使用 `sort` 字段定制排序

```json
// method1
GET /book/_search 
{
    "query": {
        "constant_score": { // 不影响评分
            "filter" : {
                "term" : {
                    "studymodel" : "201001"
                }
            }
        }
    },
    "sort": [
        {
            "price": {
                "order": "asc"
            }
        }
    ]
}

// method2
GET /book/_search 
{
    "query": {
        "match_all": {}
    },
    "filter": {
        "term": {
            "studymodel": "201001"
        }
    }
    "sort": [
        {
            "price": {
                "order": "asc"
            }
        }
    ]
}
```



### Text 字段排序

因为 text 字段会进行分词存入倒排索引表，es 无法获取真实值用来排序，于是会报错。

方法一：创建索引时，指定 text 类型映射 `fielddata: true`，按照第一个分词来排序。

✅可以将一个text field建立两次索引，一个分词，用来进行搜索；一个不分词，用来进行排序

![image-20221015162508942](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210151625372.png)

![image-20221015162523639](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210151625637.png)



### Scroll 分批查询

> 适用于查询数据过多的情况，一次查出内存会溢出，所以需要一批一批查询。
>
> scoll搜索会在第一次搜索的时候，保存一个当时的视图快照，之后只会基于该旧的视图快照提供数据搜索

```json
GET /book/_search?scroll=1m // 每次查询的时间
{
  "query": {
    "match_all": {}
  },
  "size": 3 // 每次查询条数
}
```

会返回第一次查询的结构，含有 `scroll_id`

**继续查询**

```json
GET /_search/scroll
{
    "scroll": "1m", 
    "scroll_id" : "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAMOkWTURBNDUtcjZTVUdKMFp5cXloVElOQQ=="
}
```

应用场景：批量下载数据、数据转移、零停机重建索引



## java api 搜索

### 普通搜索

1. 构建搜索请求（可以排除字段）
2. 执行搜索
3. 获取结果（getHits）

### 分页搜索

```java
//第几页
int page=1;
//每页几个
int size=2;
//下标计算
int from=(page-1)*size;


searchSourceBuilder.from(from);
searchSourceBuilder.size(size);
```

### ID 搜索

```java
searchSourceBuilder.query(QueryBuilders.idsQuery().addIds("1","4","100"));
```

### match 搜索

```java
searchSourceBuilder.query(QueryBuilders.matchQuery("description", "java程序员"));

searchSourceBuilder.query(QueryBuilders.multiMatchQuery("java程序员","name","description"));
```

### 关键词搜索

```java
searchSourceBuilder.query(QueryBuilders.termQuery("description", "java程序员"));
```

### bool 搜索

```java
//构建multiMatch请求
MultiMatchQueryBuilder multiMatchQueryBuilder = QueryBuilders.multiMatchQuery("java程序员", "name", "description");
//构建match请求
MatchQueryBuilder matchQueryBuilder = QueryBuilders.matchQuery("studymodel", "201001");

// 与或非
BoolQueryBuilder boolQueryBuilder=QueryBuilders.boolQuery();
boolQueryBuilder.must(multiMatchQueryBuilder);
boolQueryBuilder.should(matchQueryBuilder);

// filter
boolQueryBuilder.filter(QueryBuilders.rangeQuery("price").gte(50).lte(90));

// 排序
searchSourceBuilder.sort("price", SortOrder.ASC);

searchSourceBuilder.query(boolQueryBuilder);
```



## 聚合

### 使用示例

- 计算每个 keyword 的成员数量

类似 sql `select studymodel，count(*) from book group by studymodel`

```json
{
    "size": 0, // 不返回具体内容
    "query": {
        "match_all": {}
    },
    "aggs": {
        "group_by_studymodel": {
            "terms": {
                "field": "studymodel"
            }
        }
    }
}
```

- 计算每个 tags 【数组】 的成员数量

```json
// 设置映射 fielddata:true
PUT /book/_mapping/
{
  "properties": {
    "tags": {
      "type": "text",
      "fielddata": true
    }
  }
}

// tags是数组
GET /book/_search
{
  "size": 0, 
  "query": {
    "match_all": {}
  }, 
  "aggs": {
    "group_by_tags": {
      "terms": { "field": "tags" }
    }
  }
}

// 加上搜索条件
"query": {
    "match": {
      "description": "java程序员"
    }
  }, 
```

- 计算分组平均值

```json
GET /book/_search
{
    "size": 0,
    "aggs" : {
        "group_by_tags" : {
            "terms" : { 
              "field" : "tags",
              // 排序
              "order": {
                "avg_price": "desc"
              }
            },
            // 子聚合
            "aggs" : {
                "avg_price" : {
                    // 求平均
                    "avg" : { "field" : "price" }
                }
            }
        }
    }
}
```

- 按照价格区间分组，再组内按照 tag 分组，最后计算每组 tag 的平均值，**组内降序**。

```json
{
    "size": 0,
    "aggs": {
        // 自定义名字
        "range_by_price": {
            // 区间选项
            "range": {
                "field": "price",
                "ranges": [
                    {
                        "from": 0,
                        "to": 40
                    },
                    {
                        "from": 40,
                        "to": 60
                    },
                    {
                        "from": 60,
                        "to": 80
                    }
                ]
            },
            "aggs": {
                "group_by_tags": {
                    "terms": {
                        "field": "tags",
                        "order": {
                            "avg_price": "desc"
                        }
                    },
                    "aggs": {
                        "avg_price": {
                            "avg": {
                                "field": "price"
                            }
                        }
                    }
                }
            }
        }
    }
}
```



### 概念

- `bucket` 数据分组，类似于 sql 的 `group by`
- `metric` 对数据分组进行的操作，类似于 sql 的 `avg()` 、`sum()` 、`count(*)`



### 聚合案例

创建索引和映射、插入数据

```json
PUT /tvs
{
    "mappings": {
        "properties": {
            "price": {
                "type": "long"
            },
            "color": {
                "type": "keyword"
            },
            "brand": {
                "type": "keyword"
            },
            "sold_date": {
                "type": "date"
            }
        }
    }
}
```

批量插入数据

```json
POST /tvs/_bulk
{ "index": {}}
{ "price" : 1000, "color" : "红色", "brand" : "长虹", "sold_date" : "2019-10-28" }
{ "index": {}}
{ "price" : 2000, "color" : "红色", "brand" : "长虹", "sold_date" : "2019-11-05" }
{ "index": {}}
{ "price" : 3000, "color" : "绿色", "brand" : "小米", "sold_date" : "2019-05-18" }
{ "index": {}}
{ "price" : 1500, "color" : "蓝色", "brand" : "TCL", "sold_date" : "2019-07-02" }
{ "index": {}}
{ "price" : 1200, "color" : "绿色", "brand" : "TCL", "sold_date" : "2019-08-19" }
{ "index": {}}
{ "price" : 2000, "color" : "红色", "brand" : "长虹", "sold_date" : "2019-11-05" }
{ "index": {}}
{ "price" : 8000, "color" : "红色", "brand" : "三星", "sold_date" : "2020-01-01" }
{ "index": {}}
{ "price" : 2500, "color" : "蓝色", "brand" : "小米", "sold_date" : "2020-02-12" }

```

测试搜索

```json
GET /tvs/_mapping

// 全部数据
GET /tvs/_search
{
    "query": {
        "match_all": {}
    }
}
```

- 需求1：统计哪种颜色的电视销量最高

```json
GET /tvs/_search
{
    "size": 0, // 不获取聚合的原始数据
    "aggs": {
        "popular_colors": {
            "terms": { // 根据字段分组
                "field": "color",
                "order": { "_count": "asc" }
            }
        }
    }
}
```

[Terms aggregation | Elasticsearch Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html#_ordering_by_count_ascending)

- 需求2：统计分钟颜色电视平均价格

相当于 sql `select avg(price) from tvs group by color`

```json
GET /tvs/_search
{
   "size" : 0,
   "aggs": {
      "colors": {
         "terms": {
            "field": "color",
            "order": {"avg_price": "asc"}
         },
         "aggs": { 
            "avg_price": { 
               "avg": {
                  "field": "price" 
               }
            }
         }
      }
   }
}
```

- 需求3：每个颜色下的平均价格和每个颜色下每个品牌的平均价格

```json
GET /tvs/_search 

{
  "size": 0,
  "aggs": {
    "group_by_color": {
      "terms": {
        "field": "color"
      },
      "aggs": {
        "color_avg_price": {
          "avg": {
            "field": "price"
          }
        },
        "group_by_brand": {
          "terms": {
            "field": "brand",
            "order": {"brand_avg_price": "desc"}
          },
          "aggs": {
            "brand_avg_price": {
              "avg": {
                "field": "price"
              }
            }
          }
        }
      }
    }
  }
}
```

- 需求4：metrir 操作，每个颜色的平均、最小、最大、求和

```json
GET /tvs/_search
{
   "size" : 0,
   "aggs": {
      "colors": {
         "terms": {
            "field": "color"
         },
         "aggs": {
            "avg_price": { "avg": { "field": "price" } },
            "min_price" : { "min": { "field": "price"} }, 
            "max_price" : { "max": { "field": "price"} },
            "sum_price" : { "sum": { "field": "price" } } 
         }
      }
   }
}
```

- 需求5：按照某个字段的范围区间来进行分组

自动将 price 字段按照 2000 的间隔来分组

```json
GET /tvs/_search
{
   "size" : 0,
   "aggs":{
      "price":{
         "histogram":{ 
            "field": "price",
            "interval": 2000
         },
         "aggs":{
            "income": {
               "sum": { 
                 "field" : "price"
               }
             }
         }
      }
   }
}
```

- 需求6：按照日期分组聚合
  - `min_doc_count`：对于日期分组聚合，默认过滤掉没有数据的分组，使用 `min_doc_count` 设定保留分组的最小值，设为0就是显示所有分组
  - extended_bounds，min，max：划分分组的起始和终止范围

```json
GET /tvs/_search
{
   "size" : 0,
   "aggs": {
      "sales": {
         "date_histogram": {
            "field": "sold_date",
            "calendar_interval": "month", 
            "format": "yyyy-MM-dd",
            "min_doc_count" : 1, 
            "extended_bounds" : { 
                "min" : "2019-01-01",
                "max" : "2020-12-31"
            }
         }
      }
   }
}
```

- 需求7：统计每季度每个品牌的销售额

分了季度、品牌、总额三个分组

```json
{
  "size": 0,
  "aggs": {
    "group_by_sold_date": {
      "date_histogram": {
        "field": "sold_date",
        "calendar_interval": "quarter",
        "format": "yyyy-MM-dd",
        "min_doc_count": 0,
        "extended_bounds": {
          "min": "2019-01-01",
          "max": "2020-12-31"
        }
      },
      "aggs": {
        "group_by_brand": {
          "terms": {
            "field": "brand"
          },
          "aggs": {
            "sum_price": {
              "sum": {
                "field": "price"
              }
            }
          }
        },
        "total_sum_price": {
          "sum": {
            "field": "price"
          }
        }
      }
    }
  }
}
```

- 需求8：查询某个品牌按颜色的销量

类似 sql `select count(*) from tvs where brand like '%小米%' group by color`

聚合都是在搜索的结果中进行的

```json
{
  "size": 0,
  "query": {
    "term": {
      "brand": {
        "value": "小米"
      }
    }
  },
  "aggs": {
    "group_by_color": {
      "terms": {
        "field": "color"
      }
    }
  }
}
```

- 需求9：单个品牌与所有品牌销量对比

第一个 `aggs` 下有两个自定义名称的嵌套

```json
{
  "size": 0, 
  "query": {
    "term": {
      "brand": {
        "value": "小米"
      }
    }
  },
  "aggs": {
    "single_brand_avg_price": {
      "avg": {
        "field": "price"
      }
    },
    "all": {
      "global": {},
      "aggs": {
        "all_brand_avg_price": {
          "avg": {
            "field": "price"
          }
        }
      }
    }
  }
}
```

- 需求10：过滤+聚合，统计价格大于 1200 的电视平均价格

先将搜索的结果进行过滤后再聚合。

```json
{
    "size": 0,
    "query": {
        "constant_score": {
            "filter": {
                "range": {
                    "price": {
                        "gte": 1200
                    }
                }
            }
        }
    },
    "aggs": {
        "avg_price": {
            "avg": {
                "field": "price"
            }
        }
    }
}
```

- 需求11：统计每个品牌最近一个月的平均价格

在分组中过滤的好处：可有多个不同过滤的分组，第一个 `aggs` 中可有多个自定义命名的嵌套。

```json
{
    "size": 0,
    "query": {
        "match_all": {}
    },
    "aggs": {
        "recent_150d": {
            "filter": {
                "range": {
                    "sold_date": {
                        "gte": "now-150d"
                    }
                }
            },
            "aggs": {
                "group_by_brand": {
                    "terms": {
                        "field": "brand"
                    },
                    "aggs": {
                        "avg_price": {
                            "avg": {
                                "field": "price"
                            }
                        }
                    }
                }
            }
        }
    }
}

// 查询某个品牌
"query": {
    "term": {
      "brand": {
        "value": "小米"
      }
    }
  },
```

- 需求12：每种颜色的平均销售额降序排序

相当于sql子表数据字段可以立刻使用

```json
{
  "size": 0,
  "aggs": {
    "group_by_color": {
      "terms": {
        "field": "color",
        // 升序
        "order": {
          "avg_price": "asc"
        }
      },
      "aggs": {
        "avg_price": {
          "avg": {
            "field": "price"
          }
        }
      }
    }
  }
}
```

- 需求13：按照每种颜色的每种品牌平均销售额降序排序

```json
{
    "size": 0,
    "aggs": {
        "group_by_color": {
            "terms": {
                "field": "color"
            },
            "aggs": {
                "group_by_brand": {
                    "terms": {
                        "field": "brand",
                        "order": {
                            "avg_price": "desc"
                        }
                    },
                    "aggs": {
                        "avg_price": {
                            // 平均值关键词
                            "avg": {
                                "field": "price"
                            }
                        }
                    }
                }
            }
        }
    }
}
```



## java api 聚合

1. 构建请求
   - SearchRequest
   - SearchSourceBuilder
   - TermsAggregation
2. 执行请求
3. 获取结果

需求一：按颜色分组，计算每个颜色卖出的个数

```java
//1 构建请求
SearchRequest searchRequest=new SearchRequest("tvs");

//请求体
SearchSourceBuilder searchSourceBuilder=new SearchSourceBuilder();
searchSourceBuilder.size(0);
searchSourceBuilder.query(QueryBuilders.matchAllQuery());

TermsAggregationBuilder termsAggregationBuilder = AggregationBuilders.terms("group_by_color").field("color");
searchSourceBuilder.aggregation(termsAggregationBuilder);

//请求体放入请求头
searchRequest.source(searchSourceBuilder);

//2 执行
SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
//3 获取结果
Aggregations aggregations = searchResponse.getAggregations();
Terms group_by_color = aggregations.get("group_by_color");
List<? extends Terms.Bucket> buckets = group_by_color.getBuckets();
for (Terms.Bucket bucket : buckets) {
    String key = bucket.getKeyAsString();
    System.out.println("key:"+key);

    long docCount = bucket.getDocCount();
    System.out.println("docCount:"+docCount);

    System.out.println("=================================");
}
```

需求二：按颜色分组的每组平均价格

```java
//terms聚合下填充一个子聚合
AvgAggregationBuilder avgAggregationBuilder = AggregationBuilders.avg("avg_price").field("price");
termsAggregationBuilder.subAggregation(avgAggregationBuilder)
```

需求三：按颜色分组，每个颜色卖出个数、平均值、最大最小值

```java
//termsAggregationBuilder里放入多个子聚合
AvgAggregationBuilder avgAggregationBuilder = AggregationBuilders.avg("avg_price").field("price");

termsAggregationBuilder.subAggregation(avgAggregationBuilder);
```

需求四：价格区间 histogram 销售总额

```java
HistogramAggregationBuilder histogramAggregationBuilder = AggregationBuilders.histogram("by_histogram").field("price").interval(2000);

SumAggregationBuilder sumAggregationBuilder = AggregationBuilders.sum("income").field("price");
histogramAggregationBuilder.subAggregation(sumAggregationBuilder);
```

需求五：计算每个季度的销售总额

```java
DateHistogramAggregationBuilder dateHistogramAggregationBuilder = AggregationBuilders.dateHistogram("date_histogram").field("sold_date").calendarInterval(DateHistogramInterval.QUARTER)
    .format("yyyy-MM-dd").minDocCount(0).extendedBounds(new ExtendedBounds("2019-01-01", "2020-12-31"));
SumAggregationBuilder sumAggregationBuilder = AggregationBuilders.sum("income").field("price");
dateHistogramAggregationBuilder.subAggregation(sumAggregationBuilder);

searchSourceBuilder.aggregation(dateHistogramAggregationBuilder);
```



## es7 sql

需求：按照颜色分组，计算每个颜色卖出的电视的数量、平均值、最大最小值。

```mysql
select color,count(color), avg(price), min(price), max(price), sum(price) from tvs group by color
```

**es 使用 sql 语句**

```json
POST /_sql?format=txt
{
    "query": "SELECT * FROM tvs "
}

// 计算每个颜色卖出的电视的数量、平均值、最大最小值
{
    "query": "select color,count(color), avg(price), min(price), max(price), sum(price) from tvs group by color"
}
```

**sql 启动方式**

1. http 请求
2. 客户端 `sql-cli.bat`
3. 代码

**响应格式**

`/_sql?format=`

csv / json / txt / yaml

**查看 sql 翻译成 DSL 请求**

```json
POST /_sql/translate
{
    "query": "SELECT * FROM tvs "
}
```

**DSL 与 sql 结合**

```json
POST /_sql?format=txt
{
    "query": "SELECT * FROM tvs",
    "filter": {
        "range": {
            "price": {
                "gte" : 1200,
                "lte" : 2000
            }
        }
    }
}
```



## Logstash

### 基础

数据抽取工具，通过输入插件获取数据、过滤插件进行数据转换、输出插件提供数据给 es。

```bash
logstash.bat -f ../config/test.conf
```

🟠**都需要安装相应插件**

**读取**

```conf
// 标准输入
input{
    stdin{
       
    }
}

// 读取文件 会监听文件变化
input {
    file {
        path => ["/var/*/*"]
        start_position => "beginning"
    }
}

// TCP网络
input {
  tcp {
    port => "1234"
  }
}

// 标准输出
output {
    stdout{
        codec=>rubydebug
    }
}
```

**过滤**

1. 正则捕获、移除字段
2. 时间处理
3. 数据修改：替换、分割、重命名、删除字段

```conf
input {
    stdin {}
}
filter {
    grok {
        match => { "message" => "%{IP:clientip}\ \[%{HTTPDATE:timestamp}\]\ %{QS:referrer}\ %{NUMBER:response}\ %{NUMBER:bytes}" }
        remove_field => [ "message" ]
   }
date {
        match => ["timestamp", "dd/MMM/yyyy:HH:mm:ss Z"]
    }
mutate {
          convert => [ "response","float" ]
           rename => { "response" => "response_new" }   
           gsub => ["referrer","\"",""]          
           split => ["clientip", "."]
        }
}
output {
    stdout {
        codec => "rubydebug"
    }
}
```

**输出**

```conf
// 标注输出
output {
    stdout {
        codec => rubydebug
    }
}

// 保存为文件
output {
    file {
        path => "/data/log/%{+yyyy-MM-dd}/%{host}_%{+HH}.log"
    }
}

// 输出到 elasticsearch
output {
    elasticsearch {
        host => ["192.168.1.1:9200","172.16.213.77:9200"]
        index => "logstash-%{+YYYY.MM.dd}"       
    }
}
```

输出到 elasticsearch：

- host 端口数组
- index 写入elasticsearch的索引的名称

### 读取 nginx 日志

```conf
input {
    file {
        path => ["D:/ES/logstash-7.3.0/nginx.log"]        
        start_position => "beginning"
    }
}

filter {
    grok {
        match => { "message" => "%{IP:clientip}\ \[%{HTTPDATE:timestamp}\]\ %{QS:referrer}\ %{NUMBER:response}\ %{NUMBER:bytes}" }
        remove_field => [ "message" ]
   }
	date {
        match => ["timestamp", "dd/MMM/yyyy:HH:mm:ss Z"]
    }
	mutate {
           rename => { "response" => "response_new" }
           convert => [ "response","float" ]
           gsub => ["referrer","\"",""]
           remove_field => ["timestamp"]
           split => ["clientip", "."]
        }
}

output {
    stdout {
        codec => "rubydebug"
    }

elasticsearch {
    host => ["localhost:9200"]
    index => "logstash-%{+YYYY.MM.dd}"       
}

}
```



## Kibana

功能：

1. 基本查询
2. 可视化（时序图、饼状图、数据表）
3. 仪表盘：添加视图，参考样例数据的可视图
4. 开发工具：Grok Debugger
5. 堆栈监测



## 集群部署

节点角色：

- 主结点：集群的管理、索引的管理
- 数据结点：保存数据分片，负责索引和搜索操作
- 客户端结点：负载均衡器，将请求转发给其他结点

elasticsearch 配置文件：

```yaml
node.master: #是否允许为主结点
node.data: #允许存储数据作为数据结点
node.ingest: #是否允许成为协调节点
```

四种组合方式：

```yaml
master=true，data=true：即是主结点又是数据结点
master=false，data=true：仅是数据结点
master=true，data=false：仅是主结点，不存储数据
master=false，data=false：即不是主结点也不是数据结点，此时可设置ingest为true表示它是一个客户端。
```

**架构**

- 在服务模块、日志、数据库上使用 logstash 收集数据发送到 es 集群
- kibana 连接 es 协调节点
- 搜索模块通过代码向 es 协调节点查询

![image-20221016191241897](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210161912190.png)



## TODO：8.4 java api



## TODO：项目实战

[文档合集 (ydlclass.com)](https://www.ydlclass.com/doc21xnv/distribute/elk/elk2.html#第二十三章-项目实战)
