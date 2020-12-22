/*
  Determine if email+password combo is valid
*/

const BrickadiaServer = require('../brickadia/server.js');
const config = require('../softconfig.js');
const { store } = require('../config/index.js');

const invalidRegExp = /^(Error: AuthState is Invalid on dedicated server - exiting\.|Changing AuthState from \w+ to Invalid\.)$/;
const validRegExp = /^Changing AuthState from \w+ to ValidOnline\.$/;

module.exports = (email, password) => new Promise(resolve => {
  // create a server with these credentials
  const server = new BrickadiaServer(config.DATA_PATH, {
    credentials: {email, password},
    server: {
      port: 7775,
      __LEGACY: store.get('legacyBin'),
    }
  });

  // wait for the invalid auth line or valid auth line, then kill the server
  server.on('line', line => {
    if (line.match(invalidRegExp)) {
      server.stop();
      resolve(false);
    } else if (line.match(validRegExp)) {
      server.stop();
      resolve(true);
    }
  });

  // start the server
  server.start();
});
