import * as path from "./path";
import webpack from "webpack";

const config: webpack.Configuration = {
    mode:"production",
    entry:`${path.SrcPath}/index.js`,
    output:{
        path:path.DistPath,
        filename:"index.bundle.js"
    }
};

export default config;
