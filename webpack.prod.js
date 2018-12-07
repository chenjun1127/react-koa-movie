const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }, {
            test: /\.(scss|css)$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: 'css-loader',
                options: {
                    sourceMap: true
                }
            }, {
                loader: 'sass-loader',
                options: {
                    sourceMap: true
                }
            }, {
                loader: 'postcss-loader'
            }]
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192 // 小于8KB 使用base64格式图片
                }
            }]
        }]
    },
    resolve: {
        extensions: [".js", ".json", ".jsx", ".css", ".scss"],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash].css'
        }),
        new HtmlWebpackPlugin({
            title: 'demo',
            template: './templates/index.html',
            inject: 'body'
        }),
        new OptimizeCssAssetsPlugin(),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "vendor",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },
    entry: {
        app: './src/index.js',
        vendor: ['react', 'react-dom', 'react-router', './src/static/js/iconfont.js']
    },

    output: {
        filename: 'js/[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: "js/[name].[chunkHash].js",
    },
    performance: {
        hints: false
    },// 关闭性能提示
    mode: 'production'
}