const path = require('path');
const config = require('../config')
const utils = require('./utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production'?true:false

module.exports = {
    context: path.resolve(__dirname,'../'),
    entry:{
       'index':'./src/index.js'
    },
    output: {
        filename: 'js/calendar.min.js',
        path:path.resolve(__dirname,'../',config.build.assetsRoot),
        publicPath:isProduction
            ?config.build.assetsPublicPath
            :config.dev.assetsPublicPath
    },
    resolve: {
        alias:{

        },
        modules:[path.resolve(__dirname,'../node_modules')],
        extensions:[".js", ".json"]
    },
    module: {
        rules: [
            {
               test: /\.js$/,
               use: ['babel-loader'],
               include:path.resolve(__dirname,'../src')
            },
            {
                test: /\.less/,
                use: [
                    isProduction?MiniCssExtractPlugin.loader:'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: {
                    loader: 'url-loader',
                    options:{
                        name:utils.assetsSubDir('images/[name]-[hash:8].[ext]'),
                        limit:10000,
                    }
                },
                include:path.resolve(__dirname,'../src')
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: utils.assetsSubDir('media/[name]-[hash:8].[ext]'),
                        limit: 10000
                    }
                },
                include:path.resolve(__dirname,'../src')
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: utils.assetsSubDir('fonts/[name]-[hash:8].[ext]'),
                        limit: 10000
                    }
                },
                include:path.resolve(__dirname,'../src')
            }
        ]
    },
    plugins: [
   
    ]
}