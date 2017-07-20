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
        new CopyWebpackPlugin([{from: 'src/public'}])
    ];
    if (env.dev) {
        clientPlugins.push(
            //new DashboardPlugin()
        )
    }
    return clientPlugins;
};

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
