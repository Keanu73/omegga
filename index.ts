// if this module has a parent, return the lib, otherwise run the cli
if (require.main?.children.length) {
  module.exports = require('./src/lib.js');
} else {
  require('./src/main.js');
}
