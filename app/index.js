process.env.APP_PORT = 3000;
process.env.APP_HOST = `localhost`;
process.env.APP_URL = `http://${process.env.APP_HOST}:${process.env.APP_PORT}`;
process.env.CMS_URL = 'http://localhost:8080';
process.env.CMS_PROJECT = 'directus';
// process.env.CMS_STORAGE = 'directus';

const http = require('http');
const { SDK } = require('@directus/sdk-js');
const client = new SDK();

(async () => {
  try {
    await client.login({
      url: process.env.CMS_URL,
      project: process.env.CMS_PROJECT,
      email: 'jonathan@lundi8.io',
      password: '2077_directus',
    });
  } catch (err) {
    throw err;
  }

  const server = http.createServer(async (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    try {
      const data = await client.getItems('appexe');
      // .then(data => {
      //   // Do something with the data
      //   console.log('data', data);
      // })
      // .catch(error => console.error(error));
      return res.end(JSON.stringify(data));
    } catch (err) {
      return res.end(JSON.stringify({ data: err }));
    }
  });

  server.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(`Server running at ${process.env.APP_URL}`);
  });
})();
