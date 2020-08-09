const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const globImporter = require("node-sass-glob-importer");
const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
    const environment = env || {};
    environment.watch = environment.watch || false;
    environment.mode = environment.mode || "development";

    const isDevelopment = environment.mode === "development";

    return {
        entry: "./src/fatex.js",
        mode: environment.mode,
        watch: environment.watch,
        output: {
            filename: "system.js",
            path: path.resolve(__dirname, "dist"),
        },
        devServer: {
            hot: true,
            publicPath: "/",
            writeToDisk: true,
            proxy: {
                "/": {
                    target: "http://localhost:30000",
                    ws: true,
                },
                "^/socksjs-node/": {
                    target: "http://localhost:8080",
                    ws: true,
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "eslint-loader",
                    options: {},
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: "style-loader",
                        },
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                url: false,
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                sassOptions: {
                                    importer: globImporter(),
                                },
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [{ from: "system" }],
            }),
        ],
    };
};
