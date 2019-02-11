import path from "./path";
import webpack from "webpack";

const config: webpack.Configuration = {
  mode: "development",
  entry: path.appIndexJs,
  output: {
    path: path.appBuild,
    filename: "index.bundle.js",
    publicPath: "/",
    chunkFilename: "js/[name].js"
  },
  resolve: {
    extensions: [".js", ".json", ".jsx"],
    alias: {
      react: "anujs/dist/ReactIE.js",
      "react-dom": "anujs/dist/ReactIE.js",
      "prop-types": "anujs/lib/ReactPropTypes",
      devtools: "anujs/lib/devtools",
      "create-react-class": "anujs/lib/createClass"
    }
  }
};

export default config;
