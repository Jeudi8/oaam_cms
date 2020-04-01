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
      url: process.env.npm_package_oaam_cms_host,
      project: process.env.npm_package_oaam_cms_project,
      email: process.env.npm_package_oaam_cms_mail,
      password: process.env.npm_package_oaam_cms_pwd,
    });
  } catch (err) {
    return log.error(`Network error. ${err}`);
  }

  // create a user and role for the museum
  await user.setupEditor(client);

  return await client.logout();
};
