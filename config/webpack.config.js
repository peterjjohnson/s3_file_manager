const webpack = require('webpack')

module.exports = {
    entry: './src/client.jsx',
    output: {
        path: 'public/build',
        filename: 'client.js',
        sourceMapFilename: 'client.map'
    },
    watch: true,
    // devtool: '#source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
                query: {
                    presets: ['es2015', 'react', 'stage-0']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     warnings: false,
        //     mangle: true
        // })
    ]
}
