<template>
    <div style="width: 100%">
        <el-row
            :gutter="gutter"
            class="text-item"
        >
            <el-col
                v-for="(item, index) in currentData"
                :key="index"
                :span="(item.span) || Math.ceil(24 / columns)"
                :style="colStyle"
            >
                <span
                    class="label"
                >{{ item.label }}：</span>
                <el-tooltip
                    :content="`${item.content || '--'}`"
                    placement="top-start"
                    :disabled="!showTooltip[index]"
                    v-if="item.type !== 'component' && !textWrap(item.wrap, wrap)"
                >
                    <span
                        :class="`col_${index}`"
                        class="content"
                    >
                        {{ item.content || '--' }}
                    </span>
                </el-tooltip>
                <span
                    :class="`col_${index}`"
                    class="content"
                    :style="textWrap(item.wrap, wrap) ? {whiteSpace: 'normal', wordBreak: 'break-all'} : {whiteSpace: 'nowrap'}"
                    v-if="textWrap(item.wrap, wrap)"
                >
                    {{ item.content || '--' }}
                </span>
                <div
                    v-if="item.type === 'component'"
                    style="width: 100%"
                >
                    <component
                        :is="item.content"
                        :params="item.params"
                    />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        props: {
            textData: {
                type: Array,
                default: () => [],
            },
            columns: {
                type: Number,
                default: 4,
            },
            labelWidth: {
                type: Number,
                default: 85,
            },
            gutter: {
                type: Number,
                default: 5,
            },
            wrap: {
                type: Boolean,
                default: false,
            },
            margin: {
                type: Number,
                default: 10,
            },
        },
        data() {
            return {
                currentData: this.textData.filter(v => !!v),
                showTooltip: [],
            };
        },
        mounted() {
            this.setTooltipStatus();
        },
        watch: {
            textData(val) {
                this.currentData = val.filter(v => !!v);
                this.setTooltipStatus();
            },
        },
        computed: {
            colStyle() {
                const temp = {};
                return Object.assign(temp, { display: 'flex', margin: `${this.margin}px 0 ${this.margin}px 0` });
            },
        },
        methods: {
            setTooltipStatus() {
                this.$nextTick(() => {
                    this.currentData.forEach((item, index) => {
                        const span = document.createElement('span');
                        span.innerHTML = item.content;
                        span.style.visibility = 'hidden';
                        span.style.fontSize = '14px';
                        document.body.append(span);
                        const current = this.$el.querySelector(`.col_${index}`);
                        this.$set(this.showTooltip, index, current ? span.offsetWidth > current.offsetWidth : false);
                        document.body.removeChild(span);
                    });
                });
            },
            textWrap(itemWrap, wrap) {
                if (typeof itemWrap !== 'undefined') {
                    return itemWrap;
                }
                return wrap;
            },
        },
    };
</script>
<style lang="scss" scope>
    .text-item {
        font-family:  PingFang SC\, Microsoft YaHei;
        .label {
            white-space: nowrap;
            color: #999;
        }
        .content {
            color: #303133;
            flex: 1; 
            width: 0; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis;
        }
    }
</style>
