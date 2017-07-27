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
    genLoaders(env);
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

var genLoaders = (env = defaultEnv) => {
    if (env.dev) {
        loaders.push(
            {
                test: /\.(css|sass|scss)$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader", "sass-loader"],
            }
        )
    } else {
        loaders.push(
            {
                test: /\.(css|sass|scss)$/,
                use: ExtractTextPlugin.extract({
                      fallback: "style-loader",
                      use: ["css-loader", "sass-loader"]
                })
            }
        );
    }
};

var genClietPluginsAndLoaders = (env = defaultEnv) => {
    let clientPlugins = [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new CopyWebpackPlugin([{from: 'src/public'}]),
    ];
    if (env.dev) {
        clientPlugins.push(
            //new DashboardPlugin()
        );
    } else {
        clientPlugins.push(
            new ExtractTextPlugin({
                filename: 'css/[name].bundle.css',
                allChunks: true,
            })
        );
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
            plugins: genServerPlugins(env),
            target: 'node',
            externals: [nodeExternals()],
            module: { rules: loaders }
        },
        {
            entry: './src/views/index.js',
            output: {
                path: path.join(__dirname, 'dist', 'public'),
                filename: 'js/app.bundle.js',
            },
            plugins: genClietPluginsAndLoaders(env),
            module: { rules: loaders }
        }
]);
