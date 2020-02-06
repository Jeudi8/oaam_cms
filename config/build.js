const fs = require('fs');
const { join } = require('path');
const zipdir = require('zip-dir');
const log = require('./log');

const ROOT = join(process.cwd(), '..');
const ZIP_1 = join(ROOT, 'docker-compose.yaml');
const ZIP_2 = join(ROOT, 'app');
const ZIP_3 = join(ROOT, 'data');

// dist folder
const DEST_PATH = join(ROOT, 'dist');
if (!fs.existsSync(DEST_PATH)) fs.mkdirSync(DEST_PATH);

// app id
let args = process.argv.splice(2);
if (args.length < 2) {
  log('provide an app id in scripts : "node build.js --app your-app-id"');
  return;
}

// zipping
log('building .zip in process"');
const ZIP_NAME = `${args[1]}-${Date.now()}.zip`;
const ZIP_PATH = join(DEST_PATH, ZIP_NAME);
zipdir(
  '../',
  {
    saveTo: ZIP_PATH,
    filter: (path, stat) => {
      if (path.includes(ZIP_1)) return true;
      else if (path.includes(ZIP_2)) return true;
      else if (path.includes(ZIP_3)) return true;
      else return false;
    },
  },
  (err, buffer) => {
    if (err) throw err;
    log(`./dist/${ZIP_NAME} ready to deploy`);
  },
);
