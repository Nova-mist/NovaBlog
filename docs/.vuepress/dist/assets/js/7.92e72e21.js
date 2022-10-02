(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{280:function(t,e,s){"use strict";s.r(e);var r=s(13),a=Object(r.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"hello-vuepress"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#hello-vuepress"}},[t._v("#")]),t._v(" Hello VuePress")]),t._v(" "),e("p",[e("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202209281646816.jpg",alt:"blog-image-20220928-1664354739"}})]),t._v(" "),e("h2",{attrs:{id:"搭建时候一些注意点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#搭建时候一些注意点"}},[t._v("#")]),t._v(" 搭建时候一些注意点")]),t._v(" "),e("ol",[e("li",[e("p",[t._v("先看 "),e("a",{attrs:{href:"https://vuepress.vuejs.org/zh/guide/getting-started.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("文档"),e("OutboundLink")],1),t._v("，"),e("strong",[t._v("要跟着文章来搭建")]),t._v("。")]),t._v(" "),e("p",[t._v("这次使用 yarn，需要先用 "),e("code",[t._v("npm i -g yarn")]),t._v(" 安装一下。")])]),t._v(" "),e("li",[e("p",[t._v("要在 "),e("code",[t._v("package.json")]),t._v(" 中添加 scripts:")]),t._v(" "),e("div",{staticClass:"language-json extra-class"},[e("pre",{pre:!0,attrs:{class:"language-json"}},[e("code",[e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"scripts"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"docs:dev"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"set NODE_OPTIONS=--openssl-legacy-provider && vuepress dev docs"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token property"}},[t._v('"docs:build"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token string"}},[t._v('"set NODE_OPTIONS=--openssl-legacy-provider && vuepress build docs"')]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("p",[t._v("前面的命令是设置 node 环境，解决报错 "),e("code",[t._v("Error: error:0308010C:digital envelope routines::unsupported")])])]),t._v(" "),e("li",[e("p",[t._v("😥更新配置文件之后需要重新启动服务（在最开始配置功能的时候很繁琐）。")])])]),t._v(" "),e("h2",{attrs:{id:"特性"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#特性"}},[t._v("#")]),t._v(" 特性")]),t._v(" "),e("p",[t._v("我使用 vuepress 来存放一些零散的笔记，就是因为它的两个特性：")]),t._v(" "),e("ol",[e("li",[e("strong",[t._v("导航栏")]),t._v("直观可见、便于分类。")]),t._v(" "),e("li",[e("strong",[t._v("侧边栏")]),t._v("可以显示当前分类下的所有文章的标题链接（可以设置标题深度）。")])]),t._v(" "),e("p",[t._v("其他的“本应就有”的特性：")]),t._v(" "),e("ul",[e("li",[t._v("Markdown 内容是热重载的。（配置文件当然不行）")]),t._v(" "),e("li",[t._v("单页面应用")]),t._v(" "),e("li",[t._v("......")])]),t._v(" "),e("h2",{attrs:{id:"开启功能"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#开启功能"}},[t._v("#")]),t._v(" 开启功能")]),t._v(" "),e("p",[t._v("最后会放上最终的配置文件，所以只提及涉及到的属性，"),e("a",{attrs:{href:"https://vuepress.vuejs.org/zh/theme/default-theme-config.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("官方文档"),e("OutboundLink")],1),t._v(" 上也有。")]),t._v(" "),e("p",[t._v("使用的是"),e("strong",[t._v("默认主题")]),t._v("。")]),t._v(" "),e("h3",{attrs:{id:"设置导航栏"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#设置导航栏"}},[t._v("#")]),t._v(" 设置导航栏")]),t._v(" "),e("p",[e("code",[t._v("themeConfig.nav")]),t._v(" 数组，设置各个标题栏的文本和链接。")]),t._v(" "),e("p",[t._v("✅推荐借助下面的 "),e("a",{attrs:{href:"https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar/features/plugin-options.html#nav",target:"_blank",rel:"noopener noreferrer"}},[t._v("vuepress-plugin-auto-sidebar"),e("OutboundLink")],1),t._v(" 插件来自动生成导航栏，\n然后通过解构内嵌到此数组中（详见页面最后配置文件）。")]),t._v(" "),e("h3",{attrs:{id:"设置侧边栏"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#设置侧边栏"}},[t._v("#")]),t._v(" 设置侧边栏")]),t._v(" "),e("p",[t._v("最简单是只显示当前文章的标题链接，设置 "),e("code",[t._v("themeConfig.sidebar")]),t._v(" 为 "),e("code",[t._v("auto")])]),t._v(" "),e("p",[t._v("但是我想要的效果就是显示"),e("strong",[t._v("当前分类下")]),t._v("所有文章的标题链接，就像 VuePress 的 "),e("a",{attrs:{href:"https://vuepress.vuejs.org/zh/guide/",target:"_blank",rel:"noopener noreferrer"}},[t._v("官方文档"),e("OutboundLink")],1),t._v(" 一样,\n能很快的切换文章。")]),t._v(" "),e("p",[t._v("手动写侧边栏的配置很麻烦（所以不写例子了），所以我使用了 "),e("a",{attrs:{href:"https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar/",target:"_blank",rel:"noopener noreferrer"}},[t._v("vuepress-plugin-auto-sidebar"),e("OutboundLink")],1),t._v(" 插件来实现自动侧边栏配置。")]),t._v(" "),e("p",[t._v("跟着插件的文档来配置就可以。")]),t._v(" "),e("p",[t._v("注意：")]),t._v(" "),e("ol",[e("li",[e("p",[t._v("如果使用此插件，默认会显示每个 Markdown 文件的 "),e("code",[t._v("h1")]),t._v(" 标题作为侧边栏中的文章标题，所以每个文章最好都要有 "),e("code",[t._v("h1")]),t._v(" 标题。")])]),t._v(" "),e("li",[e("p",[t._v("使用了这个插件之后，自动生成的侧边栏的"),e("strong",[t._v("标题深度属性")]),t._v("归属于此插件的配置。")]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[t._v("module"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("plugins")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"vuepress-plugin-auto-sidebar"')]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("sidebarDepth")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// default 1")]),t._v("\n        "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])]),t._v(" "),e("li",[e("p",[t._v("如果需要额外特性，查看 "),e("a",{attrs:{href:"https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar/features/plugin-options.html#overview",target:"_blank",rel:"noopener noreferrer"}},[t._v("此插件文档"),e("OutboundLink")],1),t._v("。")])])]),t._v(" "),e("h3",{attrs:{id:"设置项目-git"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#设置项目-git"}},[t._v("#")]),t._v(" 设置项目 git")]),t._v(" "),e("p",[t._v("开启 git 功能既可以便于文章管理也可以通过配置 "),e("code",[t._v("themeConfig.lastUpdated")]),t._v(" 使用"),e("strong",[t._v("显示最后更新时间")]),t._v("的功能。")]),t._v(" "),e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" init\n")])])]),e("p",[t._v("记得要添加 "),e("code",[t._v(".gitignore")]),t._v(" 忽略 node 包文件")]),t._v(" "),e("div",{staticClass:"language-.gitignore extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("node_modules\n")])])]),e("h2",{attrs:{id:"参考"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#参考"}},[t._v("#")]),t._v(" 参考")]),t._v(" "),e("ul",[e("li",[e("a",{attrs:{href:"https://vuepress.vuejs.org/zh/guide/",target:"_blank",rel:"noopener noreferrer"}},[t._v("介绍 | VuePress (vuejs.org)"),e("OutboundLink")],1)]),t._v(" "),e("li",[e("a",{attrs:{href:"https://www.bilibili.com/video/BV1vb411m7NY/",target:"_blank",rel:"noopener noreferrer"}},[t._v("【啰里啰嗦】一步步搭建 VuePress 及优化_哔哩哔哩_bilibili"),e("OutboundLink")],1)])])])}),[],!1,null,null,null);e.default=a.exports}}]);