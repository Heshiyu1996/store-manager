<template>
    <u-layout class="store-list" direction="v">
        <div class="top-wrapper">
            <u-layout class="operation">
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                    <el-button type="primary" icon="el-icon-plus" circle @click="addPatch"></el-button>
                </el-tooltip>
            </u-layout>
        </div>
        <u-layout class="content-wrapper" direction="v">
            <u-table ref="operationTable" :list="storeList" auto is-list>
                <template slot-scope="{ row }">
                    <u-table-column width="18vw" label="id" ellipse>{{ row.id || '-' }}</u-table-column>
                    <u-table-column width="18vw" label="门店名称" ellipse>{{ row.name || '-' }}</u-table-column>
                    <u-table-column width="18vw" label="电话" ellipse>{{ row.telephone || '-' }}</u-table-column>
                    <u-table-column width="18vw" label="地址" ellipse>{{ row.address || '-' }}</u-table-column>
                    <u-table-column width="18vw" label="操作">
                        <u-layout direction="h">
                            <i class="icon el-icon-edit" @click="editRow(row)"></i> <i class="icon el-icon-delete" @click="deleteRow(row)"></i>
                        </u-layout>
                    </u-table-column>
                </template>
            </u-table>

            <el-pagination
                v-show="storeList.length"
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

        <SStoreinfoModal :visible="isOpenStoreInfoModal" @close="closeStoreInfoModal" />
    </u-layout>
</template>

<script>
import SStoreinfoModal from '@/components/store/s-store-info-modal'
import { getStoreList, deleteStore } from '@/server/api'
import { MODIFY_MODAL_TYPE } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapActions } = createNamespacedHelpers('login')

export default {
    name: 'store-list',
    components: { SStoreinfoModal },
    data() {
        return {
            searchParams: {
                currentPage: 1,
                pageSize: 10,
                totalCount: 0
            },

            storeList: [],

            isOpenStoreInfoModal: false
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
        addPatch() {
            this.isOpenStoreInfoModal = true
            this.$bus.$emit('open-store-info-modal', {}, MODIFY_MODAL_TYPE.ADD)
        },
        editRow(row) {
            console.log(row)

            this.$bus.$emit('open-store-info-modal', row, MODIFY_MODAL_TYPE.EDIT)
            this.isOpenStoreInfoModal = true
        },
        deleteRow(row) {
            console.log(row)
            this.$confirm(`是否删除门店 ${row.name} ？`).then(() =>
                deleteStore(row.id).then(() => {
                    this.$message('门店删除成功')
                    this._getList(false)
                })
            )
        },
        _getList(isNew) {
            console.log('拉取列表，isNew：', isNew)
            isNew && (this.searchParams.currentPage = 1)
            getStoreList(this.searchParams)
                .then(data => {
                    this.storeList = data.list || []
                    this.searchParams.totalCount = data.totalCount || 0
                    this.actSetStoreListStore(this.storeList)
                })
                .catch(e => console.log(e))
        },
        // pageSize大小
        handleSizeChange(val) {
            this.searchParams.pageSize = val
        },
        // currentPage翻页
        handleCurrentChange(val) {
            this.searchParams.currentPage = val
        },
        closeStoreInfoModal(isSuccess) {
            this.isOpenStoreInfoModal = false
            isSuccess && this._getList(false)
        },
        closeAddUserModal(isSuccess) {
            this.isOpenStoreInfoModal = false
            isSuccess && this._getList(false)
        },
        ...mapActions(['actSetStoreListStore'])
    }
}
</script>

<style lang="scss" scoped>
.store-list {
    height: 100%;
    padding: 0 30px 40px;

    .top-wrapper {
        display: flex;
        height: 40px;
        justify-content: flex-end;
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
