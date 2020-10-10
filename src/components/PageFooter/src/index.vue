<template>
    <div>
        <div
            class="page-footer"
            :style="Object.assign({padding: '23px 0', color: '#999', 'font-size': '12px', 'background-color': '#fff', 'border-color': '#EEF2F8', 'z-index': 2}, pageStyle)"
        >
            <span>{{ description }}</span>
            <a
                href="http://beian.miit.gov.cn/"
                :target="target"
                :style="{ 'color': hoveredColorLeft }"
                @mouseover="mouseOver('left')"
                @mouseleave="mouseLeave"
                class="spacing"
            >{{ record }}</a>
            <a
                href="http://beian.miit.gov.cn/"
                :target="target"
                :style="{ 'color': hoveredColorRight }"
                @mouseover="mouseOver('right')"
                @mouseleave="mouseLeave"
            >{{ license }}</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PageFooter',
        props: {
            // 传入的公司描述
            description: {
                type: String,
                default: `Copyright © 1999-${new Date().getFullYear()} 成都路行通信息技术有限公司版权所有`,
            },
            // 链接打开方式
            target: {
                type: String,
                default: '_blank',
            },
            // 蜀ICP备号
            record: {
                type: String,
                default: '蜀ICP备08110633号-2',
            },
            // 增值电信业务经营许可证
            license: {
                type: String,
                default: '增值电信业务经营许可证：川B2-20130092',
            },
            pageStyle: {
                type: Object,
                default() {
                    return {};
                },
            },
            // a标签未hover的颜色
            hoveredColor: {
                type: String,
                default: '#999',
            },
            // a标签hover颜色
            hoverColor: {
                type: String,
                default: '#4877F4',
            },
        },
        data() {
            return {
                hoveredColorLeft: this.hoveredColor,
                hoveredColorRight: this.hoveredColor,
            };
        },
        methods: {
            // 鼠标移入移出改变a标签颜色
            mouseOver(position) {
                if (position === 'left') {
                    this.hoveredColorLeft = this.hoverColor;
                } else {
                    this.hoveredColorRight = this.hoverColor;
                }
            },
            mouseLeave() {
                this.hoveredColorLeft = this.hoveredColor;
                this.hoveredColorRight = this.hoveredColor;
            },
        },
    };
</script>

<style lang="scss" scoped>
    .page-footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        text-align: center;
        border-top: 1px solid;
        a {
            cursor: pointer;
        }
        .spacing{
            margin: 0 10px;
        }
    }
</style>
