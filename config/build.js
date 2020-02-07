const { existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const zipdir = require('zip-dir');
const log = require('./log');

const ROOT = process.cwd();
const ZIP_1 = join(ROOT, 'docker-compose.yaml');
const ZIP_2 = join(ROOT, 'app');
const ZIP_3 = join(ROOT, 'data');
const ZIP_4 = join(ROOT, 'README.INSTALL.md');

module.exports = async () => {
  // dist folder
  const DEST_PATH = join(ROOT, 'dist');
  if (!existsSync(DEST_PATH)) mkdirSync(DEST_PATH);

  // zipping
  log.success('Building .zip in process, wait...');
  const ZIP_NAME = `${process.env.OAAM_APP_ID}-${Date.now()}.zip`;
  const ZIP_PATH = join(DEST_PATH, ZIP_NAME);
  zipdir(
    ROOT,
    {
      saveTo: ZIP_PATH,
      filter: (path, stat) => {
        if (path.includes(ZIP_1)) return true;
        else if (path.includes(ZIP_2)) return true;
        else if (path.includes(ZIP_3)) return true;
        else if (path.includes(ZIP_4)) return true;
        else return false;
      },
    },
    (err, buffer) => {
      if (err) throw err;
      log.success(`./dist/${ZIP_NAME} ready to deploy`);
    },
  );
};
