const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const shared = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: { loader: "babel-loader" }
            },
            {
                test: /\.pug$/,
                use: { loader: 'pug-loader' }
            },
            {
                test: /\.sass$/,
                use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        minimize: true,
                        importLoaders: 2
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./app/pug/index.pug",
            filename: "index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "public"),
        compress: true,
        open: true
    }
}

const client = Object.assign({}, shared, {
    target: 'web',
    entry: './app/scripts/main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
})

const tsne_worker = Object.assign({}, shared, {
    target: 'webworker',
    entry: './app/scripts/tsne_worker.js',
    output: {
        filename: 'tsne_worker.js',
        path: path.resolve(__dirname, 'dist')
    }
})

const assignment_worker = Object.assign({}, shared, {
    target: 'webworker',
    entry: './app/scripts/assignment_worker.js',
    output: {
        filename: 'assignment_worker.js',
        path: path.resolve(__dirname, 'dist')
    }
})

module.exports = [client, tsne_worker, assignment_worker]