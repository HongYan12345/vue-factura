const fs = require('fs');
const path = require('path');

// 读取package.json文件
const packageJsonPath = path.resolve(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// 增加版本号
const versionParts = packageJson.version.split('.');
const patchVersion = parseInt(versionParts[2], 10);
versionParts[2] = (patchVersion + 1).toString();
packageJson.version = versionParts.join('.');

// 保存package.json文件
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
