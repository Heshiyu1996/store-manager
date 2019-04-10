<template>
    <u-layout class="pay-list" direction="v">
        <u-layout class="filter-wrapper">
            <el-select v-model="searchParams.storeId" filterable placeholder="请选择门店">
                <el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-select v-model="searchParams.useStatus" placeholder="请选择使用状态">
                <el-option v-for="item in useStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <u-input v-model.trim="searchParams.searchContent" maxLength="100" placeholder="请输入支付类型" />
        </u-layout>

        <u-layout class="content-wrapper" direction="v">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="payTypeName" label="支付类型名称" width="180"> </el-table-column>
                <el-table-column prop="payTypeGroupName" label="支付类型分组" width="180"> </el-table-column>
                <el-table-column prop="payTypeNum" label="支付类型编码"> </el-table-column>
                <el-table-column prop="settlementPrice" label="结算价"> </el-table-column>
                <el-table-column prop="orderNum" label="排序号" width="70"> </el-table-column>
                <el-table-column prop="storeName" label="所属门店" width="200" show-overflow-tooltip> </el-table-column>
                <el-table-column prop="useStatus" label="使用状态" width="80">
                    <template slot-scope="{ row }">
                        <el-switch v-model="row.useStatus" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <u-layout direction="h"> <i class="icon el-icon-edit"></i> <i class="icon el-icon-delete"></i> </u-layout>
                </el-table-column>
            </el-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchParams.currentPage"
                :page-sizes="[10, 50, 100]"
                :page-size="searchParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.length"
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
            searchParams: {
                storeId: '1',
                useStatus: '1',
                searchContent: '',
                currentPage: 1,
                pageSize: 50
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
                    storeId: 1,
                    useStatus: false
                },
                {
                    payTypeId: 2,
                    payTypeName: '补差价现金',
                    payTypeNum: '888',
                    payTypeGroupName: '支付类型分组2',
                    settlementPrice: 2.0,
                    orderNum: 2,
                    storeName: '大笨象密室深圳一店',
                    storeId: 1,
                    useStatus: true
                }
            ]
        }
    },
    watch: {
        'searchParams.storeId'() {
            this._getVariableList(true)
        },
        'searchParams.useStatus'() {
            this._getVariableList(false)
        },
        'searchParams.currentPage'() {
            this._getVariableList(false)
        }
    },
    methods: {
        _getList(isNew) {
            console.log('拉取列表，isNew：', isNew)
            // this.searchKeyword = this.searchParams.searchContent
            // isNew && (this.searchParams.currentPage = 1)
            // sortType && (this.searchParams.sortType = sortType)
            // order && (this.searchParams.order = order)

            // getList(this.searchParams).then(data => {
            //     this.intentionList = data.dialogueList || []
            //     this.totalCount = data.totalCount || 0
            //     this._combindNames()
            // })
        },
        // 多选
        handleSelectionChange(val) {
            this.multipleSelection = val
            console.log(this.multipleSelection)
        },
        // pageSize大小
        handleSizeChange(val) {
            this.searchParams.pageSize = val
            console.log(`每页 ${val} 条`)
        },
        // currentPage翻页
        handleCurrentChange(val) {
            this.searchParams.currentPage = val
            console.log(`当前页: ${val}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.pay-list {
    height: 100%;
    padding: 0 30px 40px;

    .filter-wrapper {
        display: flex;
        height: 40px;
        align-items: center;
    }

    .content-wrapper {
        .icon {
            font-size: 20px;
        }

        .el-pagination {
            text-align: right;
        }
    }
}
</style>
