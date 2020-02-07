require('dotenv').config();
const setup = require('./setup');
const build = require('./build');
const deploy = require('./deploy');
const log = require('./log');

const args = process.argv.splice(2);

if (args.length < 1) {
  log.error('not enough arguments');
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
    case 'build':
      try {
        return await build();
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
      log.error(`Process "${args[0]}" not found`);
  }
})();
