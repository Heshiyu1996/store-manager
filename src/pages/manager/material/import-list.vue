<template>
    <u-layout class="import-list" direction="v">
        <div class="top-wrapper">
            <u-layout>
                <el-select v-model="searchParams.storeId" filterable placeholder="请选择门店">
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
                <u-input v-model.trim="searchParams.name" maxLength="100" placeholder="请输入物料名称" searchIcon @key-press-enter="_getList" />
            </u-layout>
            <u-layout class="operation">
                <el-tooltip v-if="searchParams.storeId" class="item" effect="dark" content="添加" placement="top">
                    <el-button type="primary" icon="el-icon-plus" circle @click="addPatch"></el-button>
                </el-tooltip>
            </u-layout>
        </div>

        <u-layout class="content-wrapper" direction="v">
            <u-table ref="operationTable" :list="list" auto is-list :emptyTip="!searchParams.storeId ? '请选择指定门店后再进行查看~' : '该门店下暂无数据记录'">
                <template slot-scope="{ row }">
                    <u-table-column width="14vw" label="物料名称" ellipse>{{ row.itemName || '-' }}</u-table-column>
                    <u-table-column width="14vw" label="申请数量" ellipse> {{ row.amount }} </u-table-column>
                    <u-table-column width="14vw" label="申请人员" ellipse>{{ row.applicantName || '-' }}</u-table-column>
                    <u-table-column width="14vw" label="所属仓库" ellipse>{{ row.houseName || '-' }}</u-table-column>
                    <u-table-column width="14vw" label="创建时间" ellipse> {{ row.createTime | dateFormat('yyyy-MM-dd hh:mm:ss') }} </u-table-column>
                    <u-table-column width="14vw" label="所属门店" ellipse> {{ row.storeName }} </u-table-column>
                    <u-table-column label="操作">
                        <u-layout direction="h">
                            <i class="icon el-icon-edit" @click="editRow(row)"></i> <i class="icon el-icon-delete" @click="deleteRow(row.id)"></i>
                        </u-layout>
                    </u-table-column>
                </template>
            </u-table>

            <el-pagination
                v-show="list.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchParams.currentPage"
                :page-sizes="[10, 50, 100]"
                :page-size="searchParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="list.length"
            >
            </el-pagination>
        </u-layout>

        <MImportInfoModal :visible="isOpenMaterialImportInfoModal" :otherList="otherList" @close="closeMaterialImportInfoModal" />
    </u-layout>
</template>

<script>
import MImportInfoModal from '@/components/material/import-info-modal'
import { MODIFY_MODAL_TYPE, OPERATION_TYPE } from '@/utils/config'
import { getMaterialImportList, deleteMaterialImport, getOtherList } from '@/server/api'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')

export default {
    name: 'import-list',
    components: { MImportInfoModal },
    data() {
        return {
            searchParams: {
                storeId: '',
                name: '',

                currentPage: 1,
                pageSize: 50
            },

            list: [],
            otherList: [],

            isOpenMaterialImportInfoModal: false,

            OPERATION_TYPE
        }
    },
    computed: {
        ...mapGetters(['getStoreListStore'])
    },
    watch: {
        'searchParams.currentPage'() {
            this._getList(false)
        },
        'searchParams.pageSize'() {
            this._getList(true)
        },
        'searchParams.storeId'() {
            this._getList(true)
            this._getOtherList()
        },
        getStoreListStore: {
            handler(storeList) {
                this.searchParams.storeId = (storeList[0] && storeList[0].id) || ''
            },
            immediate: true
        }
    },
    methods: {
        addPatch() {
            let noMaterial = this.otherList['materialItemList'] && !this.otherList['materialItemList'].length
            if (noMaterial) {
                this.$message('该门店下物料为空，无法入库')
                return
            }
            let { storeId } = this.searchParams
            this.$bus.$emit('open-material-import-info-modal', { storeId }, MODIFY_MODAL_TYPE.ADD)
            this.isOpenMaterialImportInfoModal = true
        },
        editRow(row) {
            this.$bus.$emit('open-material-import-info-modal', row, MODIFY_MODAL_TYPE.EDIT)
            this.isOpenMaterialImportInfoModal = true
        },
        deleteRow(id) {
            this.$confirm(`是否删除所选入库记录 ？`).then(() =>
                deleteMaterialImport(id).then(() => {
                    this.$message('删除成功')
                    this._getList(false)
                })
            )
        },
        _getList(isNew) {
            isNew && (this.searchParams.currentPage = 1)

            getMaterialImportList(this.searchParams).then(data => {
                this.list = data.list || []
                this.list.forEach(item => this.$set(item, 'checked', false))
                this.totalCount = data.totalCount || 0
            })
        },
        _getOtherList() {
            getOtherList(this.searchParams)
                .then(data => {
                    this.otherList = data || {}
                    console.log(this.otherList)
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
        closeMaterialImportInfoModal(isSuccess) {
            this.isOpenMaterialImportInfoModal = false
            isSuccess && this._getList(false)
        }
    }
}
</script>

<style lang="scss" scoped>
.import-list {
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
