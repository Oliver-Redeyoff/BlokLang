const path = require('path');

module.exports = {
  entry: './src/lib/build/gui.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watch: true
};