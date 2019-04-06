<template>
    <div class="manager-index">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="order">
                <template slot="title">订单管理</template>
                <el-menu-item index="list">订单列表</el-menu-item>
                <el-menu-item index="history">历史订单</el-menu-item>
                <el-menu-item index="delete">删除记录</el-menu-item>
                <el-menu-item index="loss">流失单管理</el-menu-item>
            </el-submenu>

            <el-submenu index="2">
                <template slot="title">支付类型</template>
                <el-menu-item index="2-1">类型列表</el-menu-item>
                <el-menu-item index="2-2">分组列表</el-menu-item>
            </el-submenu>

            <el-menu-item index="3">失信名单</el-menu-item>
            <el-menu-item index="4">主题管理</el-menu-item>

            <el-submenu index="5">
                <template slot="title">密室统计</template>
                <el-menu-item index="5-1">收入统计</el-menu-item>
                <el-menu-item index="5-2">订单统计</el-menu-item>
            </el-submenu>

            <el-menu-item index="6">员工信息</el-menu-item>
            <el-menu-item index="7">客户来源</el-menu-item>
            <el-menu-item index="8">钥匙管理</el-menu-item>
            <el-menu-item index="9">目标管理</el-menu-item>

            <el-submenu index="10">
                <template slot="title">物料管理</template>
                <el-menu-item index="10-1">库位管理</el-menu-item>
                <el-menu-item index="10-2">库存管理</el-menu-item>
                <el-menu-item index="10-2">出库单</el-menu-item>
                <el-menu-item index="10-2">入库单</el-menu-item>
            </el-submenu>
            <el-menu-item index="client">会员系统</el-menu-item>
        </el-menu>
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'manager-index',
    data() {
        return {
            activeIndex: '1'
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath)
            const path = keyPath.join('-')
            this.$router.push(`/manager/${path}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.manager-index {
}
</style>
