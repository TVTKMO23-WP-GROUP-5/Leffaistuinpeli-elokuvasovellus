const path = require('path');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          stream: require.resolve('stream-browserify'),
        }
      }
    }
  }
};