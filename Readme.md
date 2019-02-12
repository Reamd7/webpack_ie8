基于 anujs-webpack4-ie7-8 demo进行改造，结合最新CRA的config进行改造
- [x] typescript 的 webpack config 处理
- [x] 文件目录的改造，适应CRA的文件目录
- [ ] config中 Style的整合。
- [x] ts-loader的引入 / babel-loader 对 typescript 的处理
- [ ] 各种plugin的支持
  - [x] babel
  - [ ] typescript
  - [x] browserlist
  - [ ] eslint / eslintignore
  - [ ] tslint / tslintignore
  - [ ] jest
  - [ ] editorconfig
  - [ ] Prettier / ~ignore
  - [ ] stylelint / ~ignore 
  - [ ] postcss / scss / less 
  * [ ] CI 集成 工作流
  * [ ] npm 模块
  * [ ] 

  step:
  - [x] 1. 安装 webpack 
  - [x] 2. 引入typescript 
  - [x] 3. 初始化 webpack 配置结构
  - [x] 引入了 html-webpack-plugin es3ify-webpack-plugin 
  - [x] babel-loader babel-preset-react-app @babel/core browserlistrc
  - [x] 4. 引入 typescript 
    - [ ] 最新版webpack的runtime使用了Object.defineProperty 需要重写
  - [ ]  模仿 anujs-webpack4-ie7-8 测试。