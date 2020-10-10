<template>
    <div>
        <fieldset>
            <legend>打开对话框测试</legend>
            <el-button @click="openDialogWithNoTitle()">
                打开不带标题的对话框
            </el-button>
            <el-button @click="openDialogWithTitle()">
                打开带标题的对话框
            </el-button>
        </fieldset>
        <fieldset>
            <legend>确认框测试</legend>
            <el-button @click="openDefaultConfirm()">
                打开默认确认框
            </el-button>
            <el-button @click="openConfirmWithTitle()">
                打开自定义标题的确认框
            </el-button>
            <el-button @click="openConfirmWithCallback()">
                打开自定义确认、取消方法的确认框
            </el-button>
            <el-button @click="openConfirmWithObjectParam()">
                通过对象为参数的方式打开确认框
            </el-button>
            <el-button @click="openInfoConfirm()">
                打开消息确认框
            </el-button>
            <el-button @click="openWarningConfirm()">
                打开警告确认框
            </el-button>
        </fieldset>
        <fieldset>
            <legend>消息框测试</legend>
            <el-button @click="openAlert()">
                默认消息框
            </el-button>
            <el-button @click="openAlertWithTitle()">
                自定义标题消息框
            </el-button>
            <el-button @click="openAlertWithCallback()">
                带回调消息框
            </el-button>
            <el-button @click="openAlertWithObjectParams()">
                对象参数调起消息框
            </el-button>
            <el-button @click="openAlertWithCountdown()">
                带倒计时的消息框
            </el-button>
        </fieldset>
        <fieldset>
            <legend>Loading测试</legend>
            <el-button @click="showLoading()">
                默认Loading效果
            </el-button>
        </fieldset>
        <fieldset>
            <legend>Toast测试</legend>
            <el-button @click="showSuccessMsg('这是成功消息')">
                成功Toast
            </el-button>
            <el-button @click="showInfoMsg('这是普通消息')">
                普通Toast
            </el-button>
            <el-button @click="showWarningMsg('这是警告消息')">
                警告Toast
            </el-button>
            <el-button @click="showErrorMsg('这是错误消息')">
                错误Toast
            </el-button>
        </fieldset>
    </div>
</template>
<script>
    import Login from './Login';
    
    export default {
        methods: {
            openDialogWithNoTitle() {
                this.showComponent(Login, {
                    width: '500px',
                    showFooter: true,
                    params: {
                        username: 'jack-cheng',
                        password: '123456789',
                    },
                    onUpdate() {
                        console.log('onUpdate');
                    },
                });
            },
            openDialogWithTitle() {
                this.showComponent(Login, {
                    width: '500px',
                    title: '用户登录',
                    showFooter: true,
                    params: {
                        username: 'jack park',
                        password: '12345652136',
                    },
                });
            },
            openDefaultConfirm() {
                this.showConfirm('info', '确认要删除该数据');
            },
            openConfirmWithTitle() {
                this.showConfirm('info', '确认要删除该数据', '删除确认');
            },
            openConfirmWithCallback() {
                this.showConfirm('info', '确认要删除该数据', '删除确认', () => alert('确认'), () => alert('取消'));
            },
            openConfirmWithObjectParam() {
                this.showConfirm('info', {
                    content: '确认删除该数据',
                    title: '确认删除',
                    confirmHandle: () => alert('确认'),
                    cancelHandle: () => alert('取消'),
                });
            },
            openInfoConfirm() {
                this.showInfoConfirm('这个是消息确认框', '这是标题');
            },
            openWarningConfirm() {
                this.showWarningConfirm('这个是警告确认框', '这是标题');
            },
            openAlert() {
                this.showAlert('这是提示消息');
            },
            openAlertWithTitle() {
                this.showAlert('这是提示消息', '这是标题');
            },
            openAlertWithCallback() {
                this.showAlert('这是提示消息', '这是标题', () => alert('确认'));
            },
            openAlertWithObjectParams() {
                this.showAlert({
                    title: '这是标题',
                    content: '这里是标题正文',
                    callback: () => alert('确认'),
                    confirmButtonText: '知道了',
                });
            },
            openAlertWithCountdown() {
                this.showAlert({
                    title: '这是标题',
                    content: '这里是标题正文',
                    callback: (...params) => console.log(params),
                    confirmButtonText: '知道了',
                    countdown: 5,
                });
            },
        },
    };
</script>

<style>
</style>
