const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require('webpack');

module.exports = {
    mode: process.env.NODE_ENV || "production",
    entry: path.resolve(__dirname, "js", "main.ts"),
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "src/dist"),
    },
    module: {
        rules: [
            {
                test: /\.([jt]sx?)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '...'],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || "production")
            }
        })
    ]
}