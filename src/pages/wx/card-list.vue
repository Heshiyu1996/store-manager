<template>
    <u-layout class="card-list" direction="v">
        <!-- <el-date-picker v-model="rangeTime" type="daterange" size="mini" range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期" /> -->
        <u-table v-if="isBound" :list="flowList" auto is-list>
            <template slot-scope="{ row }">
                <u-table-column width="0.65rem" label="ID" ellipse>{{ row.id || '-' }}</u-table-column>
                <u-table-column width="0.65rem" label="方式" ellipse>{{ _findRechargeTxt(row.rechargeWay) || '-' }}</u-table-column>
                <u-table-column width="0.65rem" label="金额" ellipse>{{ row.amount }}</u-table-column>
                <u-table-column width="0.65rem" label="余额" ellipse> {{ row.balance }} </u-table-column>
                <u-table-column width="1rem" label="时间">
                    {{ row.flowTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}
                </u-table-column>
            </template>
        </u-table>
        <div v-else>你还未绑定，请立刻 <el-button type="text" @click="goToBindAccount">去绑定</el-button></div>
    </u-layout>
</template>

<script>
import { FetchOpenIdMixin } from '@/components/common/mixins'
import { getFlowListWX } from '@/server/api'
import { RECHARGE_TYPE_MAP, WX_URL } from '@/utils/config'

export default {
    name: 'card-list',
    mixins: [FetchOpenIdMixin],
    data() {
        return {
            searchParams: {
                openid: ''
                // currentPage: 1,
                // pageSize: 50
            },

            openid: '',

            isBound: false,

            flowList: []

            // rangeTime: [],
        }
    },
    watch: {
        // rangeTime(val) {
        //     if (!val) {
        //         delete this.searchParams.startTime
        //         delete this.searchParams.endTime
        //     } else {
        //         let [startTime, endTime] = val
        //         this.searchParams.startTime = startTime.getTime()
        //         this.searchParams.endTime = endTime.getTime() + 86399000
        //     }
        //     this._getList(true)
        // }
    },
    created() {
        // this._getList(true)
        this.fetchOpenId()
    },
    methods: {
        fetchOpenId() {
            this._getOpenId().then(openid => {
                this.openid = openid
                this.checkIfBind(openid)
            })
        },
        checkIfBind(openid) {
            this._checkIfBind(openid).then(({ isBound }) => {
                this.isBound = isBound
                isBound && this._getList(openid)
            })
        },
        _getList(openid) {
            let param = { ...this.searchParams, openid }
            getFlowListWX(param).then(data => {
                this.flowList = data.list || []
            })
        },
        _findRechargeTxt(type) {
            if (typeof type !== 'number') return '-'
            let targetRechargeType = RECHARGE_TYPE_MAP.find(item => type === item.value)
            return (targetRechargeType && targetRechargeType.label) || '无充值方式'
        },
        goToBindAccount() {
            window.open(`${WX_URL.PRE_FIX}bind-account${WX_URL.POST_FIX}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.card-list {
    font-size: 0.1rem;

    /deep/ .u-table {
        th,
        td {
            min-width: 0.5rem !important;
        }
    }
}
</style>
