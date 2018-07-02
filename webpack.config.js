const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopywebpackPlugin = require('copy-webpack-plugin')
const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'

const devMode = process.env.NODE_ENV !== 'production'

// const extractSass = new ExtractTextPlugin({
//     filename: "[name].[contenthash].css",
//     disable: process.env.NODE_ENV === "development"
// });

const extractSass = new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: devMode ? '[name].css' : '[name].[hash].css',
    chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
});

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        sourcePrefix: ''
    },
    amd: {
        toUrlUndefined: true
    },
    node: {
        fs: 'empty'
    },
    resolve: {
        alias: {
            // Cesium module name
            cesium: path.resolve(__dirname, cesiumSource)
        }
    },
    module: {
        rules: [{
            test: /\.(sa|sc|c)ss$/,
            use: [
                devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'sass-loader',
            ]
        },{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.jsx$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        },{
            test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
            use: [ 'url-loader' ]
        }]
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        compress: false
    },
    devtool: 'inline-source-map',
    plugins: [
        extractSass,
         new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        // Copy Cesium Assets, Widgets, and Workers to a static directory
        new CopywebpackPlugin([ { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' } ]),
        new CopywebpackPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'Assets' } ]),
        new CopywebpackPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' } ]),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('')
        })
    ]
};