import ProjectPath from "./path";
import webpack from "webpack";
const es3ifyPlugin = require("es3ify-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
import InlineChunkHtmlPlugin from "react-dev-utils/InlineChunkHtmlPlugin";

const config: webpack.Configuration = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: ProjectPath.appIndexJs,
  output: {
    path: ProjectPath.appBuild,
    filename: "index.[hash].js",
    publicPath: "/",
    chunkFilename: "js/[name].[hash].js"
  },
  resolve: {
    extensions: [".js", ".json", ".jsx" , ".ts" , ".tsx"],
    alias: {
      react: "anujs/dist/ReactIE.js",
      "react-dom": "anujs/dist/ReactIE.js",
      "prop-types": "anujs/lib/ReactPropTypes",
      devtools: "anujs/lib/devtools",
      "create-react-class": "anujs/lib/createClass"
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              "compilerOptions": {
                /* Basic Options */
                "target": "es3",
              }
            }
          }
        ]
      },
      {
        test: /\.(js|mjs|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["last 2 versions", "ie >= 7"]
                  },
                  modules: "commonjs"
                  // useBuiltIns: true,
                  // debug: false
                }
              ],
              "@babel/preset-react"
            ]
            // plugins: ["transform-runtime"]
          }
        },
        include: [ProjectPath.appSrc]
      },
      {
        test: /\.(js|mjs|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["last 2 versions", "ie >= 7"]
                  },
                  modules: "commonjs"
                  // useBuiltIns: true,
                  // debug: false
                }
              ],
              "@babel/preset-react"
            ]
            // plugins: ["transform-runtime"]
          }
        },
        include: [ProjectPath.appSrc]
      },
      {
        test: /\.css$/,
        include: [ProjectPath.appSrc],
        use: ["style-loader", "css-loadeer"]
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 100,
              name: "asset/[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new es3ifyPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: ProjectPath.appHtml,
      inject: "body",
      hase: false,
      minify: {
        // 压缩HTML文件
        removeComments: false, // 移除HTML中的注释
        collapseWhitespace: false // 删除空白符与换行符
      }
    })
  ]
};

export default config;
