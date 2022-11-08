(window.webpackJsonp=window.webpackJsonp||[]).push([[30],{301:function(t,s,e){"use strict";e.r(s);var a=e(13),r=Object(a.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"hello-vuepress"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#hello-vuepress"}},[t._v("#")]),t._v(" Hello VuePress")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202209281646816.jpg",alt:"blog-image-20220928-1664354739"}})]),t._v(" "),s("h2",{attrs:{id:"搭建时候一些注意点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#搭建时候一些注意点"}},[t._v("#")]),t._v(" 搭建时候一些注意点")]),t._v(" "),s("ol",[s("li",[s("p",[t._v("先看 "),s("a",{attrs:{href:"https://vuepress.vuejs.org/zh/guide/getting-started.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("文档"),s("OutboundLink")],1),t._v("，"),s("strong",[t._v("要跟着文章来搭建")]),t._v("。")]),t._v(" "),s("p",[t._v("这次使用 yarn，需要先用 "),s("code",[t._v("npm i -g yarn")]),t._v(" 安装一下。")])]),t._v(" "),s("li",[s("p",[t._v("要在 "),s("code",[t._v("package.json")]),t._v(" 中添加 scripts:")]),t._v(" "),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"scripts"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"docs:dev"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"set NODE_OPTIONS=--openssl-legacy-provider && vuepress dev docs"')]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token property"}},[t._v('"docs:build"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"set NODE_OPTIONS=--openssl-legacy-provider && vuepress build docs"')]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("前面的命令是设置 node 环境，解决报错 "),s("code",[t._v("Error: error:0308010C:digital envelope routines::unsupported")])])]),t._v(" "),s("li",[s("p",[t._v("😥更新配置文件之后需要重新启动服务（在最开始配置功能的时候很繁琐）。")])])]),t._v(" "),s("h2",{attrs:{id:"特性"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#特性"}},[t._v("#")]),t._v(" 特性")]),t._v(" "),s("p",[t._v("我使用 vuepress 来存放一些零散的笔记，就是因为它的两个特性：")]),t._v(" "),s("ol",[s("li",[s("strong",[t._v("导航栏")]),t._v("直观可见、便于分类。")]),t._v(" "),s("li",[s("strong",[t._v("侧边栏")]),t._v("可以显示当前分类下的所有文章的标题链接（可以设置标题深度）。")])]),t._v(" "),s("p",[t._v("其他的“本应就有”的特性：")]),t._v(" "),s("ul",[s("li",[t._v("Markdown 内容是热重载的。（配置文件当然不行）")]),t._v(" "),s("li",[t._v("单页面应用")]),t._v(" "),s("li",[t._v("......")])]),t._v(" "),s("h2",{attrs:{id:"开启功能"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#开启功能"}},[t._v("#")]),t._v(" 开启功能")]),t._v(" "),s("p",[t._v("最后会放上最终的配置文件，所以只提及涉及到的属性，"),s("a",{attrs:{href:"https://vuepress.vuejs.org/zh/theme/default-theme-config.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("官方文档"),s("OutboundLink")],1),t._v(" 上也有。")]),t._v(" "),s("p",[t._v("使用的是"),s("strong",[t._v("默认主题")]),t._v("。")]),t._v(" "),s("h3",{attrs:{id:"设置导航栏"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#设置导航栏"}},[t._v("#")]),t._v(" 设置导航栏")]),t._v(" "),s("p",[s("code",[t._v("themeConfig.nav")]),t._v(" 数组，设置各个标题栏的文本和链接。")]),t._v(" "),s("p",[t._v("✅推荐借助下面的 "),s("a",{attrs:{href:"https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar/features/plugin-options.html#nav",target:"_blank",rel:"noopener noreferrer"}},[t._v("vuepress-plugin-auto-sidebar"),s("OutboundLink")],1),t._v(" 插件来自动生成导航栏，\n然后通过解构内嵌到此数组中（详见页面最后配置文件）。")]),t._v(" "),s("h3",{attrs:{id:"设置侧边栏"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#设置侧边栏"}},[t._v("#")]),t._v(" 设置侧边栏")]),t._v(" "),s("p",[t._v("最简单是只显示当前文章的标题链接，设置 "),s("code",[t._v("themeConfig.sidebar")]),t._v(" 为 "),s("code",[t._v("auto")])]),t._v(" "),s("p",[t._v("但是我想要的效果就是显示"),s("strong",[t._v("当前分类下")]),t._v("所有文章的标题链接，就像 VuePress 的 "),s("a",{attrs:{href:"https://vuepress.vuejs.org/zh/guide/",target:"_blank",rel:"noopener noreferrer"}},[t._v("官方文档"),s("OutboundLink")],1),t._v(" 一样,\n能很快的切换文章。")]),t._v(" "),s("p",[t._v("手动写侧边栏的配置很麻烦（所以不写例子了），所以我使用了 "),s("a",{attrs:{href:"https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar/",target:"_blank",rel:"noopener noreferrer"}},[t._v("vuepress-plugin-auto-sidebar"),s("OutboundLink")],1),t._v(" 插件来实现自动侧边栏配置。")]),t._v(" "),s("p",[t._v("跟着插件的文档来配置就可以。")]),t._v(" "),s("p",[t._v("注意：")]),t._v(" "),s("ol",[s("li",[s("p",[t._v("如果使用此插件，默认会显示每个 Markdown 文件的 "),s("code",[t._v("h1")]),t._v(" 标题作为侧边栏中的文章标题，所以每个文章最好都要有 "),s("code",[t._v("h1")]),t._v(" 标题。")])]),t._v(" "),s("li",[s("p",[t._v("使用了这个插件之后，自动生成的侧边栏的"),s("strong",[t._v("标题深度属性")]),t._v("归属于此插件的配置。")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("module"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("plugins")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v('"vuepress-plugin-auto-sidebar"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("sidebarDepth")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// default 1")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])]),t._v(" "),s("li",[s("p",[t._v("如果需要额外特性，查看 "),s("a",{attrs:{href:"https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar/features/plugin-options.html#overview",target:"_blank",rel:"noopener noreferrer"}},[t._v("此插件文档"),s("OutboundLink")],1),t._v("。")])])]),t._v(" "),s("h3",{attrs:{id:"设置项目-git"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#设置项目-git"}},[t._v("#")]),t._v(" 设置项目 git")]),t._v(" "),s("p",[t._v("开启 git 功能既可以便于文章管理也可以通过配置 "),s("code",[t._v("themeConfig.lastUpdated")]),t._v(" 使用"),s("strong",[t._v("显示最后更新时间")]),t._v("的功能。")]),t._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" init\n")])])]),s("p",[t._v("记得要添加 "),s("code",[t._v(".gitignore")]),t._v(" 忽略 node 包文件")]),t._v(" "),s("div",{staticClass:"language-.gitignore extra-class"},[s("pre",{pre:!0,attrs:{class:"language-text"}},[s("code",[t._v("node_modules\n")])])]),s("h2",{attrs:{id:"部署"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#部署"}},[t._v("#")]),t._v(" 部署")]),t._v(" "),s("h3",{attrs:{id:"github-pages-手动构建"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#github-pages-手动构建"}},[t._v("#")]),t._v(" GitHub Pages + 手动构建")]),t._v(" "),s("p",[t._v("通过编写一个自动化脚本，在本地自动构建后推送到远程仓库并由 GitHub Pages 托管。")]),t._v(" "),s("p",[t._v("✅ 很简单，就像我之前用过的 "),s("code",[t._v("hexo")]),t._v(" 一样，也是只推送构建好的静态文件。")]),t._v(" "),s("h3",{attrs:{id:"github-pages-github-actions"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#github-pages-github-actions"}},[t._v("#")]),t._v(" GitHub Pages + GitHub Actions")]),t._v(" "),s("ol",[s("li",[t._v("创建一个 GitHub Actions，具体内容见下。")]),t._v(" "),s("li",[t._v("将文章修改推送到远程仓库 "),s("code",[t._v("main")]),t._v(" 分支时，GitHub Actions 会自动构建新的静态页面然后推送到 "),s("code",[t._v("gh-pages")]),t._v(" 分支。")]),t._v(" "),s("li",[t._v("设置 GitHub Pages 托管 "),s("code",[t._v("gh-pages")])])]),t._v(" "),s("p",[s("code",[t._v("vuepress-deploy.yml")])]),t._v(" "),s("div",{staticClass:"language-yaml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-yaml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" Build and Deploy\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("on")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("push"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("jobs")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("build-and-deploy")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("runs-on")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" ubuntu"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("latest\n    "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("steps")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" Checkout\n      "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("uses")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" actions/checkout@master\n\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" vuepress"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("deploy\n      "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("uses")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" jenkey2011/vuepress"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("deploy@master\n      "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("env")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("ACCESS_TOKEN")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" $"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("  secrets.ACCESS_TOKEN  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("BUILD_SCRIPT")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" yarn "),s("span",{pre:!0,attrs:{class:"token important"}},[t._v("&&")]),t._v(" yarn docs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("build\n        "),s("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("BUILD_DIR")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" docs/.vuepress/dist\n\n")])])]),s("p",[t._v("使用 "),s("code",[t._v("secrets.ACCESS_TOKEN")]),t._v(" 之前需要做的步骤：")]),t._v(" "),s("ol",[s("li",[t._v("获取 "),s("em",[t._v("Personal access token")])]),t._v(" "),s("li",[t._v("在该仓库设置页面的 "),s("em",[t._v("Secrets")]),t._v(" 选项，创建一个 "),s("code",[t._v("ACCESS_TOKEN")]),t._v(" 值，这样 Actions 就可以获取到。")])]),t._v(" "),s("h2",{attrs:{id:"参考"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#参考"}},[t._v("#")]),t._v(" 参考")]),t._v(" "),s("ul",[s("li",[s("a",{attrs:{href:"https://vuepress.vuejs.org/zh/guide/",target:"_blank",rel:"noopener noreferrer"}},[t._v("介绍 | VuePress (vuejs.org)"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://www.bilibili.com/video/BV1vb411m7NY/",target:"_blank",rel:"noopener noreferrer"}},[t._v("【啰里啰嗦】一步步搭建 VuePress 及优化_哔哩哔哩_bilibili"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://vuepress.vuejs.org/zh/guide/deploy.html#github-pages",target:"_blank",rel:"noopener noreferrer"}},[t._v("部署 | VuePress (vuejs.org)"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://github.com/jenkey2011/vuepress-deploy/",target:"_blank",rel:"noopener noreferrer"}},[t._v("jenkey2011/vuepress-deploy: A GitHub Action to build and deploy Vuepress sites to GitHub Pages"),s("OutboundLink")],1)])])])}),[],!1,null,null,null);s.default=r.exports}}]);