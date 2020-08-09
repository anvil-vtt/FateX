const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const globImporter = require("node-sass-glob-importer");
const path = require("path");

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
            writeToDisk: true,
            proxy: [
                {
                    context: (pathname) => {
                        return !pathname.match("^/sockjs");
                    },
                    target: "http://localhost:30000",
                    ws: true,
                },
            ],
        },
        module: {
            rules: [
                isDevelopment
                    ? {
                          test: /\.html$/,
                          loader: "raw-loader",
                      }
                    : {
                          test: /\.html$/,
                          loader: "null-loader",
                      },
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
