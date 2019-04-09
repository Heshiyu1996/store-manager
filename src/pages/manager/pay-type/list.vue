<template>
    <u-layout class="pay-list" direction="v">
        <u-layout class="filter-wrapper">
            <el-select v-model="searchParam.store" filterable placeholder="请选择门店">
                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-select v-model="searchParam.useStatus" placeholder="请选择使用状态">
                <el-option v-for="item in useStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <u-input v-model.trim="searchParam.searchContent" maxLength="100" placeholder="请输入支付类型" />
        </u-layout>

        <u-layout class="content-wrapper" direction="v">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column label="序号" width="120">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column prop="payTypeGroupName" label="支付类型分组"> </el-table-column>
                <el-table-column prop="payTypeName" label="支付类型名称"> </el-table-column>
                <el-table-column prop="payTypeNum" label="支付类型编码"> </el-table-column>
                <el-table-column prop="settlementPrice" label="结算价"> </el-table-column>
                <el-table-column prop="orderNum" label="排序号"> </el-table-column>
                <el-table-column prop="storeName" label="所属门店"> </el-table-column>
                <!-- <el-table-column prop="payTypeGroupName" label="查看" width="120"> </el-table-column>
                <el-table-column prop="storeName" label="支付类型名称" show-overflow-tooltip> </el-table-column> -->
            </el-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400"
            >
            </el-pagination>
        </u-layout>
    </u-layout>
</template>

<script>
export default {
    name: 'pay-list',
    data() {
        return {
            searchParam: {
                store: '1',
                useStatus: '1',
                searchContent: ''
            },

            useStatusList: [
                {
                    value: '1',
                    label: '全部状态'
                },
                {
                    value: '2',
                    label: '启用'
                },
                {
                    value: '3',
                    label: '禁用'
                }
            ],
            storeList: [
                {
                    value: '1',
                    label: '大笨象密室深圳一店'
                },
                {
                    value: '2',
                    label: '大笨象密室深圳二店'
                },
                {
                    value: '3',
                    label: '大笨象密室深圳三店'
                }
            ],

            tableData: [
                {
                    payTypeId: 1,
                    payTypeName: '补差价哆啦宝',
                    payTypeNum: '222223',
                    payTypeGroupName: '支付类型分组1',
                    settlementPrice: 1.0,
                    orderNum: 5,
                    storeName: '大笨象密室深圳一店',
                    storeId: 1
                },
                {
                    payTypeId: 2,
                    payTypeName: '补差价现金',
                    payTypeNum: '888',
                    payTypeGroupName: '支付类型分组2',
                    settlementPrice: 2.0,
                    orderNum: 2,
                    storeName: '大笨象密室深圳一店',
                    storeId: 1
                }
            ],
            currentPage4: 4
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val
            console.log(this.multipleSelection)
        },

        handleSizeChange(val) {
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.pay-list {
    height: 100%;
    padding: 30px 40px;

    .filter-wrapper {
        display: flex;
        height: 40px;
        align-items: center;
    }

    .content-wrapper {
        .el-pagination {
            text-align: right;
        }
    }
}
</style>
