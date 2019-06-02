<template>
    <u-layout class="arrange-list" direction="v">
        <div class="top-wrapper">
            <u-layout class="filter">
                <el-select v-model="searchParams.storeId" filterable placeholder="请选择门店">
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
                <el-date-picker v-model="searchParams.date" type="date" placeholder="请输入查询时间" size="medium"> </el-date-picker>
            </u-layout>
            <u-layout v-if="searchParams.storeId" class="operation">
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                    <el-button type="primary" icon="el-icon-plus" circle @click="addPatch(searchParams.storeId)"></el-button>
                </el-tooltip>
            </u-layout>
        </div>
        <u-layout class="content-wrapper" direction="v">
            <u-table ref="operationTable" :list="list" auto is-list>
                <template slot-scope="{ row }">
                    <u-table-column label="时间" ellipse>
                        {{ row.hour }}
                    </u-table-column>
                    <u-table-column v-for="theme in otherList['themeList']" :key="theme.id" :label="theme.name" width="18vw" ellipse>
                        <ArrangeInfoCard
                            :arrange-info="row[theme.id]"
                            :theme-id="theme.id"
                            :store-id="searchParams.storeId"
                            @add-patch="(storeId, id) => addPatch(storeId, id)"
                            @edit-row="editRow"
                            @delete-row="deleteRow"
                            @start-row="startRow"
                        ></ArrangeInfoCard>
                    </u-table-column>
                </template>
            </u-table>
        </u-layout>

        <ArrangeInfoModal :visible="isOpenArrangeInfoModal" :otherList="otherList" @close="closeArrangeInfoModal" />
    </u-layout>
</template>

<script>
import ArrangeInfoModal from '@/components/order/arrange-info-modal'
import ArrangeInfoCard from '@/components/order/arrange-info-card'
import { getReserveList, deleteReserve, startReserve, getOrderOtherList } from '@/server/api'
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
    name: 'arrange-list',
    components: { ArrangeInfoModal, ArrangeInfoCard },
    data() {
        return {
            searchParams: {
                storeId: '',
                date: new Date(new Date().toLocaleDateString())
            },
            list: [],
            themeList: [],

            otherList: {},

            isOpenArrangeInfoModal: false,

            IS_STARTED_MAP,
            IS_DELETED_MAP,
            OPERATION_TYPE
        }
    },
    computed: {
        ...mapGetters(['getStoreListStore'])
    },
    watch: {
        'searchParams.storeId'() {
            this._getList()
            this._getOtherList()
        },
        'searchParams.date'() {
            this._getList()
        },
        getStoreListStore(storeList) {
            this.searchParams.storeId = (storeList && storeList[0].id) || ''
        }
    },
    methods: {
        addPatch(storeId, themeId) {
            this.isOpenArrangeInfoModal = true
            this.$bus.$emit('open-arrange-info-modal', { storeId, themeId }, MODIFY_MODAL_TYPE.ADD)
        },
        editRow(row) {
            this.$bus.$emit('open-arrange-info-modal', row, MODIFY_MODAL_TYPE.EDIT)
            this.isOpenArrangeInfoModal = true
        },
        deleteRow(id) {
            this.$confirm(`是否删除所选预定 ？`).then(() =>
                deleteReserve(id).then(() => {
                    this.$message('删除成功')
                    this._getList()
                })
            )
        },
        startRow(id) {
            this.$confirm(`是否开始执行所选预定 ？`).then(() =>
                startReserve(id).then(() => {
                    this.$message('执行成功，开始计时')
                    this._getList()
                })
            )
        },
        _getList() {
            if (typeof this.searchParams.date !== 'number') {
                this.searchParams.date = this.searchParams.date.getTime()
                return
            }
            getReserveList(this.searchParams)
                .then(data => {
                    this.list = data.list || []
                    this.totalCount = data.totalCount || 0
                })
                .catch(e => console.log(e))
        },
        _getOtherList() {
            getOrderOtherList(this.searchParams)
                .then(data => {
                    this.otherList = data || {}
                    console.log(this.otherList)
                })
                .catch(e => console.log(e))
        },
        closeArrangeInfoModal(isSuccess) {
            this.isOpenArrangeInfoModal = false
            isSuccess && this._getList(false)
        }
    }
}
</script>

<style lang="scss" scoped>
.arrange-list {
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
            height: auto;
            // max-height: 120px;
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
