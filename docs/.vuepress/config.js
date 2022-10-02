const navConfig = require("./nav.js");

module.exports = {
  base: "/NovaBlog/",
  title: "Nova Blog",
  description: "我那摊大饼一样的零散学习笔记",

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      ...navConfig,
      { text: "External", link: "https://google.com" },
    ],

    displayAllHeaders: true,
    sidebarDepth: 3,
    // sidebar: {
    //   "/mysql/": [
    //     {
    //       title: "Mysql",
    //       collapsable: true,
    //       children: [
    //         ["/", "目录"],
    //         ["mysql-note", "mysql-note"],
    //         ["mysql-实践", "mysql-实践"],
    //       ],
    //     },
    //   ],
    // },

    lastUpdated: "Last Updated",
  },

  plugins: {
    "vuepress-plugin-auto-sidebar": {
      sidebarDepth: 4,

      //   collapse: {
      //     open: true,
      //     collapseList: [],
      //     uncollapseList: [],
      //   },
    },
  },
};
