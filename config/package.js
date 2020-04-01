/**
 * Process to grab all needed files and folders in production,
 * and package them in zip file.
 * You can test yout production build by decompress the file
 * and fallow the procedure of README.INSTALL.md
 */

const { existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const AdmZip = require('adm-zip');
const log = require('./log');

const path = (...names) => join(process.cwd(), ...names);

const files = [
  [path('README.INSTALL.md')],
  [path('docker-php-custom.ini'), 'cms'],
  [path('docker-compose.yaml'), 'cms'],
  [path(process.env.npm_package_oaam_app_build)],
];

const folders = [[path('data'), 'cms/data']];
const destPath = path(process.env.npm_package_oaam_dest_package);
const destFile = `${process.env.npm_package_oaam_app_id}-${Date.now().toString()}.zip`;

module.exports = async () => {
  if (!existsSync(destPath)) mkdirSync(destPath);

  log.success(`Zipping in process, wait...`);

  var zip = new AdmZip();
  files.forEach(file => {
    zip.addLocalFile(...file);
  });
  folders.forEach(folder => zip.addLocalFolder(...folder));
  zip.writeZip(join(destPath, destFile));

  log.success(`Zip ${destFile} ready to deploy`);
};
