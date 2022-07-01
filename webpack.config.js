const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: {
        index: resolve(__dirname, 'src/js/index.js'),
        detail: resolve(__dirname, 'src/js/detail.js'),
        collections: resolve(__dirname, 'src/js/collections.js')
    },
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: resolve(__dirname, 'node_modules'),
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.tpl$/,
                loader: 'ejs-loader',
                options: {
                    esModule: false 
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: function () {
                                return [autoprefixer({ overrideBrowserslist: 'last 5 versions' })]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: function () {
                                return [autoprefixer({ overrideBrowserslist: 'last 5 versions' })]
                            }
                        }
                    },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(jpe?g|png|svg|gif|webp|ico|woff|eot|ttf)$/i,
                // use: 'url-loader?limit=1024&name=img/[name]-[hash:16].[ext]'/resource
                type: 'asset',
                generator: {
                    filename: 'img/[name]-[hash:16].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(__dirname, 'src/index.html'),
            title: '首页',
            chunks: ['index'],
            chunksSortMode: 'manual',
            excludeChunks: ['node_modules'],
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'detail.html',
            template: resolve(__dirname, 'src/detail.html'),
            title: '详情',
            chunks: ['detail'],
            chunksSortMode: 'manual',
            excludeChunks: ['node_modules'],
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'collections.html',
            template: resolve(__dirname, 'src/collections.html'),
            title: '我的',
            chunks: ['collections'],
            chunksSortMode: 'manual',
            excludeChunks: ['node_modules'],
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
    ],
    mode: 'development',
    devtool: 'source-map',
    optimization: {
        minimize: false
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        // proxy: {
        //     '/api': {
        //         target: 'http://v.juhe.cn',
        //         chageOrigin: true,
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
    },
    watchOptions: {
        ignored: /node_modules/
    },

}