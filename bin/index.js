#!/usr/bin/env node
const fs = require('fs');
const prompt = require('prompt');

const cca = require("../lib/cca");
const schema = require('../lib/schema');

if (process.argv.length < 3) {
  console.log("\nusage: create-controlle-app app_name [module1, module2, ...]\n");
  process.exit(1);
}

// get the app name
const appName = process.argv[2];
// get modules after first two elements in process.argv
const modules = process.argv.splice(3);

if (fs.existsSync(appName)) {
  console.log(`error: ${appName} already exists`);
  process.exit(1);
}

//
// Start the prompt
//
prompt.start();
prompt.get(schema, function (err, results) {
  // clone the @clysema/generic-controller repo
  cca.clone(appName);
  // setup package.json
  cca.setupPackageJson(appName, results);
  // create the config dir
  cca.createConfigDir(appName);
  // run npm install
  cca.runNpmInstall(appName);
  // install the modules
  for (let moduleName of modules) {
    // create the config file
    cca.createConfigFile(appName, moduleName);
    // install the package
    cca.installNpmPackage(appName, moduleName);
  }

  console.log(`
  All done!

  Please, configure your repo url and license in package.json and LICENSE files

  cd ${appName}
  npm run dev
  `);
});
