<template>
    <u-layout class="manager-index" direction="v">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <template v-for="subMenu in MENU_LIST">
                <template v-if="subMenu.subMenuItemList.length !== 0">
                    <el-submenu :key="subMenu.id" :index="subMenu.subMenuInfo.value">
                        <template slot="title">{{ subMenu.subMenuInfo.label }}</template>
                        <el-menu-item :index="item.value" v-for="item in subMenu.subMenuItemList" :key="item.id">{{ item.label }}</el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :key="subMenu.id" :index="subMenu.subMenuInfo.value">{{ subMenu.subMenuInfo.label }}</el-menu-item>
                </template>
            </template>
        </el-menu>

        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="path in crumbPath" :key="path.id">{{ path }}</el-breadcrumb-item>
        </el-breadcrumb>

        <router-view />
    </u-layout>
</template>

<script>
import { MENU_LIST } from '@/utils/config'

export default {
    name: 'manager-index',
    data() {
        return {
            activeIndex: 'pay-type-list',
            fullPath: [],

            MENU_LIST
        }
    },
    created() {
        console.log(this.$route)
        this.routeName = this.$route.name
    },
    computed: {
        crumbPath() {
            let arr = []
            MENU_LIST.map(subMenu => {
                if (subMenu.subMenuInfo.value === this.activeIndex) {
                    arr.push(subMenu.subMenuInfo.label)
                } else {
                    subMenu.subMenuItemList && subMenu.subMenuItemList.forEach(item => {
                        if (item.value === this.activeIndex) {
                            arr.push(subMenu.subMenuInfo.label)
                            arr.push(item.label)
                        }
                    })
                }
            })
            return arr
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath)
            // this.fullPath = [ ...keyPath ]
            const path = [ ...keyPath ].pop()
            this.activeIndex = path
            console.log(this.activeIndex)
            this.$router.push(`/manager/${path}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.manager-index {
    position: relative;

    .el-breadcrumb {
        padding-left: 40px;
    }
}
</style>
