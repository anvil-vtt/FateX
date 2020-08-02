const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');



module.exports = environment => {
    environment = environment || {};
    environment.watch = environment.watch || false;
    environment.mode = environment.mode || 'development';

    return {
        entry: './src/fatex.js',
        mode: environment.mode,
        watch: environment.watch,
        output: {
            filename: 'fatex.js',
            path: path.resolve(__dirname, 'dist'),
        },
        module:{
            rules:[
                {
                    test:/\.(s*)css$/,
                    use:[
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].css',
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            /* new CopyPlugin({
                 patterns: [
                     { from: 'system' },
                 ],
             }),*/
        ],
    }
};
