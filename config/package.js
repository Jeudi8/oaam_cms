const { existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const AdmZip = require('adm-zip');
const log = require('./log');

const path = (...names) => join(process.cwd(), ...names);

const files = [
  [path('config', 'README.INSTALL.md'), '/'],
  [path('config', 'php.ini'), '/cms'],
  [path('docker-compose.yaml'), '/cms'],
  [path(process.env.npm_package_oaam_app_build), '/'],
];

const folders = [[path('data'), '/cms/data']];
const destPath = path(process.env.npm_package_oaam_dest_package);
const destFile = `${process.env.npm_package_oaam_app_id}-${Date.now().toString()}.zip`;

module.exports = async () => {
  if (!existsSync(destPath)) mkdirSync(destPath);

  log.success(`Zipping in process, wait...`);

  var zip = new AdmZip();
  files.forEach(file => zip.addLocalFile(file[0], file[1]));
  folders.forEach(folder => zip.addLocalFolder(folder[0], folder[1]));
  zip.writeZip(join(destPath, destFile));

  log.success(`Zip ${destFile} ready to deploy`);
};
