<template>
    <nav class="u-filterbar">
        <u-layout direction="h" class="filter-wrapper">
            <el-select v-model="value" placeholder="请选择门店">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-select v-model="value" placeholder="请选择门店">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
        </u-layout>
    </nav>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            options: [
                {
                    value: '1',
                    label: '门店一'
                },
                {
                    value: '2',
                    label: '门店二'
                }
            ],
            value: ''
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.u-filterbar {
}
</style>
