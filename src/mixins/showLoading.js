let loading;
export default {
    methods: {
        showLoading(message) {
            let options = {
                lock: true,
                text: '加载中，请稍候......',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
            };
            if (typeof message === 'string') {
                options.text = message;
            } else if (typeof message === 'object') {
                options = Object.assign(options, message);
            }
            loading = this.$loading(options);
        },

        hideLoading() {
            if (loading) {
                loading.close();
            }
        },
    },
};
