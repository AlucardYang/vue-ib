var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // 提取css
var AssetsPlugin = require('assets-webpack-plugin'); // 生成文件名，配合HtmlWebpackPlugin增加打包后dll的缓存
module.exports = {
    entry: {
        vendor: [
            "axios",
            "clipboard",
            "crypto-js",
            "emergence.js",
            "fundebug-javascript",
            "fundebug-vue",
            "mint-ui",
            "qrcode",
            "vue",
            "vue-router",
            "vue-slider-component",
            "weixin-js-sdk",
        ]

    },
    output: {
        path: path.resolve(__dirname, '../static/dll'),
        filename: '[name].[chunkhash].js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, '../static/dll/[name]-mainfest.json'),
            name: '[name]_library',
            context: __dirname // 执行的上下文环境，对之后DllReferencePlugin有用
        }),
        new ExtractTextPlugin('[name].[contenthash].css'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
        }),
        new AssetsPlugin({
            filename: 'bundle-config.json',
            path: 'static/dll'
        }),

        // 去掉 vue 的 development 提示
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
}