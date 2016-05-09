var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'eventsource-polyfill', // necessary for hot reloading with IE
        'webpack-hot-middleware/client',
        './src/index'
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
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
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
                loader: "style-loader!css-loader",
            },
            {
                test: /\.(png|jpg|)$/,
                loader: 'url-loader?limit=200000'
            },
            {
                test: /\.json$/,
                loader: 'json'
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
