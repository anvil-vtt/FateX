const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const globImporter = require('node-sass-glob-importer');
const path = require('path');

module.exports = environment => {
    environment = environment || {};
    environment.watch = environment.watch || false;
    environment.mode = environment.mode || 'development';

    return {
        entry: './src/fatex.js',
        mode: environment.mode,
        watch: environment.watch,
        output: {
            filename: 'system.js',
            path: path.resolve(__dirname, 'dist'),
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                url: false
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                sassOptions: {
                                    importer: globImporter()
                                }
                            },
                        },
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    {from: 'system'},
                ],
            }),
        ],
    }
};
