import path from "./path";
import webpack from "webpack";

const config: webpack.Configuration = {
    mode:"development",
    entry:path.appIndexJs,
    output:{
        path:path.appBuild,
        filename:"index.bundle.js"
    }
};

export default config;
