const log = require('../log');

module.exports.setupEditor = async client => {
  // create Editor role
  let role = null;
  try {
    await client.createRole({
      name: 'OAAM Editor',
      description: 'Access restricted to managed data',
    });
  } catch (err) {
    log.error('OAAM Editor role already exist');
  }

  // create Editor user
  try {
    role = (await client.getRoles({ filter: { name: 'OAAM Editor' } })).data;
    role = role.length ? role[0] : null;
    if (role) {
      await client.api.request(
        'post',
        '/users',
        {},
        {
          first_name: 'Editor',
          last_name: 'OAAM',
          email: 'editor@oaam.com',
          password: 'editor@oaam.com',
          role: role.id,
          status: 'active',
        },
      );
    }
  } catch (err) {
    log.error('OAAM Editor user already exist');
  }

  return;
};
