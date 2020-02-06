/*
This file can be updated to setup default table/user/file/etc..
*/
const { SDK } = require('@directus/sdk-js');
const user = require('./user');

const client = new SDK();

(async () => {
  // connect
  try {
    await client.login({
      url: 'http://localhost:8765',
      project: 'directus',
      email: 'admin@oman.com',
      password: 'admin@oman.com',
    });
  } catch (err) {
    throw err;
  }

  // create a user and role for the museum administrator
  await user.createMuseumAdmin(client);

  return;
})();
