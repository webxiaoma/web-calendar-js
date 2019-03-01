const path = require('path');
const webpack = require('webpack');
const devConfig = require('../config').dev
const wepackMerge = require('webpack-merge');
const webpackBaseConfig = require("./webpack.base.js")
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = wepackMerge(webpackBaseConfig,{
    mode: 'development',
    module: {
        rules: [

        ]
    },
    plugins: [
       new HotModuleReplacementPlugin(),
       new HtmlWebpackPlugin({
           inject: true, 
           template:  path.resolve(__dirname, '../index.html') 
       }),
    ],
    devtool:'cheap-module-eval-source-map',
    devServer:{  // 开发环境下
        // contentBase: path.join(__dirname,'../',devConfig),
        host: devConfig.host,
        port: devConfig.port || 8080,
        open: devConfig.openBrowser, 
        proxy:devConfig.proxyTable || {},
    },
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 500, // 默认为 300ms
        poll: 1500, // 默认每秒问 1000 次
    },
});