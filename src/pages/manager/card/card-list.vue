<template>
    <u-layout class="card-list" direction="v">
        <div class="top-wrapper">
            <u-layout>
                <el-select v-model="searchParams.storeId" filterable placeholder="请选择门店">
                    <el-option v-for="item in storeListModified" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
                <u-input v-model.number="searchParams.cardId" maxLength="100" placeholder="请输入卡号" searchIcon @key-press-enter="_getList(true)" />
            </u-layout>
            <u-layout class="operation">
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                    <el-button type="primary" icon="el-icon-plus" circle @click="addPatch()"></el-button>
                </el-tooltip>
            </u-layout>
        </div>

        <u-layout class="content-wrapper" direction="v">
            <u-table ref="operationTable" :list="cardList" auto is-list>
                <template slot-scope="{ row }">
                    <u-table-column width="6vw" label="卡号" ellipse>{{ row.cardId || '-' }}</u-table-column>
                    <u-table-column width="12vw" label="卡种" ellipse>{{ _findCardTypeText(row.type) }}</u-table-column>
                    <u-table-column width="12vw" label="持卡人" ellipse>{{ row.ownerName }}</u-table-column>
                    <u-table-column width="12vw" label="开卡人" ellipse>{{ row.operator }}</u-table-column>
                    <u-table-column width="12vw" label="开卡门店" ellipse>{{ row.storeName }}</u-table-column>
                    <u-table-column width="12vw" label="余额（元）" ellipse> {{ row.balance }} </u-table-column>
                    <u-table-column width="18vw" label="开卡时间">
                        {{ row.createTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}
                    </u-table-column>
                    <u-table-column label="操作">
                        <u-layout direction="h">
                            <i class="icon el-icon-edit" @click="editRow(row)"></i> <i class="icon el-icon-delete" @click="deleteRow(row)"></i>
                        </u-layout>
                    </u-table-column>
                </template>
            </u-table>

            <el-pagination
                v-show="cardList.length"
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

        <CardInfoModal :visible="isOpenCardInfoModal" @close="closeCardInfoModal" />
    </u-layout>
</template>

<script>
import CardInfoModal from '@/components/card/card-info-modal'
import { getCardList, deleteCard } from '@/server/api'
import { MODIFY_MODAL_TYPE, CARD_TYPE_MAP } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')

export default {
    name: 'card-list',
    components: { CardInfoModal },
    data() {
        return {
            searchParams: {
                storeId: '',
                cardId: '',
                currentPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            rangeTime: [],
            cardList: [],

            isOpenCardInfoModal: false,

            CARD_TYPE_MAP
        }
    },
    watch: {
        'searchParams.storeId'() {
            this._getList(true)
        },
        'searchParams.currentPage'() {
            this._getList(false)
        },
        'searchParams.pageSize'() {
            this._getList(true)
        },
        rangeTime(val) {
            if (!val) {
                delete this.searchParams.startTime
                delete this.searchParams.endTime
            } else {
                let [startTime, endTime] = val
                this.searchParams.startTime = startTime.getTime()
                this.searchParams.endTime = endTime.getTime() + 86399000
            }
            this._getList(true)
        }
    },
    computed: {
        storeListModified() {
            return [{ id: '', name: '所有门店' }].concat(this.getStoreListStore)
        },
        ...mapGetters(['getStoreListStore'])
    },
    created() {
        this.searchParams.cardId = this.$route.params.cardId
        this._getList(true)
    },
    methods: {
        addPatch() {
            let param = { storeId: this.searchParams.storeId }
            this.$bus.$emit('open-card-info-modal', param, MODIFY_MODAL_TYPE.ADD)
            this.isOpenCardInfoModal = true
        },
        editRow(row) {
            console.log(row)
            this.isOpenCardInfoModal = true
            this.$bus.$emit('open-card-info-modal', row, MODIFY_MODAL_TYPE.EDIT)
        },
        deleteRow(row) {
            this.$confirm(`是否删除会员卡（卡号： ${row.cardId} ）？`).then(() =>
                deleteCard(row.cardId).then(() => {
                    this.$message('会员卡删除成功')
                    this._getList(true)
                })
            )
        },
        _getList(isNew) {
            isNew && (this.searchParams.currentPage = 1)

            getCardList(this.searchParams).then(data => {
                this.cardList = data.list || []
                this.searchParams.totalCount = data.totalCount || 0
            })
        },
        // pageSize大小
        handleSizeChange(val) {
            this.searchParams.pageSize = val
        },
        // currentPage翻页
        handleCurrentChange(val) {
            this.searchParams.currentPage = val
        },
        closeCardInfoModal(isSuccess) {
            this.isOpenCardInfoModal = false
            isSuccess && this._getList(false)
        },
        _findCardTypeText(type) {
            if (!type) return '-'
            return CARD_TYPE_MAP.find(item => type === item.value).label
        }
    }
}
</script>

<style lang="scss" scoped>
.card-list {
    height: 100%;
    padding: 0 30px 40px;

    .top-wrapper {
        display: flex;
        height: 40px;
        justify-content: space-between;
        align-items: center;

        /deep/ .el-range-separator {
            padding: 0;
        }

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
