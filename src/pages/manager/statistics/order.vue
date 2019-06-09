<template>
    <u-layout class="statistic-order" direction="v">
        <div class="top-wrapper">
            <u-layout>
                <el-select v-model="searchParams.storeIds" multiple :multiple-limit="5" filterable placeholder="请选择门店">
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
                <el-date-picker v-model="rangeTime" type="daterange" range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期" />
            </u-layout>
        </div>

        <u-layout class="content-wrapper" direction="v">
            <el-divider content-position="left">订单总金额统计</el-divider>
            <template v-if="moneyData.rows && moneyData.rows.length">
                <ve-histogram :data="moneyData" :settings="ORDER_SETTING" />
            </template>

            <template v-else>
                该门店在当前时间段内，订单总金额统计为空
            </template>

            <el-divider content-position="left">订单总数统计</el-divider>
            <template v-if="countData.rows && countData.rows.length">
                <ve-histogram :data="countData" :settings="ORDER_SETTING" />
            </template>

            <template v-else>
                该门店在当前时间段内，订单总金额统计为空
            </template>

            <el-divider content-position="left">订单总人数统计</el-divider>
            <template v-if="personData.rows && personData.rows.length">
                <ve-histogram :data="personData" :settings="ORDER_SETTING" />
            </template>

            <template v-else>
                该门店在当前时间段内，订单总金额统计为空
            </template>
        </u-layout>
    </u-layout>
</template>

<script>
import { getOrderStatisticsList } from '@/server/api'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')
const ORDER_SETTING = {
    labelMap: {}
}

export default {
    name: 'statistic-order',
    data() {
        return {
            searchParams: {
                storeIds: ''
            },
            orderColumns: [],

            dataSource: {},
            rangeTime: [Date.now(), Date.now()],

            ORDER_SETTING
        }
    },
    computed: {
        moneyData() {
            if (!this.dataSource['totalMoney']) return {}
            let rows = this.dataSource['totalMoney'],
                columns = this.orderColumns

            return { columns, rows }
        },
        countData() {
            if (!this.dataSource['totalCount']) return {}
            let rows = this.dataSource['totalCount'],
                columns = this.orderColumns

            return { columns, rows }
        },
        personData() {
            if (!this.dataSource['totalPerson']) return {}
            let rows = this.dataSource['totalPerson'],
                columns = this.orderColumns

            return { columns, rows }
        },
        ...mapGetters(['getUserInfoStore', 'getStoreListStore'])
    },
    watch: {
        'searchParams.storeIds'(val) {
            val.length && this._getList()

            this.orderColumns = ['date'].concat(val)
        },
        rangeTime(val) {
            this._formatRangeTime(val)
            this._getList()
        },
        getStoreListStore: {
            handler(val) {
                let labelMap = {}
                val.forEach(store => (labelMap[store.id] = store.name))
                ORDER_SETTING.labelMap = { date: '日期', ...labelMap }
            },
            immediate: true
        }
    },
    methods: {
        _getList() {
            this._formatRangeTime(this.rangeTime)

            getOrderStatisticsList(this.searchParams).then(data => (this.dataSource = data || {}))
        },
        _formatRangeTime(date) {
            if (!date) {
                delete this.searchParams.startTime
                delete this.searchParams.endTime
            } else {
                let [startTime, endTime] = date

                typeof startTime !== 'number' && (startTime = startTime.getTime())
                typeof endTime !== 'number' && (endTime = endTime.getTime() + 86399000)

                this.searchParams.startTime = startTime
                this.searchParams.endTime = endTime
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.statistic-order {
    height: 100%;
    padding: 0 30px 40px;

    .top-wrapper {
        display: flex;
        height: 40px;
        justify-content: space-between;
        align-items: center;

        .el-select {
            width: 350px;
        }

        .el-button {
            margin-right: 0;
        }
    }

    .content-wrapper {
        .el-divider {
            margin-top: 60px;
            font-weight: 700;

            .el-divider__text {
                font-weight: 700;
            }

            &:first-child {
                margin-top: 40px;
            }
        }

        .icon {
            font-size: 20px;
            cursor: pointer;
        }

        /deep/ .u-table {
            tbody {
                tr:last-child {
                    @include font-normal(14px, $error-color, true);
                }
            }
        }
    }
}
</style>
