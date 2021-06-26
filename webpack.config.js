const path = require('path');

module.exports = {
  entry: './src/gui.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watch: true
};