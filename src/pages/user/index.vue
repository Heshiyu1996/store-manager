<template>
    <div class="user-index">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="recharge-list">充值记录</el-menu-item>
            <el-menu-item index="consume-list">消费记录</el-menu-item>
        </el-menu>
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'user-index',
    data() {
        return {
            activeIndex: 'recharge'
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath)
            const path = keyPath.join('-')
            this.$router.push(`/user/${path}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.user-index {
}
</style>
