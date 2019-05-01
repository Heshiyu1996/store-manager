<template>
    <u-layout class="client-list" direction="v">
        <div class="top-wrapper">
            <u-layout>
                <el-select v-model="searchParams.userType" filterable placeholder="请选择账号类型">
                    <el-option v-for="item in USER_TYPE_MAP" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
            <u-table ref="operationTable" :list="userList" auto is-list>
                <template slot-scope="{ row }">
                    <u-table-column width="12vw" label="卡号" ellipse>{{ row.cardId || '-' }}</u-table-column>
                    <u-table-column width="12vw" label="卡种" ellipse>{{ row.cardType || '-' }}</u-table-column>
                    <u-table-column width="12vw" label="账号" ellipse>{{ row.account }}</u-table-column>
                    <u-table-column width="12vw" label="姓名" ellipse>{{ row.realName }}</u-table-column>
                    <u-table-column width="12vw" label="手机" ellipse> {{ row.phone }} </u-table-column>
                    <u-table-column width="12vw" label="生日">
                        {{ row.birthday | dateFormat }}
                    </u-table-column>
                    <u-table-column width="12vw" label="账号类型" ellipse>{{ _findUserType(row.userType) || '-' }}</u-table-column>
                    <u-table-column label="操作">
                        <u-layout direction="h">
                            <i class="icon el-icon-edit" @click="editRow(row)"></i> <i class="icon el-icon-delete" @click="deleteRow(row)"></i>
                        </u-layout>
                    </u-table-column>
                </template>
            </u-table>

            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchParams.currentPage"
                :page-sizes="[10, 50, 100]"
                :page-size="searchParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="userList.length"
            >
            </el-pagination>
        </u-layout>
    </u-layout>
</template>

<script>
import { USER_TYPE_MAP } from '@/utils/config'
import { getUserList } from '@/server/api'

export default {
    name: 'client-list',
    data() {
        return {
            searchParams: {
                currentPage: 1,
                pageSize: 50,
                order: 'desc',
                userType: '' // 不传该字段则查全部；按照账号类型搜：0普通用户、1~5依次代表：店员、副店、店长、区域管理员、老板
            },

            userList: [{}],

            USER_TYPE_MAP: [{ label: '所有用户', value: '' }].concat(USER_TYPE_MAP)
        }
    },
    watch: {
        'searchParams.userType'() {
            this._getList(false)
        },
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
                this.userList = data || []
                this.totalCount = data.totalCount || 0
            })
        },
        _findUserType(type) {
            if (typeof type === 'undefined') return '-'
            return this.USER_TYPE_MAP.find(item => type === item.value).label
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
