<template>
    <div class="date-range">
        <el-row>
            <el-col :span="11">
                <el-date-picker
                    v-bind="Object.assign({}, options.attrs || {}, options.startAttrs || {})"
                    v-events="Object.assign({}, options.events || {}, options.startEvents || {})"
                    size="small"
                    :type="/(HH|mm|ss)/.test(format) ? 'datetime' : 'date'"
                    v-model="currentValue[0]"
                    :format="format"
                    :picker-options="{ disabledDate: time => this.startDisabledDate(time, this.currentValue[1])}"
                    :placeholder="startPlaceholder"
                    :clearable="false"
                />
            </el-col>
            <div style="text-align: center;height: 32px; line-height: 32px; width: 10px">
                ~
            </div>
            <el-col :span="11">
                <el-date-picker
                    v-bind="Object.assign({}, options.attrs || {}, options.endAttrs || {})"
                    v-events="Object.assign({}, options.events || {}, options.endEvents || {})"
                    size="small"
                    :type="/(HH|mm|ss)/.test(this.format) ? 'datetime' : 'date'"
                    v-model="currentValue[1]"
                    :format="format"
                    :picker-options="{disabledDate: time => this.endDisabledDate(time, this.currentValue[0])}"
                    :placeholder="endPlaceholder"
                    :clearable="false"
                />
            </el-col>
        </el-row>
        <i
            class="el-icon-circle-close"
            v-if="clearable && showClose"
            @click="handleClear"
        ></i>
    </div>
</template>
<script>

    import get from 'lodash/get';

    export default {
        props: {
            options: {
                type: Object,
                default: () => ({}),
            },
            value: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                currentValue: this.value,
                showClose: (this.value || []).filter(v => !!v).length > 0,
                format: get(this.options, 'attrs.format', 'yyyy-MM-dd HH:mm:ss'),
            };
        },
        methods: {
            startDisabledDate(time, endTime) {
                return endTime && (time.getTime() > (typeof endTime === 'string' ? new Date(endTime).getTime() : endTime.getTime()));
            },
            endDisabledDate(time, startTime) {
                return startTime && (time.getTime() <= (typeof startTime === 'string' ? new Date(startTime).getTime() : startTime.getTime()) - 8.64e7);
            },
            handleClear() {
                (this.currentValue || []).forEach((v, i) => {
                    this.$set(this.currentValue, i, undefined);
                });
            },
        },
        computed: {
            clearable() {
                if (this.options && this.options.attrs) {
                    return typeof this.options.attrs.clearable !== 'undefined' ? this.options.attrs.clearable : true;
                }
                return true;
            },
            startPlaceholder() {
                const attrs = Object.assign({}, this.options.attrs || {}, this.options.startAttrs || {});
                return get(attrs, 'placeholder', '开始时间');
            },
            endPlaceholder() {
                const attrs = Object.assign({}, this.options.attrs || {}, this.options.endAttrs || {});
                return get(attrs, 'placeholder', '结束时间');
            },
        },
        watch: {
            currentValue(val) {
                this.$emit('input', val);
                this.showClose = (val || []).filter(v => !!v).length > 0;
            },
            value(val) {
                this.currentValue = val;
            },
            options: {
                deep: true,
                handler(val) {
                    console.log(val);
                },
            },
        },
    };
</script>
<style lang="scss">

    .date-range {
        display: flex;
        align-items: center;
        flex: 1;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        position: relative;
        height: 32px;
        box-sizing: border-box;

        .el-row {
            width: 100%;
            display: flex;

            .el-col {
                flex: 1;
            }
        }

        .el-date-editor {
            .el-input__inner {
                vertical-align: top;
                margin-top: 1px;
                height: 30px;
                line-height: 30px;
            }
        }

        .el-icon-time, .el-icon-date {
            display: none;
        };

        .el-input {
            width: 100%;
            .el-input__inner {
                padding: 0 5px;
                border: none;
                text-align: center;
                padding: 0 5px;
            }
        }

        .el-icon-circle-close {
            position: absolute;
            right: 10px;
            color: #C0C4CC;
            display: none;
            cursor: pointer;
        }

        &:hover .el-icon-circle-close {
            display: block;
        }
    }
</style>
