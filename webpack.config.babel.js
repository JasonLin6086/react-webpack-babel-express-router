const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const defaultEnv = {
    dev: true,
    production: false,
};

var loaders = require('./webpack.loaders');
var nodeExternals = require('webpack-node-externals');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var genServerPlugins = (env = defaultEnv) => {
    let serverPlugins = [];
    if (env.production) {
        serverPlugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                },
                output: {
                    comments: false,
                },
            })
        );
    }
    return serverPlugins;
};

var genClietPlugins = (env = defaultEnv) => {
    let clientPlugins = [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new CopyWebpackPlugin([{from: 'src/public/vendor', to: 'vendor'}]),
    ];
    if (env.dev) {
        clientPlugins.push(
            //new DashboardPlugin()
        )
    } else {
        clientPlugins.push(
            new ExtractTextPlugin({
                filename: '[name].bundle.css',
                allChunks: true,
            })
        )
    }
    return clientPlugins;
};

((env = defaultEnv) => {
    if (env.dev) {
        loaders.push(
            {
                test: /\.(sass|scss)$/,
                exclude: /node_modules/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }],
            }
        )
    } else {
        loaders.push(
            {
                test: /\.(css|sass|scss)$/,
                loaders: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css!postcss!sass',
                }),
                exclude: ['node_modules']
            }
        );
    }
    return loaders;
})();

export default (env = defaultEnv) => ([
        {
            entry: './src/server.js',
            output: {
                path: path.join(__dirname, 'dist'),
                filename: 'server.bundle.js',
            },
            module: {
                loaders
            },
            target: 'node',
            externals: [nodeExternals()],
            plugins: genServerPlugins(env),
        },
        {
            entry: './src/views/index.js',
            output: {
                path: path.join(__dirname, 'dist', 'public'),
                filename: 'js/app.bundle.js',
            },
            module: {
                loaders
            },
            plugins: genClietPlugins(env),
        }
]);
