<template>
    <u-layout class="client-list" direction="v">
        <div class="top-wrapper">
            <u-layout>
                <el-select v-model="searchParams.accountType" filterable placeholder="请选择账号类型">
                    <el-option v-for="item in ACCOUNT_TYPE_MAP" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </u-layout>
            <u-layout class="operation">
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                    <el-button type="primary" icon="el-icon-plus" circle></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button type="warning" icon="el-icon-minus" circle></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="启用" placement="top">
                    <el-button type="success" icon="el-icon-check" circle></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="禁用" placement="top">
                    <el-button type="danger" icon="el-icon-close" circle></el-button>
                </el-tooltip>
            </u-layout>
        </div>

        <u-layout class="content-wrapper" direction="v">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="cardId" label="卡号"> </el-table-column>
                <el-table-column prop="cardType" label="卡种"> </el-table-column>
                <el-table-column prop="account" label="账号"> </el-table-column>
                <el-table-column prop="realName" label="姓名"> </el-table-column>
                <el-table-column prop="phone" label="手机"> </el-table-column>
                <el-table-column prop="birthday" label="生日">{{1}}</el-table-column>
                <el-table-column prop="userType" label="账号类型"> </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="{ row }">
                        <u-layout direction="h">
                            <i class="icon el-icon-edit" @click="editRow(row)"></i> <i class="icon el-icon-delete" @click="deleteRow(row)"></i>
                        </u-layout>
                    </template>
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
import { ACCOUNT_TYPE_MAP } from '@/utils/config'
import { getUserList } from '@/server/api'

export default {
    name: 'client-list',
    data() {
        return {
            searchParams: {
                currentPage: 1,
                pageSize: 50,
                order: 'desc',
                accountType: '' // 不传该字段则查全部；按照账号类型搜：0普通用户、1~5依次代表：店员、副店、店长、区域管理员、老板
            },

            tableData: [
                {
                    account: '',
                    birthday: 0,
                    cardId: '',
                    cardType: '',
                    phone: 0,
                    realName: '',
                    userType: ''
                }
            ],

            ACCOUNT_TYPE_MAP: [{ label: '所有用户', value: '' }].concat(ACCOUNT_TYPE_MAP)
        }
    },
    watch: {
        'searchParams.currentPage'() {
            this._getList(false)
        },
        'searchParams.pageSize'() {
            this._getList(true)
        }
    },
    created() {
        this._getList(true)
    },
    methods: {
        switchRow(row) {
            console.log(row)
        },
        editRow(row) {
            console.log(row)
        },
        deleteRow(row) {
            console.log(row)
        },
        _getList(isNew) {
            console.log('拉取列表，isNew：', isNew)
            isNew && (this.searchParams.currentPage = 1)

            getUserList(this.searchParams).then(data => {
                this.tableData = data || []
                this.totalCount = data.totalCount || 0
            })
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
.client-list {
    height: 100%;
    padding: 0 30px 40px;

    .top-wrapper {
        display: flex;
        height: 40px;
        justify-content: space-between;
        align-items: center;

        .el-button {
            margin-right: 0;
        }
    }

    .content-wrapper {
        .icon {
            font-size: 20px;
            cursor: pointer;
        }

        .el-pagination {
            text-align: right;
        }
    }
}
</style>
