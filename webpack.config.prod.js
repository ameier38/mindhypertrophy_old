var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index_test'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
        loaders: [
            {
                //regex that tests what kind of files to run through the loader
                test: /\.jsx?/,
                //loaders to use
                loaders: ['babel'],
                //path for files to run through loaders
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                //runs the css loader then the style loader (for bootstrap)
                //TODO: need to understand how to get this to work with bootstrap
                loader: "style-loader!css-loader",
                //include: path.join(__dirname,'src','css')
            },
            {
                test: /\.(png|jpg)$/,
                //images below 10kb will be inlined as base 64 encoded data
                loader: 'url-loader?limit=8124',
                include: path.join(__dirname,'images')
            },
            //bootstrap specific
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" }
        ]
    },
    resolve: {
        extensions: ['','.js','.jsx'] 
    }
};
