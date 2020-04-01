require('dotenv').config();
const setup = require('./setup');
const package = require('./package');
const deploy = require('./deploy');
const log = require('./log');

const args = process.argv.splice(2);

if (args.length < 1) {
  log.error('Not enough arguments');
  return;
}

(async () => {
  switch (args[0]) {
    case 'setup':
      try {
        return await setup();
      } catch (err) {
        throw err;
      }
    case 'package':
      try {
        return await package();
      } catch (err) {
        throw err;
      }
    case 'deploy':
      try {
        return await deploy();
      } catch (err) {
        throw err;
      }
    default:
      log.error(`Process not found`);
  }
})();
