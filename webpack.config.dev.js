var webpack = require('webpack');
var path = require('path');

// var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    contentBase: '/',
    port: 8080,
    stats: { colors: true }
  },
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    './src/minivue.js'
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "[name].js",
    publicPath: '/'
  },
  module: {
    loaders:[{ 
      test: /\.js[x]?$/, 
      exclude: /node_modules/, 
      loader: 'babel-loader?presets[]=es2015' 
    }]
  },
  resolve: {
      extensions: ['', '.js'],
      root: './src',
      alias: {}
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     template: path.resolve(__dirname, 'src/index.html'),
  //     inject: 'body'
  //   }),
  //   new webpack.HotModuleReplacementPlugin(),
  //   new webpack.DefinePlugin({
  //     'process.env':{
  //       'NODE_ENV': JSON.stringify('development')
  //     }
  //   })
  // ],
  devtool : 'source-map'
};

