const envPublicUrl = process.env.PUBLIC_URL;

import path from "path";
import fs from "fs";
import url from "url";

// 确保已解析项目文件夹中的所有符号链接：
export const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

function ensureSlash(inputPath: string, needsSlash: boolean) {
  const hasSlash = inputPath.endsWith("/");
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = (appPackageJson: string): string =>
  envPublicUrl || require(appPackageJson).homepage;

// 我们使用`public_url`环境变量或"homepage"字段来推断服务应用程序的"public path"。
// webpack需要知道将正确的<script> hrefs放入HTML中，即使在单页应用程序中，这些应用程序可能为/todos/42等嵌套URL提供index.html。
// 我们不能在HTML中使用相对路径，因为我们不想加载类似/todos/42/static/js/bundle.7289d.js的内容。我们必须知道根目录。

function getServedPath(appPackageJson: string) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl ||
    (publicUrl ? (url.parse(publicUrl).pathname as string) : "/");
  return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx"
];


// 按与WebPack相同的顺序解析文件路径
const resolveModule = (
  resolveFn: (relativePath: string) => string,
  filePath: string
) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

// 弹出后配置：我们进入了 ./config/
export default {
    dotenv: resolveApp('.env'),
    appPath: resolveApp('.'),
    appBuild: resolveApp('build'),
    appPublic: resolveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveModule(resolveApp, 'src/index'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    appTsConfig: resolveApp('tsconfig.json'),
    yarnLockFile: resolveApp('yarn.lock'),
    testsSetup: resolveModule(resolveApp, 'src/setupTests'),
    proxySetup: resolveApp('src/setupProxy.js'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: getServedPath(resolveApp('package.json')),
    moduleFileExtensions
  };