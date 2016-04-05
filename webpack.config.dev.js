var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'eventsource-polyfill', // necessary for hot reloading with IE
        'webpack-hot-middleware/client',
        './src/index_test'
    ],
    output: {
        //path to output the bundled files
        path: path.join(__dirname, 'dist'),
        //name of the bundled files
        filename: 'bundle.js',
        //requests from this location will look in the dist dir from above
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
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
    //let webpack know which extensions to resolve in the require statements
    resolve: {
        extensions: ['','.js','.jsx'] 
    }
};
