<template>
    <u-layout class="wx-index" direction="v">
        <u-navbar-mobile />
        <router-view />
    </u-layout>
</template>

<script>
export default {
    name: 'wx-index',
    data() {
        return {}
    },
    created() {},
    methods: {}
}
</script>

<style lang="scss" scoped>
.wx-index {
    position: relative;
}
</style>
