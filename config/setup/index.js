/*
This file can be updated to setup default table/user/file/etc..
*/
const { SDK } = require('@directus/sdk-js');
const log = require('../log');
const user = require('./user');

module.exports = async () => {
  const client = new SDK();

  // connect
  try {
    await client.login({
      url: process.env.OAAM_CMS_HOST,
      project: process.env.OAAM_CMS_PROJECT,
      email: process.env.OAAM_ADMIN_MAIL,
      password: process.env.OAAM_ADMIN_PWD,
    });
  } catch (err) {
    return log.error(`Network error. ${err}`);
  }

  // create a user and role for the museum
  await user.setupEditor(client);

  return await client.logout();
};
