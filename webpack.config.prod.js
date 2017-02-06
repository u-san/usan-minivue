let webpack = require('webpack');
let path    = require('path');

module.exports = {
  entry: [
    './src/minivue.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'minivue.min.js',
    publicPath: '/'
  },
  module: {
    loaders:[{ 
      test: /\.js$/, 
      loader: 'babel',
      enclude: '/node_modules/'
    }]
  },
  resolve: {
      extensions: ['', '.js'],
      root: './src',
      alias: {}
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};

