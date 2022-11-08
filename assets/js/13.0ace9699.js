(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{284:function(t,s,a){"use strict";a.r(s);var n=a(13),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"springboot-经验"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#springboot-经验"}},[t._v("#")]),t._v(" SpringBoot 经验")]),t._v(" "),s("h2",{attrs:{id:"项目结构"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#项目结构"}},[t._v("#")]),t._v(" 项目结构")]),t._v(" "),s("h3",{attrs:{id:"多模块"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#多模块"}},[t._v("#")]),t._v(" 多模块")]),t._v(" "),s("ul",[s("li",[t._v("使用 "),s("code",[t._v("Spring Initializr")]),t._v(" 生成器创建父项目后，只需要 "),s("em",[t._v("New Project")]),t._v(" 添加子模块，不能再用生成器。")]),t._v(" "),s("li",[t._v("在子模块中创建单独的应用启动入口。"),s("code",[t._v("@SpringBootApplication")])]),t._v(" "),s("li",[t._v("如果某个依赖不是所有子模块都需要，就不要在父项目的依赖中引入，而是在子模块的依赖中引入。（例如在父项目中引入了 "),s("code",[t._v("mybatis-spring-boot-starter")]),t._v("，子模块就必须要配置 DataSource，否则就无法启动子应用）")])]),t._v(" "),s("h2",{attrs:{id:"mybatis-错误"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#mybatis-错误"}},[t._v("#")]),t._v(" Mybatis 错误")]),t._v(" "),s("blockquote",[s("p",[t._v("结论：mapper 是无法重载的")])]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210051641983.png",alt:"image-20221005164059657"}})]),t._v(" "),s("h2",{attrs:{id:"获取注入的-bean"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#获取注入的-bean"}},[t._v("#")]),t._v(" 获取注入的 Bean")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210062121449.png",alt:"image-20221006212100745"}})]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210091801285.png",alt:"image-20221009180113520"}})]),t._v(" "),s("h2",{attrs:{id:"常见错误"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#常见错误"}},[t._v("#")]),t._v(" 常见错误")]),t._v(" "),s("h3",{attrs:{id:"autowire-未找到"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#autowire-未找到"}},[t._v("#")]),t._v(" Autowire 未找到")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210081719707.png",alt:"image-20221008171939318"}})]),t._v(" "),s("p",[t._v("类上是否使用了 "),s("code",[t._v("@Component")]),t._v(" 或 "),s("code",[t._v("@Controller")]),t._v(" ?")]),t._v(" "),s("h2",{attrs:{id:"使用-errorcontroller"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#使用-errorcontroller"}},[t._v("#")]),t._v(" 使用 ErrorController")]),t._v(" "),s("p",[t._v("会将错误页面转发到 "),s("code",[t._v("ERROR_PATH")]),t._v(" 路由，然后解析到 "),s("code",[t._v("error.html")]),t._v(" 视图，可以实现"),s("strong",[t._v("后端的自定义 404 页面")]),t._v("。")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Controller")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ErrorControllerImpl")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("implements")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ErrorController")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("ERROR_PATH")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/error"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Autowired")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ErrorAttributes")]),t._v(" errorAttributes"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Override")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getErrorPath")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("ERROR_PATH")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@RequestMapping")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("ERROR_PATH")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("error")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("HttpServletRequest")]),t._v(" request"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Model")]),t._v(" model"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 自定义显示错误信息")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Map")]),s("span",{pre:!0,attrs:{class:"token generics"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Object")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v(" errorMap "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" errorAttributes"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getErrorAttributes")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ServletWebRequest")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("request"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ErrorAttributeOptions")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("of")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ErrorAttributeOptions"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Include")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("MESSAGE")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        model"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("addAttribute")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"errors"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" errorMap"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"error"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"springboot-静态资源过滤"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#springboot-静态资源过滤"}},[t._v("#")]),t._v(" SpringBoot 静态资源过滤")]),t._v(" "),s("p",[t._v("SpringMVC web 项目中，前端页面是放在 "),s("code",[t._v("webapp")]),t._v(" 目录中的。")]),t._v(" "),s("p",[t._v("==TODO：存在静态资源的问题吗，怎么发布？？==")]),t._v(" "),s("p",[t._v("SpringBoot web 项目中，静态资源默认是在 "),s("code",[t._v("resources")]),t._v(" 下的几个目录中（优先级递减）：")]),t._v(" "),s("div",{staticClass:"language- extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("classpath:/META-INF/resources/\nclasspath:/resources/\nclasspath:/static/\nclasspath:/public/\n")])])]),s("p",[t._v("☕"),s("strong",[t._v("为什么会这样？")])]),t._v(" "),s("p",[t._v("在 "),s("code",[t._v("WebMvcAutoConfiguration")]),t._v(" 中存在处理静态资源的代码")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210081802432.png",alt:"image-20221008180206597"}})]),t._v(" "),s("p",[t._v("进而可以查看到 "),s("code",[t._v("ResourceProperties")]),t._v(" 中声明了默认的资源路径")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210081803183.png",alt:"image-20221008180336815"}})]),t._v(" "),s("p",[t._v("上面代码的作用：")]),t._v(" "),s("ul",[s("li",[t._v("设定了默认的静态资源路径。"),s("code",[t._v("classpath:/static/")]),t._v(" "),s("strong",[t._v("等路径")]),t._v("会被映射到生成项目的 "),s("code",[t._v("/**")]),t._v("，"),s("strong",[t._v("这些路径的优先级递减")])]),t._v(" "),s("li",[t._v("同样也支持了 webjars，"),s("strong",[t._v("通过 jar 包的形式也能访问静态资源")]),t._v("，将 "),s("code",[t._v("classpath:/META-INF/resources/webjars/")]),t._v(" 映射到了生成项目的 "),s("code",[t._v("/webjars/**")])])]),t._v(" "),s("blockquote",[s("p",[s("strong",[t._v("举例一")])]),t._v(" "),s("p",[t._v("经过此 SpringBoot 默认配置，在浏览器中可以通过")]),t._v(" "),s("p",[s("code",[t._v("http://localhost:8080/assets/img/404.png")])]),t._v(" "),s("p",[s("code",[t._v("http://localhost:8080/webjars/404.png")])]),t._v(" "),s("p",[s("code",[t._v("http://localhost:8080/404.png")])]),t._v(" "),s("p",[t._v("这三个地址来访问到下图结构中的图片")])]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202210081816865.png",alt:"image-20221008181620387"}})]),t._v(" "),s("blockquote",[s("p",[s("strong",[t._v("举例二")])]),t._v(" "),s("p",[t._v("发布的项目如果需要在页面中引入 jquery 等静态资源库，因为 SpringBoot 的默认配置，就能直接通过引入依赖的方式以 jar 包的形式访问静态资源")]),t._v(" "),s("p",[t._v("项目中依赖库的路径就是 "),s("code",[t._v("classpath")]),t._v("，每个库文件 jar 包下的 "),s("code",[t._v("META-INF/resources/webjars/")]),t._v(" 就映射到了 网页路径 "),s("code",[t._v("/webjars/**")])]),t._v(" "),s("p",[t._v("于是在页面中就可以引用 "),s("code",[t._v("/webjars/jquery/3.5.1/jquery.js")])])]),t._v(" "),s("p",[t._v("✅"),s("strong",[t._v("自定义静态资源路径")])]),t._v(" "),s("p",[t._v("🟠配置之后，默认的自动配置就会失效。")]),t._v(" "),s("div",{staticClass:"language-yaml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yaml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("spring")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("resources")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 项目中静态路径的路径")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("static-locations")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" classpath"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("static/\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("mvc")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 访问网页中的路径形式")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("static-path-pattern")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" /s/* or /"),s("span",{pre:!0,attrs:{class:"token important"}},[t._v("**")]),t._v("\n")])])]),s("p",[t._v("😥也可以用配置类实现 "),s("code",[t._v("WebMvcConfigurationSupport")]),t._v(" ，重写 "),s("code",[t._v("addResourceHandlers")]),t._v(" 方法来进行手动配置，可以参考 "),s("code",[t._v("WebMvcAutoConfiguration")]),t._v(" 里重写的写法。")]),t._v(" "),s("p",[t._v("这样的好处是能处理路径字符串、并且"),s("strong",[t._v("能有多组映射")]),t._v("（一个Handler 对应一个 Locations）")]),t._v(" "),s("div",{staticClass:"language-java extra-class"},[s("pre",{pre:!0,attrs:{class:"language-java"}},[s("code",[s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Configuration")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("public")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("WebConfig")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("extends")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("WebMvcConfigurationSupport")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("IMG_PATH")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"E:\\\\Pictures\\\\Star\\\\anime\\\\"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("static")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("final")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("String")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("IMG_PATH_TWO")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"E:\\\\Pictures\\\\Star\\\\截图3\\\\"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 静态资源映射")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[t._v("@Override")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("protected")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("void")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("addResourceHandlers")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("ResourceHandlerRegistry")]),t._v(" registry"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        registry"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("addResourceHandler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/pic/**"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("addResourceLocations")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"file:"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("IMG_PATH")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        registry"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("addResourceHandler")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/pic/**"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("addResourceLocations")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"file:"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("+")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("IMG_PATH_TWO")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n")])])]),s("blockquote",[s("p",[t._v("关于 WebMvcConfigurationSupport")]),t._v(" "),s("p",[t._v("This is the main class providing the configuration behind the MVC Java config. It is typically imported by adding @EnableWebMvc to an application @Configuration class.")]),t._v(" "),s("p",[t._v("此类是提供 MVC 配置的主类，将 @EnableWebMvc 注释加到 @Configuration 配置类上就能自动配置 WebMVC。")]),t._v(" "),s("p",[t._v("An alternative more advanced option is to extend directly from this class and override methods as necessary, remembering to add @Configuration to the subclass and @Bean to overridden @Bean methods.")]),t._v(" "),s("p",[t._v("另一种更高级的方法是用 @Configuration 配置类继承此类并重写相应的配置方法，@Bean 方法的重写也需要加上 @Bean 注解。")]),t._v(" "),s("p",[t._v("For more details see the javadoc of @EnableWebMvc.")])]),t._v(" "),s("p",[s("strong",[t._v("举例：访问本地磁盘目录中的文件")])]),t._v(" "),s("div",{staticClass:"language-yaml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yaml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("spring")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("resources")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("static-locations")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" file"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("E"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\\\\Pictures\\\\Star\\\\anime\\\\\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 也能写成列表的形式")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# - file:E:\\\\Pictures\\\\Star\\\\anime\\\\")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# - file:E:\\\\Pictures\\\\Star\\\\截图3\\\\")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("mvc")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("static-path-pattern")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" /pic/"),s("span",{pre:!0,attrs:{class:"token important"}},[t._v("**")]),t._v("\n")])])]),s("p",[t._v("访问 "),s("code",[t._v("http://localhost:8080/pic/xxx.jpg")]),t._v(" 就可以映射到本地目录的 "),s("code",[t._v(".../anime/xxx.jpg")])]),t._v(" "),s("p",[t._v("注意：")]),t._v(" "),s("ol",[s("li",[t._v("此配置会覆盖默认的配置，"),s("code",[t._v("classpath:/static/")]),t._v(" 中的文件就访问不到了。")]),t._v(" "),s("li",[s("code",[t._v("staic-locations")]),t._v(" 不区分大小写，如果是 windows 的文件目录需要使用双反斜杠。")]),t._v(" "),s("li",[s("code",[t._v("static-path-pattern")]),t._v(" 区分大小写，并且 "),s("code",[t._v("/*")]),t._v(" 只能访问目录下文件，"),s("code",[t._v("/**")]),t._v(" 可以访问子目录中的文件。")])]),t._v(" "),s("p",[s("strong",[t._v("参考")]),t._v("：")]),t._v(" "),s("ul",[s("li",[s("a",{attrs:{href:"https://www.cnblogs.com/moluu/articles/14187059.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("【SpringBoot学习（三）静态资源过滤 & 首页跳转】 - moluu - 博客园 (cnblogs.com)"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://blog.csdn.net/m0_46552679/article/details/115188324",target:"_blank",rel:"noopener noreferrer"}},[t._v("Spring boot静态资源过滤_每天向前一步的博客-CSDN博客_springboot过滤静态资源"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://juejin.cn/post/7022823623844954142",target:"_blank",rel:"noopener noreferrer"}},[t._v("Springboot多种方法处理静态资源：设置并访问静态资源目录 - 掘金 (juejin.cn)"),s("OutboundLink")],1)])]),t._v(" "),s("p",[t._v("==TODO：SpringBoot 自动配置原理==")]),t._v(" "),s("h2",{attrs:{id:"classpath"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#classpath"}},[t._v("#")]),t._v(" ClassPath")]),t._v(" "),s("blockquote",[s("p",[t._v("classpath一般用来指代“src/main/resources”下的资源路径，此目录类的文件会打包到 "),s("code",[t._v("/target/classes")]),t._v(" 目录下的路径。")])]),t._v(" "),s("ul",[s("li",[t._v("配置文件中会用到")]),t._v(" "),s("li",[t._v("WebMvcConfigurer配置类也会用到")])])])}),[],!1,null,null,null);s.default=e.exports}}]);