<template>
    <div>
        <Form :formItems="formItems" />
    </div>
</template>
<script>
    import { Form } from '..';

    export default {
        components: {
            Form,
        },
        props: {
            username: {
                type: String, 
                default: '',
            },
            password: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                formItems: {
                    username: {
                        type: 'input', 
                        label: '用户名',
                        value: this.username,
                    },
                    password: {
                        type: 'input',
                        label: '密码',
                        value: this.password,
                    },
                },
            };
        },
        methods: {
            doLogin() {
                this.closeDialog();
            },
            handleSubmit() {
                setTimeout(() => {
                    this.$emit('onUpdate');
                    // this.closeDialog();
                }, 3000);
            },
        },
    };
</script>
