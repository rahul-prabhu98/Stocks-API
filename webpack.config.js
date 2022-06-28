const path = require('path');

module.exports = {
    entry: './javascript/main.js',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {rxjs: path.resolve(__dirname, './node_modules/rxjs') },
        extensions: [ '.tsx', '.ts', '.js' ],

    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};