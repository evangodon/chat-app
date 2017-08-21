const webpack = require('webpack');

module.exports = {
    entry: {
        index: './public/js/index.js',
        chat: './public/js/chat.js'
    },
    output: {
        path: __dirname + '/public/bundles',
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            "$": 'jquery',
            "jQuery": 'jquery'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader?sourceMap', options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    devtool: 'source-map'
}