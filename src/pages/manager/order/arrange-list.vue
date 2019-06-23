<template>
    <u-layout class="arrange-list" direction="v">
        <div class="top-wrapper">
            <u-layout class="filter" gap="s">
                <el-select v-model="searchParams.storeId" filterable placeholder="请选择门店">
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
                <el-date-picker v-model="searchParams.date" type="date" @change="_getIncomeList" placeholder="请输入查询时间" size="medium"> </el-date-picker>

                <el-popover :disabled="!incomeTotal" placement="right" width="360" trigger="hover" class="income-hover-btn">
                    <u-table ref="incomeTable" :list="incomeList" auto is-list scroll class="income-table">
                        <template slot-scope="{ row }">
                            <u-table-column width="160px" label="支付类型" ellipse>{{ row.name }}</u-table-column>
                            <u-table-column width="160px" label="收入" ellipse>{{ row.income }}</u-table-column>
                        </template>
                    </u-table>

                    <el-button slot="reference" class="income-btn">
                        <u-icon name="income" class="income-icon" />
                        <span>{{ incomeTotal ? `今日收款：${incomeTotal} 元` : '今日暂无收入，请加油吧！' }}</span>
                    </el-button>
                </el-popover>
            </u-layout>
        </div>
        <u-layout class="content-wrapper" direction="v">
            <div id="musicArrange"></div>

            <div v-loading.body="loading">
                <u-table v-if="!loading" ref="operationTable" :list="list" auto is-list scroll>
                    <template slot-scope="{ row }">
                        <u-table-column label="时间" ellipse>
                            {{ row.hour }}
                        </u-table-column>
                        <u-table-column v-for="theme in themeList" :key="theme.id" :label="theme.name" width="185px" ellipse class="arrange-info-item">
                            <ArrangeInfoCard
                                :arrange-info="row[theme.id]"
                                :theme-id="theme.id"
                                :store-id="searchParams.storeId"
                                @add-patch="(storeId, themeId) => addPatch(storeId, themeId, row.hour)"
                                @edit-row="arrangeDetail => editRow(arrangeDetail, row.hour)"
                                @delete-row="deleteRow"
                                @start-row="startRow"
                            ></ArrangeInfoCard>
                        </u-table-column>
                    </template>
                </u-table>
            </div>
        </u-layout>

        <ArrangeInfoModal :visible="isOpenArrangeInfoModal" :otherList="otherList" @close="closeArrangeInfoModal" />
    </u-layout>
</template>

<script>
import ArrangeInfoModal from '@/components/order/arrange-info-modal'
import ArrangeInfoCard from '@/components/order/arrange-info-card'
import { getReserveList, deleteReserve, startReserve, getOtherList, getIncomeList, getVoiceList } from '@/server/api'
import { MODIFY_MODAL_TYPE, OPERATION_TYPE } from '@/utils/config'
import { playMusic } from '@/utils/common'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')
const WORD_HOUR_LIST = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4]

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

            otherList: {},
            themeList: [],
            incomeList: [],
            voiceList: [],

            isOpenArrangeInfoModal: false,
            loading: true,
            pollingId: '',
            incomeTotal: 0,

            OPERATION_TYPE,
            WORD_HOUR_LIST
        }
    },
    computed: {
        incomeText() {
            let text = Object.keys(this.incomeList).reduce((total, item) => total + `${item}：${this.incomeList[item]} 、`, '')
            return text ? `${text}合计：${this.incomeTotal}元` : '暂无'
        },
        ...mapGetters(['getStoreListStore'])
    },
    watch: {
        'searchParams.storeId'() {
            this._getList()
            this._getOtherList()
            this._getIncomeList()
        },
        'searchParams.date'() {
            this._getList()
        },
        // voiceList: {
        //     handler(val) {
        //         !!val.length && playMusic(val)
        //     },
        //     deep: true
        // },
        getStoreListStore: {
            handler(storeList) {
                this.searchParams.storeId = (storeList[0] && storeList[0].id) || ''
            },
            immediate: true
        }
    },
    mounted() {
        this._getVoiceList()
        playMusic(this.voiceList, 'musicArrange')
    },
    beforeDestroy() {
        clearInterval(this.pollingId)
    },
    methods: {
        addPatch(storeId, themeId, hour) {
            const { date } = this.searchParams
            this.isOpenArrangeInfoModal = true
            this.$bus.$emit('open-arrange-info-modal', { storeId, themeId, hour, date }, MODIFY_MODAL_TYPE.ADD)
        },
        editRow(arrangeDetail, hour) {
            const { date } = this.searchParams
            this.$bus.$emit('open-arrange-info-modal', { ...arrangeDetail, hour, date }, MODIFY_MODAL_TYPE.EDIT)
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
            this.$confirm(`是否开始游戏？（请确认客户【已付款】且【已到店】）`).then(() =>
                startReserve(id).then(() => {
                    this.$message('执行成功，开始计时')
                    this._getList()
                })
            )
        },
        _getVoiceList() {
            this.pollingId = setInterval(() => {
                getVoiceList({ storeId: this.searchParams.storeId }).then(urls => {
                    console.log(urls)

                    if (!urls.length) return

                    this.voiceList = this.voiceList.concat(urls)
                    playMusic(this.voiceList, 'musicArrange')
                })
            }, 3000)
        },
        _getList() {
            if (typeof this.searchParams.date !== 'number') {
                this.searchParams.date = this.searchParams.date.getTime()
                return
            }
            this.loading = true
            setTimeout(() => {
                getReserveList(this.searchParams)
                    .then(data => {
                        console.log(data)
                        this.list = data.list || []
                        this._updateList()

                        this.loading = false
                    })
                    .catch(e => console.log(e))
            }, 200)
        },
        _getOtherList() {
            getOtherList(this.searchParams)
                .then(data => {
                    this.themeList = []
                    const { themeList } = data
                    this.otherList = data || {}
                    this.themeList = themeList
                })
                .catch(e => console.log(e))
        },
        _getIncomeList() {
            getIncomeList(this.searchParams)
                .then(data => {
                    this.incomeList = data.list || []
                    this.incomeTotal = data.total || 0
                })
                .catch(e => console.log(e))
        },
        closeArrangeInfoModal(isSuccess) {
            this.isOpenArrangeInfoModal = false
            isSuccess && this._getList(false)
        },
        _updateList() {
            let list = []
            WORD_HOUR_LIST.forEach(hour => {
                let existHour = this.list.filter(item => item.hour === hour),
                    targetObj = existHour.length ? existHour[0] : { hour }

                list.push(targetObj)
            })
            this.list = [...list]
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

        /deep/ input {
            height: 36px;
        }

        .income-hover-btn {
            width: 200px;

            .income-icon {
                width: 18px;
                height: 18px;
                margin-right: 4px;
            }

            .income-btn {
                height: 36px;
                padding: 8px 20px;
                vertical-align: top;
                background: #ffb62f;
                @include font-normal(14px, white, true);

                &:hover {
                    opacity: 0.8;
                }

                &:active {
                    opacity: 0.6;
                    border-color: white;
                }
            }
        }

        .el-button {
            margin-right: 0;
        }
    }

    .content-wrapper {
        font-size: 12px;

        #musicArrange {
            display: none;
        }

        .arrange-info-item {
            border-left: 1px dashed $border-color;

            padding: 0;
        }

        .u-table-column {
            line-height: 26px;
            height: auto;
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
