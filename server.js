var path = require('path');
var express = require('express');
var webpack = require('webpack');
var app = express();
var isDevelopment = (process.env.NODE_ENV !== 'production');
var static_path = path.join(__dirname,'static');

if (isDevelopment){
    var config = require('./webpack.config.dev');
    var compiler = webpack(config);
    
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));
    
    app.use(express.static(static_path));
    
    app.get('*', function(req, res) {
        res.sendFile(path.join(static_path, 'index.html'));
    });

    app.listen(3000, 'localhost', function(err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at http://localhost:3000');
    });
}
else{
    app.use(express.static(static_path))
    .get('*', function (req, res) {
            res.sendFile('index.html', {
            root: static_path
        });
    }).listen(process.env.PORT || 8080, function (err) {
        if (err) { console.log(err) };
        console.log('Listening at localhost:8080');
    });
}

