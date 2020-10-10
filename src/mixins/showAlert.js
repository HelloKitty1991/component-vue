const noop = () => {};
export default {
    methods: {
        showAlert(...params) {
            let instance;
            const options = {
                confirmButtonText: '确定',
            };
            if (typeof params[0] === 'object') {
                Object.assign(options, params[0]);
            } else {
                options.content = params[0] || '';
                let title = '提示';
                if (typeof params[1] === 'string') {
                    [, title] = params;
                    options.callback = params[2] || noop;
                } else {
                    options.callback = params[1] || noop;
                }
                options.title = title;
            }

            const text = options.confirmButtonText;
            const clearTimerAndResetBtnText = () => {
                clearInterval(this.closeDialogTimer);
                this.closeDialogTimer = null;
                if (options.countdown > 0) {
                    options.confirmButtonText = `${text}(${options.countdown}S)`;
                } else if (options.countdown === 0) {
                    if (instance && instance.$el) {
                        document.body.removeChild(instance.$el);
                    }
                } else {
                    options.confirmButtonText = text;
                }
            };
            clearTimerAndResetBtnText();

            const cb = options.callback;
            options.callback = (action, ins) => {
                if (options.countdown) {
                    options.countdown = 0;
                    clearTimerAndResetBtnText();
                } else {
                    options.countdown = 0;
                }
                if (cb) cb(action, ins);
            };

            options.action = 'confirm';
            options.beforeOpen = (ins) => {
                instance = ins;
            };

            this.$alert(options.content, options.title, options);
            if (options.countdown) {
                let { countdown } = options;
                this.closeDialogTimer = setInterval(() => {
                    if (countdown === 1) {
                        this.$msgbox.close();
                        options.countdown = 0;
                        clearTimerAndResetBtnText();
                        // if (cb) cb();
                        return;
                    }
                    if (instance) {
                        instance.confirmButtonText = `${text}(${--countdown}S)`;
                    }
                }, 1000);
            }
        },
    },
};
