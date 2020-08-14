const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const globImporter = require("node-sass-glob-importer");
const path = require("path");
const glob = require("glob");

const allTemplates = () => {
    return glob
        .sync("**/*.html", { cwd: path.join(__dirname, "system/templates") })
        .map((file) => `"systems/fatex/templates/${file}"`)
        .join(", ");
};

module.exports = (env) => {
    const environment = env || {};
    environment.watch = environment.watch || false;
    environment.mode = environment.mode || "development";

    const isDevelopment = environment.mode === "development";

    return {
        entry: "./src/fatex.js",
        mode: environment.mode,
        watch: environment.watch,
        stats: "minimal",
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
                    use: [
                        "eslint-loader",
                        "webpack-import-glob-loader",
                        {
                            loader: "string-replace-loader",
                            options: {
                                search: "__ALL_TEMPLATES__",
                                replace: allTemplates,
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: isDevelopment,
                                url: false,
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: isDevelopment,
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
