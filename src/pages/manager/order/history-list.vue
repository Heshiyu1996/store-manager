<template>
    <u-layout class="history-list" direction="v">
        <div class="top-wrapper">
            <u-layout class="filter">
                <el-select v-model="searchParams.storeId" filterable placeholder="请选择门店">
                    <el-option v-for="item in storeListModified" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
                <el-select v-model="searchParams.isStarted" placeholder="请选择订单开始状态">
                    <el-option v-for="item in IS_STARTED_MAP" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                <el-select v-model="searchParams.isDeleted" placeholder="请选择订单删除状态">
                    <el-option v-for="item in IS_DELETED_MAP" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                <u-input v-model.number="searchParams.phone" maxLength="100" placeholder="请输入预约电话" searchIcon @key-press-enter="_getList" />
            </u-layout>
        </div>
        <u-layout class="content-wrapper" direction="v">
            <u-table ref="operationTable" :list="list" auto is-list>
                <template slot-scope="{ row }">
                    <u-table-column width="11vw" label="主题" ellipse>
                        {{ row.theme || '-' }}
                    </u-table-column>
                    <u-table-column width="8vw" label="预约电话" ellipse>{{ row.phone || '-' }}</u-table-column>
                    <u-table-column width="11vw" label="预约时间" ellipse>{{ row.arrangeTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}</u-table-column>
                    <u-table-column width="6vw" label="人数" ellipse>{{ row.arrangeNum || '-' }}</u-table-column>
                    <u-table-column width="6vw" label="实际支付金额" ellipse>{{ row.amount || '-' }}</u-table-column>
                    <u-table-column width="14vw" label="创建时间" ellipse>{{ row.createTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}</u-table-column>
                    <u-table-column width="14vw" label="删除时间" ellipse>{{ row.deleteTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}</u-table-column>
                    <u-table-column width="4vw" label="游戏开始状态" ellipse>
                        <span v-if="row.isStarted" class="order-type" type="started">已开始</span>
                        <span v-else class="order-type" type="not-started">未开始</span>
                    </u-table-column>
                    <u-table-column width="4vw" label="订单状态" ellipse>
                        <span v-if="row.isDeleted" class="order-type" type="deleted">已删除</span>
                        <span v-else class="order-type" type="not-deleted">未删除</span>
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

        <KKeyinfoModal :visible="isOpenKeyInfoModal" @close="closeKeyInfoModal" />
    </u-layout>
</template>

<script>
import KKeyinfoModal from '@/components/key/key-info-modal'
import { getOrderHistoryList, deleteKey, updateKeyStatus } from '@/server/api'
import { MODIFY_MODAL_TYPE, OPERATION_TYPE } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')
const IS_STARTED_MAP = [
    {
        value: '',
        label: '全部'
    },
    {
        value: true,
        label: '已开始'
    },
    {
        value: false,
        label: '未开始'
    }
]
const IS_DELETED_MAP = [
    {
        value: '',
        label: '全部'
    },
    {
        value: true,
        label: '已删除'
    },
    {
        value: false,
        label: '未删除'
    }
]

export default {
    name: 'history-list',
    components: { KKeyinfoModal },
    data() {
        return {
            searchParams: {
                storeId: '',
                isStarted: '',
                isDeleted: '',
                name: '',

                currentPage: 1,
                pageSize: 50
            },

            list: [],

            isOpenKeyInfoModal: false,

            IS_STARTED_MAP,
            IS_DELETED_MAP,
            OPERATION_TYPE
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
        'searchParams.isStarted'() {
            this._getList(true)
        },
        'searchParams.isDeleted'() {
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
                    updateKeyStatus({ ids: params, status: isOpen }).then(() => {
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
            this.isOpenKeyInfoModal = true
            this.$bus.$emit('open-key-info-modal', {}, MODIFY_MODAL_TYPE.ADD)
        },
        editRow(row) {
            console.log(row)

            this.$bus.$emit('open-key-info-modal', row, MODIFY_MODAL_TYPE.EDIT)
            this.isOpenKeyInfoModal = true
        },
        deleteRow(...ids) {
            this.$confirm(`是否删除所选钥匙 ？`).then(() =>
                deleteKey({ ids }).then(() => {
                    this.$message('删除成功')
                    this._getList(false)
                })
            )
        },
        _getList(isNew) {
            console.log('拉取列表，isNew：', isNew)
            isNew && (this.searchParams.currentPage = 1)
            getOrderHistoryList(this.searchParams)
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
        closeKeyInfoModal(isSuccess) {
            this.isOpenKeyInfoModal = false
            isSuccess && this._getList(false)
        }
    }
}
</script>

<style lang="scss" scoped>
.history-list {
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
        .u-table-column {
            line-height: 26px;
        }

        .icon {
            font-size: 20px;
            cursor: pointer;
        }

        .el-pagination {
            text-align: right;
        }

        .order-type {
            display: inline-block;
            height: 100%;
            width: 50px;
            margin-right: 5px;
            text-align: center;
            line-height: 24px;
            border-radius: 4px;
            vertical-align: middle;
            background: $black;
            @include font-normal(12px, $white);
            box-sizing: content-box;

            &[type='started'] {
                background: $primary-color;
                @include font-normal(12px, $white);
            }

            &[type='not-started'] {
                background: $white;
                @include font-normal(12px, $primary-color);
                border: 1px solid $primary-color;
            }

            &[type='deleted'] {
                background: $error-color;
                @include font-normal(12px, $white);
                border: 1px solid $white;
            }

            &[type='not-deleted'] {
                background: $white;
                @include font-normal(12px, $error-color);
                border: 1px solid $error-color;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>
