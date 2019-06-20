<template>
    <u-layout class="user-list" direction="v">
        <div class="top-wrapper">
            <u-layout>
                <el-select v-model="searchParams.userType" filterable placeholder="请选择账号类型">
                    <el-option v-for="item in USER_TYPE_MAP" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                <u-input v-model.trim="searchParams.name" maxLength="100" placeholder="请输入姓名" searchIcon @key-press-enter="_getList" />
            </u-layout>
            <u-layout class="operation">
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                    <el-button type="primary" icon="el-icon-plus" circle @click="addPatch"></el-button>
                </el-tooltip>
            </u-layout>
        </div>

        <u-layout class="content-wrapper" direction="v">
            <u-table ref="operationTable" :list="userList" auto is-list>
                <template slot-scope="{ row }">
                    <u-table-column width="10vw" label="卡号" ellipse>
                        <u-link-text
                            :text="row.cardId || '-'"
                            :disabled="!row.cardId || !_hasRight(row.userType)"
                            @click="goConsumeDetail(row.cardId)"
                        ></u-link-text>
                    </u-table-column>
                    <u-table-column width="10vw" label="卡种" ellipse>{{ _findCardType(row.cardType) || '-' }}</u-table-column>
                    <u-table-column width="10vw" label="账号" ellipse>{{ row.account }}</u-table-column>
                    <u-table-column width="10vw" label="姓名" ellipse>{{ row.realName }}</u-table-column>
                    <u-table-column width="10vw" label="手机" ellipse> {{ row.phone }} </u-table-column>
                    <u-table-column width="10vw" label="生日">
                        {{ row.birthday | dateFormat }}
                    </u-table-column>
                    <u-table-column width="12vw" label="账号类型" ellipse>{{ _findUserType(row.userType) || '-' }}</u-table-column>
                    <u-table-column width="12vw" label="所属门店" ellipse>{{ row.storeName || '-' }}</u-table-column>
                    <u-table-column label="操作">
                        <u-layout v-show="_hasRight(row.userType)" direction="h">
                            <i class="icon el-icon-edit" @click="editRow(row)"></i> <i class="icon el-icon-delete" @click="deleteRow(row)"></i>
                        </u-layout>
                    </u-table-column>
                </template>
            </u-table>

            <el-pagination
                v-show="userList.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchParams.currentPage"
                :page-sizes="[10, 50, 100]"
                :page-size="searchParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="searchParams.totalCount"
            >
            </el-pagination>
        </u-layout>

        <AAddUserModal :visible="isOpenAddUserModal" @close="closeAddUserModal" />
        <AUserinfoModal :visible="isOpenUserInfoModal" @close="closeUserInfoModal" />
    </u-layout>
</template>

<script>
import AUserinfoModal from '@/components/account/a-userinfo-modal'
import AAddUserModal from '@/components/account/a-add-user-modal'
import { USER_TYPE_MAP, CARD_TYPE_MAP } from '@/utils/config'
import { getUserList, deleteUser } from '@/server/api'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')

export default {
    name: 'user-list',
    components: { AUserinfoModal, AAddUserModal },
    data() {
        return {
            searchParams: {
                userType: '', // 不传该字段则查全部；按照账号类型搜：0普通用户、1~5依次代表：店员、副店、店长、区域管理员、老板
                name: '',
                currentPage: 1,
                pageSize: 10,
                totalCount: 0
            },

            userList: [],

            isOpenUserInfoModal: false,
            isOpenAddUserModal: false,

            USER_TYPE_MAP: [{ label: '所有用户', value: '' }].concat(USER_TYPE_MAP)
        }
    },
    computed: {
        ...mapGetters(['getUserInfoStore'])
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
        goConsumeDetail(cardId) {
            this.$router.push({ name: 'user-card-list', params: { cardId } })
        },
        addPatch() {
            this.isOpenAddUserModal = true
        },
        editRow(row) {
            console.log(row)

            this.$bus.$emit('open-userinfo-modal', row)
            this.isOpenUserInfoModal = true
        },
        deleteRow(row) {
            console.log(row.account)
            this.$confirm(`是否删除用户 ${row.account} ？`).then(() =>
                deleteUser(row.account).then(() => {
                    this.$message('用户删除成功')
                    this._getList(false)
                })
            )
        },
        _getList(isNew) {
            console.log('拉取列表，isNew：', isNew)
            isNew && (this.searchParams.currentPage = 1)

            getUserList(this.searchParams).then(data => {
                this.userList = data.userList || []
                this.searchParams.totalCount = data.totalCount || 0
            })
        },
        _findUserType(utype) {
            if (typeof utype === 'undefined') return '-'
            let targetType = this.USER_TYPE_MAP.find(item => utype === item.value)
            return (targetType && targetType.label) || '-'
        },
        _findCardType(ctype) {
            if (ctype === null || typeof ctype === 'undefined' || ctype === 0) return '-'
            return CARD_TYPE_MAP.find(item => ctype === item.value).label
        },
        _hasRight(type) {
            if (typeof type === 'undefined') return false
            return this.getUserInfoStore.userType > type
        },
        // pageSize大小
        handleSizeChange(val) {
            this.searchParams.pageSize = val
        },
        // currentPage翻页
        handleCurrentChange(val) {
            this.searchParams.currentPage = val
        },
        closeUserInfoModal(isSuccess) {
            this.isOpenUserInfoModal = false
            isSuccess && this._getList(false)
        },
        closeAddUserModal(isSuccess) {
            this.isOpenAddUserModal = false
            isSuccess && this._getList(false)
        }
    }
}
</script>

<style lang="scss" scoped>
.user-list {
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
