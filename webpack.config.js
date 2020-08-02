const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');


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
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: 'system' },
                ],
            }),
        ],
    }
};
