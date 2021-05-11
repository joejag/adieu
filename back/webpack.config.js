var path = require('path')

module.exports = {
  target: 'node',
  mode: 'production',

  entry: { login: './login/index.js', emails: './emails/index.js' },
  output: {
    filename: '[name]/index.js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'build'),
  },

  externals: {
    'aws-sdk': 'aws-sdk',
  },
}
