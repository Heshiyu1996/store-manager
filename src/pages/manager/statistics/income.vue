<template>
    <u-layout class="statistic-income" direction="v">
        <div class="top-wrapper">
            <u-layout>
                <el-select v-model="searchParams.storeIds" multiple :multiple-limit="1" filterable placeholder="请选择门店">
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
                <el-date-picker v-model="rangeTime" type="daterange" range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期" />
            </u-layout>
        </div>

        <u-layout class="content-wrapper" direction="v">
            <el-divider content-position="left">收入统计</el-divider>
            <template v-if="bussinessData.rows && bussinessData.rows.length">
                <ve-line :data="bussinessData" :settings="BUSSINESS_SETTING" />
                <u-table ref="bussinessTable" :list="bussinessData.rows.concat(bussinessData.sum)" auto is-list>
                    <template slot-scope="{ row }">
                        <u-table-column width="20vw" label="日期" ellipse>{{ row.date }}</u-table-column>
                        <u-table-column width="20vw" label="订单总数" ellipse> {{ row.orderCount }} </u-table-column>
                        <u-table-column width="20vw" label="总人数" ellipse> {{ row.personCount }} </u-table-column>
                        <u-table-column width="20vw" label="营业额" ellipse> {{ row.turnover }} </u-table-column>
                    </template>
                </u-table>
            </template>

            <template v-else>
                该门店在当前时间段内，合计收入为空
            </template>

            <el-divider content-position="left">主题统计</el-divider>
            <template v-if="themeData.rows && themeData.rows.length">
                <ve-pie :data="themeData" :settings="THEME_SETTING"></ve-pie>
                <u-table ref="bussinessTable" :list="themeData.rows.concat(themeData.sum)" auto is-list>
                    <template slot-scope="{ row }">
                        <u-table-column width="20vw" label="主题名" ellipse>{{ row.name }}</u-table-column>
                        <u-table-column width="20vw" label="订单数" ellipse> {{ row.orderCount }} </u-table-column>
                        <u-table-column width="20vw" label="总人数" ellipse> {{ row.personCount }} </u-table-column>
                        <u-table-column width="20vw" label="收入" ellipse> {{ row.income }} </u-table-column>
                    </template>
                </u-table>
            </template>

            <template v-else>
                该门店在当前时间段内，合计主题收入为空
            </template>

            <el-divider content-position="left">支付类型统计</el-divider>
            <template v-if="paymentData.rows && paymentData.rows.length">
                <ve-pie :data="paymentData" :settings="PAYMENT_SETTING"></ve-pie>
                <u-table ref="bussinessTable" :list="paymentData.rows.concat(paymentData.sum)" auto is-list>
                    <template slot-scope="{ row }">
                        <u-table-column width="20vw" label="支付类型分组名" ellipse>{{ row.name }}</u-table-column>
                        <u-table-column width="20vw" label="支付类型总数" ellipse> {{ row.typeCount }} </u-table-column>
                        <u-table-column width="20vw" label="总人数" ellipse> {{ row.personCount }} </u-table-column>
                        <u-table-column width="20vw" label="收入" ellipse> {{ row.income }} </u-table-column>
                    </template>
                </u-table>
            </template>

            <template v-else>
                该门店在当前时间段内，合计支付类型收入为空
            </template>

            <el-divider content-position="left">消费来源统计</el-divider>
            <template v-if="consumerSourceData.rows && consumerSourceData.rows.length">
                <ve-pie :data="consumerSourceData" :settings="CONSUME_SOURCE_SETTING"></ve-pie>
                <u-table ref="bussinessTable" :list="consumerSourceData.rows.concat(consumerSourceData.sum)" auto is-list>
                    <template slot-scope="{ row }">
                        <u-table-column width="20vw" label="消费来源" ellipse>{{ row.name }}</u-table-column>
                        <u-table-column width="20vw" label="订单数" ellipse> {{ row.orderCount }} </u-table-column>
                        <u-table-column width="20vw" label="总人数" ellipse> {{ row.personCount }} </u-table-column>
                        <u-table-column width="20vw" label="收入" ellipse> {{ row.income }} </u-table-column>
                    </template>
                </u-table>
            </template>

            <template v-else>
                该门店在当前时间段内，合计支付类型收入为空
            </template>
        </u-layout>
    </u-layout>
</template>

<script>
import { getIncomeStatisticsList } from '@/server/api'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')

const BUSSINESS_SETTING = {
    labelMap: {
        date: '日期',
        turnover: '营业额',
        orderCount: '订单数',
        personCount: '人数',
        name: '主题名'
    }
}
const THEME_SETTING = {
    labelMap: {
        name: '主题名',
        income: '收入',
        orderCount: '订单数',
        personCount: '人数'
    },
    dimension: 'name',
    metrics: 'income'
}
const PAYMENT_SETTING = {
    labelMap: {
        name: '主题名',
        turnover: '营业额',
        orderCount: '订单数',
        personCount: '人数'
    },
    dimension: 'name',
    metrics: 'income'
}
const CONSUME_SOURCE_SETTING = {
    labelMap: {
        name: '消费来源',
        income: '收入',
        orderCount: '订单数',
        personCount: '人数'
    },
    dimension: 'name',
    metrics: 'income'
}
export default {
    name: 'statistic-income',
    // components: { PPaymentGroupInfoModal },
    data() {
        return {
            chartData: {
                columns: [],
                rows: [],
                sum: []
            },
            searchParams: {
                storeIds: ''
            },

            dataSource: {},
            rangeTime: [Date.now(), Date.now()],

            BUSSINESS_SETTING,
            THEME_SETTING,
            PAYMENT_SETTING,
            CONSUME_SOURCE_SETTING
        }
    },
    computed: {
        bussinessData() {
            if (!this.dataSource['bussiness']) return {}
            let { detail: rows } = this.dataSource['bussiness'],
                { totalTurnover: turnover, totalOrderCount: orderCount, totalPersonCount: personCount } = this.dataSource['bussiness'],
                sum = { date: '合计', turnover, orderCount, personCount },
                columns = ['date', 'turnover', 'orderCount', 'personCount']

            return { columns, rows, sum }
        },
        themeData() {
            if (!this.dataSource['theme']) return {}
            let { detail: rows } = this.dataSource['theme'],
                { totalIncome: income, totalOrderCount: orderCount, totalPersonCount: personCount } = this.dataSource['theme'],
                sum = { name: '合计', income, orderCount, personCount },
                columns = ['name', 'income', 'orderCount', 'personCount']

            return { columns, rows, sum }
        },
        paymentData() {
            if (!this.dataSource['payment']) return {}
            let { detail: rows } = this.dataSource['payment'],
                { totalTypeCount: typeCount, totalPersonCount: personCount, totalIncome: income } = this.dataSource['payment'],
                sum = { name: '合计', typeCount, personCount, income },
                columns = ['name', 'typeCount', 'personCount', 'income']

            return { columns, rows, sum }
        },
        consumerSourceData() {
            if (!this.dataSource['consumerSource']) return {}
            let { detail: rows } = this.dataSource['consumerSource'],
                { totalOrderCount: orderCount, totalPersonCount: personCount, totalIncome: income } = this.dataSource['consumerSource'],
                sum = { name: '合计', orderCount, personCount, income },
                columns = ['name', 'orderCount', 'personCount', 'income']

            return { columns, rows, sum }
        },
        ...mapGetters(['getUserInfoStore', 'getStoreListStore'])
    },
    watch: {
        'searchParams.storeIds'(val) {
            val.length && this._getList()
        },
        rangeTime(val) {
            this._formatRangeTime(val)
            this._getList()
        },
        getStoreListStore(val) {
            this.searchParams.storeIds = [val[0].id]
        }
    },
    methods: {
        _getList() {
            this._formatRangeTime(this.rangeTime)

            getIncomeStatisticsList(this.searchParams).then(data => (this.dataSource = data || {}))
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
.statistic-income {
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
