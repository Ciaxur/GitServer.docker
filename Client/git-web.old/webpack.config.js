const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/web-app.js',
  module: {
    rules: [],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};