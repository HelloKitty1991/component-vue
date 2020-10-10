<template>
    <div class="form-btn">
        <el-button
            v-if="buttons.includes('reset')"
            :size="buttonSize"
            round
            @click="reset"
        >
            重置
        </el-button>
        <el-button
            v-if="buttons.includes('search')"
            :size="buttonSize"
            type="primary"
            round
            @click="submit"
        >
            查询
        </el-button>
    </div>
</template>

<script>
    export default {
        props: {
            submit: {
                type: Function,
                default: () => {},
            },
            reset: {
                type: Function,
                default: () => {},
            },
            buttons: {
                type: Array,
                default: () => ['reset', 'search'],
            },
            buttonSize: {
                type: String,
                default: 'small',
            },
        },
    };
</script>

<style lang="scss" scoped>
    .form-btn {
        .el-button {
            min-width: 80px;
            font-size: 14px;
            height: 32px;
            margin-left: 20px;
        }
    }
</style>
