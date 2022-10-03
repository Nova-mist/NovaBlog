# Hello VuePress

![blog-image-20220928-1664354739](https://cdn.jsdelivr.net/gh/Nova-mist/HexoBlogResources/images/2022/202209281646816.jpg)

## 搭建时候一些注意点

1. 先看 [文档](https://vuepress.vuejs.org/zh/guide/getting-started.html)，**要跟着文章来搭建**。

    这次使用 yarn，需要先用 `npm i -g yarn` 安装一下。
2. 要在 `package.json` 中添加 scripts:

    ```json
    "scripts": {
    "docs:dev": "set NODE_OPTIONS=--openssl-legacy-provider && vuepress dev docs",
    "docs:build": "set NODE_OPTIONS=--openssl-legacy-provider && vuepress build docs"
    }
    ```

    前面的命令是设置 node 环境，解决报错 `Error: error:0308010C:digital envelope routines::unsupported`
3. 😥更新配置文件之后需要重新启动服务（在最开始配置功能的时候很繁琐）。

## 特性

我使用 vuepress 来存放一些零散的笔记，就是因为它的两个特性：

1. **导航栏**直观可见、便于分类。
2. **侧边栏**可以显示当前分类下的所有文章的标题链接（可以设置标题深度）。

其他的“本应就有”的特性：

- Markdown 内容是热重载的。（配置文件当然不行）
- 单页面应用
- ......

## 开启功能

最后会放上最终的配置文件，所以只提及涉及到的属性，[官方文档](https://vuepress.vuejs.org/zh/theme/default-theme-config.html) 上也有。

使用的是**默认主题**。

### 设置导航栏

`themeConfig.nav` 数组，设置各个标题栏的文本和链接。

✅推荐借助下面的 [vuepress-plugin-auto-sidebar](https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar/features/plugin-options.html#nav) 插件来自动生成导航栏，
然后通过解构内嵌到此数组中（详见页面最后配置文件）。

### 设置侧边栏

最简单是只显示当前文章的标题链接，设置 `themeConfig.sidebar` 为 `auto`

但是我想要的效果就是显示**当前分类下**所有文章的标题链接，就像 VuePress 的 [官方文档](https://vuepress.vuejs.org/zh/guide/) 一样,
能很快的切换文章。

手动写侧边栏的配置很麻烦（所以不写例子了），所以我使用了 [vuepress-plugin-auto-sidebar](https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar/) 插件来实现自动侧边栏配置。

跟着插件的文档来配置就可以。

注意：

1. 如果使用此插件，默认会显示每个 Markdown 文件的 `h1` 标题作为侧边栏中的文章标题，所以每个文章最好都要有 `h1` 标题。
2. 使用了这个插件之后，自动生成的侧边栏的**标题深度属性**归属于此插件的配置。

    ```js
    module.exports = {
        plugins: [
            "vuepress-plugin-auto-sidebar": {
            sidebarDepth: 4, // default 1
            }
        ]
    }
    ```

3. 如果需要额外特性，查看 [此插件文档](https://shanyuhai123.github.io/vuepress-plugin-auto-sidebar/features/plugin-options.html#overview)。

### 设置项目 git

开启 git 功能既可以便于文章管理也可以通过配置 `themeConfig.lastUpdated` 使用**显示最后更新时间**的功能。

```bash
git init
```

记得要添加 `.gitignore` 忽略 node 包文件

```.gitignore
node_modules
```

## 部署

### GitHub Pages + 手动构建

通过编写一个自动化脚本，在本地自动构建后推送到远程仓库并由 GitHub Pages 托管。

✅ 很简单，就像我之前用过的 `hexo` 一样，也是只推送构建好的静态文件。

### GitHub Pages + GitHub Actions

1. 创建一个 GitHub Actions，具体内容见下。
2. 将文章修改推送到远程仓库 `main` 分支时，GitHub Actions 会自动构建新的静态页面然后推送到 `gh-pages` 分支。
3. 设置 GitHub Pages 托管 `gh-pages`

`vuepress-deploy.yml`

```yaml
name: Build and Deploy
on: [push]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@master

    - name: vuepress-deploy
      uses: jenkey2011/vuepress-deploy@master
      env:
        ACCESS_TOKEN: ${{  secrets.ACCESS_TOKEN  }}
        BUILD_SCRIPT: yarn && yarn docs:build
        BUILD_DIR: docs/.vuepress/dist

```

使用 `secrets.ACCESS_TOKEN` 之前需要做的步骤：

1. 获取 *Personal access token*
2. 在该仓库设置页面的 *Secrets* 选项，创建一个 `ACCESS_TOKEN` 值，这样 Actions 就可以获取到。

## 参考

- [介绍 | VuePress (vuejs.org)](https://vuepress.vuejs.org/zh/guide/)
- [【啰里啰嗦】一步步搭建 VuePress 及优化_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1vb411m7NY/)
- [部署 | VuePress (vuejs.org)](https://vuepress.vuejs.org/zh/guide/deploy.html#github-pages)
- [jenkey2011/vuepress-deploy: A GitHub Action to build and deploy Vuepress sites to GitHub Pages](https://github.com/jenkey2011/vuepress-deploy/)
