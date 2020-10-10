

const path = require('path');

module.exports = {
    configureWebpack: (config) => {
        config.resolve.alias.vue$ = 'vue/dist/vue.esm.js';
        config.entry = path.join(__dirname, 'src', 'demo', 'main.js');
        if (process.env.NODE_ENV === 'development') {
            if (!config.devServer) {
                config.devServer = {};
            }
            config.devServer.proxy = {
                '/api': {
                    target: 'http://gaiaxyt.dvo.ihello.com/',
                    // target: 'http://gaiaxyt.dvo1.ihello.com/',
                    // target: 'http://gaiaxyt.test.ihello.com/',
                    // target: 'http://gaiaxyt-admin.dvo.ihello.com/',
                    // target: 'http://gaiaxyt-admin.test.ihello.com/',
                    changeOrigin: true,
                },
            };
        }
        config.devtool = 'source-map';
    },
    lintOnSave: false,
    chainWebpack: (config) => {
        /* start --- 用svg-sprite-loader处理svg雪碧图  */
        config.module
            .rule('svg')
            .exclude.add(path.resolve('src/demo/icons'))
            .end();
        config.module
            .rule('svg-sprite-loader')
            .test(/\.svg$/)
            .include
            .add(path.resolve('src/demo/icons')) // 处理svg目录
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({ symbolId: 'icon-[name]' });
        /* end --- 用svg-sprite-loader处理svg雪碧图  */
    },
};
