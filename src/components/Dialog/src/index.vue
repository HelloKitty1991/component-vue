<template>
    <el-dialog
        center
        :title="title"
        :custom-class="customClass"
        :visible.sync="visible"
        :show-close="showClose"
        :close-on-click-modal="closeOnClickModal"
        :close-on-press-escape="closeOnPressEscape"
        :width="width"
        @closed="close()"
        class="k-dialog"
    >
        <div
            class="content-wrap"
        >
            <component
                :is="currentComponent"
                v-bind="params"
                ref="instance"
                v-if="isComponent"
                @onUpdate="onUpdate"
            >
            </component>
            <div
                v-else
                v-html="content"
            >
            </div>
            <span
                v-if="showFooter"
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    size="small"
                    round
                    @click="cancelMethod"
                >{{ cancelText }}</el-button>
                <el-button
                    size="small"
                    type="primary"
                    @click="confirmMethod"
                    round
                >{{ confirmText }}</el-button>
            </span>
        </div>
    </el-dialog>
</template>
<script>
    import Vue from 'vue';
    import './index.css';
    import showMsg from '../../../mixins/showMsg';
    import showLoading from '../../../mixins/showLoading';

    export default Vue.extend({
        name: 'Dialog',
        mixins: {
            showMsg,
            showLoading,
        },
        data() {
            return {
                visible: true,
                title: '',
                customClass: '',
                currentComponent: null,
                isComponent: false,
                params: {},
                content: '',
                showTitle: true,
                showClose: true,
                showFooter: false,
                cancelText: '取消',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                confirmText: '确定',
                width: 'auto',
                instance: null,
                loading: false,
                onUpdate() {

                },
            };
        },
        mounted() {
            this.$nextTick(() => {
                this.instance = this.$refs.instance;
            });
        },
        methods: {
            close() {
                this.closeDialog();
            },
            cancelMethod() {
                if (this.cancelHandle) {
                    this.cancelHandle(this.instance);
                }
                this.closeDialog();
            },
            async confirmMethod() {
                let res;
                try {
                    if (this.confirmHandle) {
                        res = await this.confirmHandle(this.instance);
                    } else if (this.instance.handleSubmit) {
                        res = await this.instance.handleSubmit();
                    } else {
                        res = true;
                    }
                    if (res) {
                        this.closeDialog();
                    }
                } catch (e) {
                    this.showErrorMsg(e.message);
                }
            },
        },
    });
</script>
<style lang="scss">
    .k-dialog {
        display: flex;
        align-items: center;

        .content-wrap {
            text-align: center;
            padding-bottom: 20px;
        }
        .el-dialog {
            width: auto!important;
            margin: auto!important;
            &__header {
                background-color: #6d93f6;
                height: 50px;
                line-height: 50px;
                padding: 0;
            }

            &__title {
                color: white;
                font-size: 16px;
            }

            &__close {
                color: white;

                &:hover {
                    color: #B6C9FB;
                }
            }

            &__body {
                padding: 20px 20px 0;
            }

            &__footer {
                padding: 0 20px 20px;
            }
        }
        .dialog-footer{
            button {
                margin: 0 25px;
            }
            .el-button {
                min-width: 110px;
                padding: 8px 10px;
                font-size: 14px;
            }
        }
    }
</style>
