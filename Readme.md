## Note polyfill 策略: 

~~IE8 单独使用代码打包polyfill . 参考 anu-ie8-example , 我也不知道为什么下者不行..~~ 

~~IE9+ 就可以使用最轻量的动态polyfill . (基于 polyfill-service )~~

polyfill service 所支持的polyfill library 的代码貌似有很多的bug , 然后不知道为什么用不了, 所以我希望架构改编为 :

全部使用 core-js 的 polyfill ( 有些需要用 anu-ie8-example demo中使用的代码 ) , 然后使用代码动态计算出不同浏览器平台所需要的polyfill , 然后进行动态打包 

前端加载 polyfill 可以使用动态加载 + 前端缓存处理 , 也可以使用 polyfill service 进行加载 . 

## 基于 anu-ie8-example demo进行改造，结合最新CRA的config进行改造
- [x] typescript 的 webpack config 处理
- [x] 文件目录的改造，适应CRA的文件目录
- [ ] config中 Style的整合。
- [x] ts-loader的引入 / babel-loader 对 typescript 的处理
- [ ] 各种plugin的支持
  - [x] babel
  - [x] typescript
  - [x] browserlist
  - [ ] eslint / eslintignore
  - [ ] tslint / tslintignore
  - [ ] jest
  - [ ] editorconfig
  - [ ] Prettier / ~ignore
  - [ ] stylelint / ~ignore 
  - [ ] postcss / scss / less 
  - [ ] CI 集成 工作流
  - [ ] npm 模块
  - [ ] 

  step:
  - [x] 1. 安装 webpack 
  - [x] 2. 引入typescript 
  - [x] 3. 初始化 webpack 配置结构
  - [x] 引入了 html-webpack-plugin es3ify-webpack-plugin 
  - [x] babel-loader babel-preset-react-app @babel/core browserlistrc
  - [x] 4. 引入 typescript 
  - [x] 5. ~~模仿 anujs-webpack4-ie7-8 测试。~~ 模仿 anu-ie8-example 的demo 代码
       == 基本可用 == 
  - [-] 6. react-with-hook ( 基本先做了一下 将无法进行类型编译的库都进行any操作 发现库本身还是有很多不合适的地方  所以还需要进行更新开发 )
  - [ ] 7. 模仿antd 的组件学习编写可用的组件
     - [ ] 首先整理 ie兼容的 polyfill 的处理 / 因为组件库是时候渐进兼容的方式进行处理的, 所以搞清楚所有兼容的代码都是有意义的.