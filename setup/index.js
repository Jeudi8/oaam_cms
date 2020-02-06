/*
This file can be updated to setup default table/user/file/etc..
*/
const { SDK } = require('@directus/sdk-js');
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

  // create a role for the museum administrator
  try {
    await client.createRole({
      name: 'Museum Administrator',
      description: 'Access restricted to managed data',
    });
  } catch (err) {
    console.error('role already exist');
  }

  // create a user for the museum administrator
  try {
    let role = (await client.getRoles()).data.filter(obj => obj.name === 'Museum Administrator');
    role = role.length ? role[0] : null;
    if (role) {
      await client.api.request(
        'post',
        '/users',
        {},
        {
          first_name: 'Museum Admin',
          last_name: 'User',
          email: 'museum@oman.com',
          password: 'museum@oman.com',
          role: role.id,
          status: 'active',
        },
      );
    }
  } catch (err) {
    console.error('user already exist');
  }

  return;
})();
