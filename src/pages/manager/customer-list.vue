<template>
    <u-layout class="customer-list" direction="v">
        <div class="top-wrapper">
            <u-layout class="filter">
                <el-select v-model="searchParams.storeId" filterable placeholder="请选择门店">
                    <el-option v-for="item in storeListModified" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
                <el-select v-model="searchParams.status" placeholder="请选择使用状态">
                    <el-option v-for="item in STATUS_LIST" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                <u-input v-model.trim="searchParams.name" maxLength="100" placeholder="请输入名称" searchIcon @key-press-enter="_getList" />
            </u-layout>
            <u-layout class="operation">
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                    <el-button type="primary" icon="el-icon-plus" circle @click="addPatch"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button type="warning" icon="el-icon-minus" circle @click="updateRows(OPERATION_TYPE.DELETE)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="启用" placement="top">
                    <el-button type="success" icon="el-icon-check" circle @click="updateRows(OPERATION_TYPE.OPEN)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="禁用" placement="top">
                    <el-button type="danger" icon="el-icon-close" circle @click="updateRows(OPERATION_TYPE.CLOSE)"></el-button>
                </el-tooltip>
            </u-layout>
        </div>
        <u-layout class="content-wrapper" direction="v">
            <u-table ref="operationTable" :list="list" auto is-list>
                <template slot-scope="{ row }">
                    <u-table-column width="2vw" label="" ellipse><el-checkbox v-model="row.checked"/></u-table-column>
                    <u-table-column width="16vw" label="来源名称" ellipse>{{ row.name || '-' }}</u-table-column>
                    <u-table-column width="16vw" label="来源类别" ellipse>{{ SOURCE_TYPE_MAP[row.sourceType] || '-' }}</u-table-column>
                    <u-table-column width="16vw" label="所属门店" ellipse>{{ row.storeName || '-' }}</u-table-column>
                    <u-table-column width="12vw" label="使用状态" ellipse>
                        <el-switch v-model="row.status" @change="switchRow(row)" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
                    </u-table-column>
                    <u-table-column width="26vw" label="操作">
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

        <CCustomerInfoModal :visible="isOpenCustomerInfoModal" @close="closeCustomerInfoModal" />
    </u-layout>
</template>

<script>
import CCustomerInfoModal from '@/components/customer/customer-info-modal'
import { getCustomerList, deleteCustomer, updateCustomerStatus } from '@/server/api'
import { MODIFY_MODAL_TYPE, STATUS_LIST, OPERATION_TYPE } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')
const SOURCE_TYPE_MAP = {
    1: '线上',
    2: '线下'
}

export default {
    name: 'customer-list',
    components: { CCustomerInfoModal },
    data() {
        return {
            searchParams: {
                storeId: '',
                status: '', // 不传则启用、禁用都查。false:查禁用；true:查启用
                name: '',

                currentPage: 1,
                pageSize: 50
            },

            list: [],

            isOpenCustomerInfoModal: false,

            STATUS_LIST,
            OPERATION_TYPE,
            SOURCE_TYPE_MAP
        }
    },
    computed: {
        storeListModified() {
            return [{ id: '', name: '所有门店' }].concat(this.getStoreListStore)
        },
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
        },
        'searchParams.status'() {
            this._getList(true)
        }
    },
    created() {
        this._getList(true)
    },
    methods: {
        switchRow(row) {
            console.log(row)
            this.updateRows(OPERATION_TYPE[row.status ? 'OPEN' : 'CLOSE'], [row.id])
        },
        updateRows(otype, id) {
            let params = id || this._fetchSelectedRows()
            switch (otype) {
                case OPERATION_TYPE.DELETE:
                    this.deleteRow(...params)
                    break
                case OPERATION_TYPE.OPEN:
                case OPERATION_TYPE.CLOSE:
                    var isOpen = otype === OPERATION_TYPE.OPEN
                    updateCustomerStatus({ ids: params, status: isOpen }).then(() => {
                        this.$message(`${isOpen ? '启用' : '禁用'} 成功`)
                        this._getList(true)
                    })
                    break
            }
        },
        _fetchSelectedRows() {
            let delList = this.list.filter(item => item.checked).map(item => item.id)
            console.log(delList)
            return delList
        },
        addPatch() {
            this.isOpenCustomerInfoModal = true
            this.$bus.$emit('open-customer-info-modal', {}, MODIFY_MODAL_TYPE.ADD)
        },
        editRow(row) {
            console.log(row)

            this.$bus.$emit('open-customer-info-modal', row, MODIFY_MODAL_TYPE.EDIT)
            this.isOpenCustomerInfoModal = true
        },
        deleteRow(...ids) {
            this.$confirm(`是否删除所选客户来源 ？`).then(() =>
                deleteCustomer({ ids }).then(() => {
                    this.$message('删除成功')
                    this._getList(false)
                })
            )
        },
        _getList(isNew) {
            console.log('拉取列表，isNew：', isNew)
            isNew && (this.searchParams.currentPage = 1)
            getCustomerList(this.searchParams)
                .then(data => {
                    this.list = data.list || []
                    this.list.forEach(item => this.$set(item, 'checked', false))
                    this.totalCount = data.totalCount || 0
                })
                .catch(e => console.log(e))
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
        },
        closeCustomerInfoModal(isSuccess) {
            this.isOpenCustomerInfoModal = false
            isSuccess && this._getList(false)
        }
    }
}
</script>

<style lang="scss" scoped>
.customer-list {
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
