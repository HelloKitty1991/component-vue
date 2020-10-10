export default {
    methods: {
        showSuccessMsg(message) {
            this.showMsg('success', message);
        },

        showInfoMsg(message) {
            this.showMsg('info', message);
        },

        showWarningMsg(message) {
            this.showMsg('warning', message);
        },

        showErrorMsg(message) {
            this.showMsg('error', message);
        },

        showMsg(type, message) {
            this.$message({
                type,
                message,
            });
        },
    },
};
