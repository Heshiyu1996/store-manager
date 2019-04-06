<template>
    <div class="main">
        <u-navbar></u-navbar>
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'list-main',
    data() {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.main {
    padding: 0 20px;
}
</style>
