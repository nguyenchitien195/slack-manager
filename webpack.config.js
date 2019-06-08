var path = require('path');
var webpack = require('webpack');

var srcPath = path.join(__dirname, 'scripts');
var buildPath = path.join(__dirname, 'dist');
const context = path.resolve(__dirname, 'app');

module.exports = {
    entry: [path.join(srcPath, 'handler.js')],
    output: {
        path: buildPath,
        filename: 'bundle.js'
    },
    resolve: {
        modules: [
            'scripts', 'node_modules',
        ],
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['env', 'react']
                    }
                }
            }
        ]
    },
    optimization: {
        minimize: false
    },
    watch: true
};