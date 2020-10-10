<template>
  <svg
      :class="svgClass"
      aria-hidden="true"
  >
    <use class="k-svg-use" :xlink:href="xlinkHref" />
  </svg>

</template>

<script>
export default {
    name: 'SvgIcon',
    props: {
        /* 图标名称 */
        iconName: {
            type: String,
            default: '',
        },
        /* 提供重写样式的class */
        className: {
            type: String,
            default: '',
        },
    },
    computed: {
        xlinkHref() {
            if (this.iconName) {
                return `#icon-${this.iconName}`;
            }
            return '#icon-search';
        },
        svgClass() {
            if (this.className) {
                return `k-svg-icon ${this.className}`;
            }
            return 'k-svg-icon';
        },
    },
};
</script>

<style scoped>
.k-svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

</style>
