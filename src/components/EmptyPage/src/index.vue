<template>
    <div class="k-default-page" :class="className">
        <div
            class="k-default-page__icon"
            v-if="icon"
        >
            <svg-icon
                :icon-name="icon"
            />
        </div>
        <div
          class="k-default-page__text"
        >
          {{text}}
          <slot name="text"></slot>
        </div>
        <slot></slot>
    </div>
</template>

<script>

export default {
    name: 'DefaultPage',
    props: {
        text: {
            type: String,
            default: '暂无数据',
        },
        icon: {
            type: String,
            default: 'search',
        },
        flexDirection: {
            type: String,
            default: 'column',
        },
    },
    computed: {
        className() {
            return `k-default-page-${this.flexDirection}`;
        },
    },

};
</script>

<style lang="scss" scoped>

    .k-default-page{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        &-row{
          flex-direction: row;
        }
        &-column{
          flex-direction: column;
        }
        &-row-reverse{
          flex-direction: row-reverse;
        }
        &-column-reverse{
          flex-direction: column-reverse;
        }


        &__icon {
            width: 50px;
            height: 50px;
            font-size: 50px;
            margin-bottom: 6px;
        }
        &__text{
            font-size: 14px;
            padding-top: 6px;
            color: #c9c9c9;
        }
    }
</style>
