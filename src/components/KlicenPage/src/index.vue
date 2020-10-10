<template>
    <div
        class="klc-m-page"
        :class="{'klc-m-page-right': rendered}"
    >
        <slot></slot>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                rendered: false,
            };
        },
        mounted() {
            setTimeout(() => {
                this.rendered = true;
            }, 50);
        },
    };
</script>
<style scoped>
    .klc-m-page {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        transform: rotateY(90deg);
        transform-origin: 100% 0;
        background-color: white;
        transform-style: preserve-3d;
        transition: transform .3s ease-in-out;
    }

    .klc-m-page-right{
        transform: rotateY(0);
    }
</style>
