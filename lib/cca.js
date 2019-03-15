"use strict";

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const jsonload = require('../lib/jsonload');

// setup npm
exports.setupPackageJson = function (appName, results) {
  console.log(`package.json`);
  const rootDir = path.join(process.cwd(), `/${appName}`);
  // load the package.json
  const packageJson = jsonload(`${rootDir}/package.json`);
  // remove somethings
  delete packageJson.homepage;
  delete packageJson.bugs;
  // blank repo
  packageJson.repository.url = "";
  // setup vars
  packageJson.name = appName;
  packageJson.version = "0.0.1",
  packageJson.description = results.description;
  packageJson.author = `${results.author} <${results.email}> (${results.authorURL})`

  fs.writeFileSync(`${rootDir}/package.json`,
    JSON.stringify(packageJson, null, 2));
}

// run git clone
exports.clone = function (appName) {
  console.log(`@clysema/generic-controller → ${appName}`);
  const gitClone = cp.spawnSync(`git`, [`clone`, `--quiet`, `--depth`, `1`,
    `https://github.com/ingeniadevteam/generic-controller.git`, `${appName}`]);
  if (gitClone.status !== 0) {
    console.error("error", gitClone.stderr.toString());
    return;
  }
}

// create a config file
exports.createConfigDir = function (appName) {
  console.log(`new folder: ${appName}/config`);
  const rootDir = path.join(process.cwd(), `/${appName}`);
  const configDir = `${rootDir}/config`;
  if (fs.existsSync(configDir)) {
    console.log(`warn: ${appName}/config folder already exists`);
    return;
  }
  fs.mkdirSync(configDir);
}

// create a config file
exports.createConfigFile = function (appName, moduleName) {
  console.log(`new file: ${appName}/config/${moduleName}.json`);
  const rootDir = path.join(process.cwd(), `/${appName}`);
  const configDir = `${rootDir}/config`;
  const configFile = `${configDir}/${moduleName}.json`;

  fs.writeFile(configFile, JSON.stringify({}, null, 4), (err) => {
    if (err) console.error(`error: create ${moduleName}.json file failed`);
  });
}

// run npm install
exports.runNpmInstall = function (appName) {
  console.log(`npm install`);
  const rootDir = path.join(process.cwd(), `/${appName}`);

  const npm = cp.spawnSync(`npm`, [`--prefix`, `${rootDir}`, `install`]);
  if (npm.status !== 0) {
    console.error("error", npm.stderr.toString());
    return;
  }
}

// install npm package
exports.installNpmPackage = function (appName, moduleName) {
  const rootDir = path.join(process.cwd(), `/${appName}`);
  const npmpackage = `@clysema/${moduleName}`;

  console.log(`npm install ${npmpackage}`);

  const npm = cp.spawnSync(`npm`, [`--prefix`, `${rootDir}`, `install`,
    `--save`, `${npmpackage}`]);
  if (npm.status !== 0) {
    console.error("error", npm.stderr.toString());
    return;
  }
}

// reset repo
exports.resetRepo = function (appName) {
  const rootDir = path.join(process.cwd(), `/${appName}`);

  console.log(`reset repo`);
  const rm = cp.spawnSync(`rm`, [`-rf`, `${rootDir}/.git`]);
  if (rm.status !== 0) {
    console.error("error", rm.stderr.toString());
    return;
  }

  const gitInit = cp.spawnSync(`git`, [`init`, `--quiet`, `${rootDir}`]);
  if (gitInit.status !== 0) {
    console.error("error", gitInit.stderr.toString());
    return;
  }

  const gitAdd = cp.spawnSync(`git`, [`--git-dir=${rootDir}/.git`,
      `--work-tree=${rootDir}`, `add`, `-A`]);
  if (gitAdd.status !== 0) {
    console.error("error", gitAdd.stderr.toString());
    return;
  }

  const gitCommit = cp.spawnSync(`git`, [`--git-dir=${rootDir}/.git`,
      `--work-tree=${rootDir}`, `commit`, `-m`, `Initial commit`, `--quiet`]);
  if (gitCommit.status !== 0) {
    console.error("error", gitCommit.stderr.toString());
    return;
  }
}
