const path = require('path');

module.exports = {
  mode: 'production',
  
  entry: './src/web-app.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};