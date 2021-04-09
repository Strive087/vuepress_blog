// 配置文件的入口文件
module.exports = {
  title: "前端之路",
  description: "Just playing around",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      { name: "viewport", content: "width=device-width,initial-scale=1" }
    ],
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-152x152.png' }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  themeConfig: {
    // !禁用导航栏
    // navbar: false,
    //导航栏logo
    // logo: "/assets/img/road.png",
    //导航栏链接
    nav: [],
    // //------------------------------------
    //侧边栏
    sidebar: {
      "/nav.01.js/youknowjs/": {
        title: "深入理解js"
      }
    },
    //侧边栏自动生成
    // sidebar: "auto",
    //显示所有页面的标题链接
    // displayAllHeaders: true,
    // //------------------------------------
    //!禁用搜索
    // search: false,
    //搜索显示的结果数量
    searchMaxSuggestions: 10,
    // //------------------------------------
    //基于git提交时间显示最后更新时间
    // lastUpdated: 'Last Updated',
    // //------------------------------------
    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    // nextLinks: false,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    // prevLinks: false
    // //------------------------------------
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    // repo: "https://github.com/Strive087/vuepress_blog",
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    // repoLabel: "GitHub",

    // 以下为可选的编辑链接选项

    // 假如你的文档仓库和项目本身不在一个仓库：
    // docsRepo: "vuejs/vuepress",
    // 假如文档不是放在仓库的根目录下：
    docsDir: "docs",
    // 假如文档放在一个特定的分支下：
    docsBranch: "master",
    // 默认是 false, 设置为 true 来启用
    editLinks: false,
    // 默认为 "Edit this page"
    // editLinkText: '帮助我们改善此页面！',
    // //------------------------------------
    //添加页面滚动效果
    smoothScroll: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        // '@alias': 'path/to/some/dir'
      }
    }
  },
  plugins: [
    "permalink-pinyin",
    ["autobar", { pinyinNav: true }],
    "@vuepress/back-to-top",
    "@vuepress/medium-zoom",
    "rpurl",
    "@vuepress/pwa",
    {
      serviceWorker: true,
      updatePopup: false
    }
  ]
};
