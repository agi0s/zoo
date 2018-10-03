const path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: "./src/index.js",
        materialize: "./node_modules/materialize-css/dist/js/materialize.min.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins : [
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject : 'body'
        })
    ]
};