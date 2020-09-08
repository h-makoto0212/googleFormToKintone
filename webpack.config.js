const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'GoogleFormToKintone.gs',
    path: path.join(__dirname, 'public/js')
  }
};