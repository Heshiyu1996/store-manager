<template>
    <div class="u-error" v-show="canValidator && visible">{{ text }}</div>
</template>

<script>
export default {
    props: {
        visible: { type: Boolean, default: false },
        text: { type: String, default: '' }
    },
    data() {
        return {
            // validator初始化即会验证，但界面不应该出现报错，故设置以下值解决该问题
            canValidator: false
        }
    },
    watch: {
        visible() {
            this.canValidator = true
        }
    }
}
</script>

<style lang="scss" scoped>
.u-error {
    position: absolute;
    height: 14px;
    line-height: 14px;
    @include font-normal(12px, $error-color);
}
</style>
