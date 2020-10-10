const noop = () => {};
export default {
    methods: {
        showInfoConfirm(...params) {
            this.showConfirm('info', params);
        },

        showSuccessConfirm(...params) {
            this.showConfirm('success', params);
        },

        showWarningConfirm(...params) {
            this.showConfirm('warning', params);
        },

        showErrorConfirm(...params) {
            this.showConfirm('error', params);
        },

        showConfirm(type, ...params) {
            let options = {
                type,
                title: '操作提示',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
            };

            if (Array.isArray(params[0])) {
                [params] = params; //eslint-disable-line
            }

            if (typeof params[0] === 'object') {
                options = Object.assign(options, params[0]);
            } else if (typeof params[0] === 'string') {
                options.content = params[0] || '';
                if (typeof params[1] === 'string') {
                    options.title = params[1] || '';
                    options.confirmHandle = params[2] || noop;
                    options.cancelHandle = params[3] || noop;
                } else {
                    options.confirmHandle = params[1] || noop;
                    options.cancelHandle = params[2] || noop;
                }
            } else {
                options.confirmHandle = params[0] || noop;
                options.cancelHandle = params[1] || noop;
            }

            const oldCb = options.callback;

            options.callback = (action, instance) => {
                if (oldCb) {
                    oldCb(action, instance);
                }
                if (instance && instance.$el) {
                    document.body.removeChild(instance.$el);
                }
                if (action === 'confirm') {
                    options.confirmHandle();
                } else {
                    options.cancelHandle();
                }
            };

            return this.$confirm(options.content, options);
        },
    },
};
