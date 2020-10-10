const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
    entry: {
        index: './src/index.js',
    },
    externals: [nodeExternals()],
    devtool: 'inline-cheap-module-source-map',
});
