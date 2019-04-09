<template>
    <div class="manager-index">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="order">
                <template slot="title">订单管理</template>
                <el-menu-item index="order-list">订单列表</el-menu-item>
                <el-menu-item index="order-history">历史订单</el-menu-item>
                <el-menu-item index="order-delete">删除记录</el-menu-item>
                <el-menu-item index="order-loss">流失单管理</el-menu-item>
            </el-submenu>

            <el-submenu index="pay-type">
                <template slot="title">支付类型</template>
                <el-menu-item index="pay-type-list">支付类型</el-menu-item>
                <el-menu-item index="pay-type-group-list">支付类型分组</el-menu-item>
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
            activeIndex: 'pay-type-list'
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath)
            const path = keyPath[1]
            this.activeIndex = path
            this.$router.push(`/manager/${path}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.manager-index {
    position: relative;
    padding-top: 60px;

    .el-menu {
        position: absolute;
        top: 0;
        width: 100%;
    }
}
</style>
