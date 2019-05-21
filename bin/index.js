#!/usr/bin/env node
const fs = require('fs');
const prompt = require('prompt');
const cliUsage = require('command-line-usage');

const cca = require("../lib/cca");
const schema = require('../lib/schema');

const CLI_USAGE = '\`create-controller-app <app_name> [packages ...]\`';

const sections = [
  {
    header: '🎮  Create controller app 🎮 ',
    raw: true,
    content: [
      `{blue    ________                               }`,
      `{blue   / ____/ /_  __________  ____ ___  ____ _}`,
      `{blue  / /   / / / / / ___/ _ |/ __ '__ |/ __ '/}`,
      `{blue / /___/ / /_/ (__  )  __/ / / / / / /_/ / }`,
      `{blue |____/_/|__, /____/|___/_/ /_/ /_/|__,_/  }`,
      `{blue        /____/                             }`,
    ],
  },
  {
    header: 'Usage',
    content: `${CLI_USAGE}`
  },
  {
    header: 'Aviable packages',
    content: [
      { colA: 'http', colB: 'HTTP/REST server'},
      { colA: 'meteor', colB: 'SimpleDDP wrapper'},
      { colA: 'work', colB: 'Load and save working vars in files'},
      { colA: 'brain', colB: 'Simple wrapper for brain.js'},
    ]
  },
];

const usage = cliUsage(sections);

if (process.argv.length < 3) {
  console.info(usage);
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
  // resert repo
  cca.resetRepo(appName);

  console.log(`
  All done!

  Please, configure your repo url and license in package.json and LICENSE files

  cd ${appName}
  npm run dev
  `);
});
