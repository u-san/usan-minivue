let webpack = require('webpack');
let path    = require('path');


// var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './src/minivue.js'
  ],
  output: {
    path: '/',
    filename: './build/minivue.min.js',
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
    new webpack.HotModuleReplacementPlugin(),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, 'src/index.html'),
    //   inject: 'body'
    // }),
    // new webpack.DefinePlugin({
    //   'process.env':{
    //     'NODE_ENV': JSON.stringify('development')
    //   }
    // })
  ],
  devtool : 'source-map',
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: 8080,
    stats: { colors: true }
  }
};

