<template>
    <u-layout class="consume-list" direction="v">
        <div class="top-wrapper">
            <u-layout>
                <el-date-picker v-model="rangeTime" type="daterange" range-separator="至" start-placeholder="起始日期" end-placeholder="结束日期">
                </el-date-picker>
            </u-layout>
        </div>

        <u-layout class="content-wrapper" direction="v">
            <u-table ref="operationTable" :list="consumeList" auto is-list>
                <template slot-scope="{ row }">
                    <u-table-column width="15vw" label="流水ID" ellipse>{{ row.id || '-' }}</u-table-column>
                    <u-table-column width="15vw" label="充值方式" ellipse>{{ _findRechargeTxt(row.rechargeWay) || '-' }}</u-table-column>
                    <u-table-column width="15vw" label="流水描述" ellipse>{{ row.flowDesc }}</u-table-column>
                    <u-table-column width="15vw" label="消费/充值金额" ellipse>{{ row.amount }}</u-table-column>
                    <u-table-column width="15vw" label="余额" ellipse> {{ row.balance }} </u-table-column>
                    <u-table-column width="15vw" label="消费时间">
                        {{ row.flowTime | dateFormat }}
                    </u-table-column>
                </template>
            </u-table>

            <el-pagination
                v-show="consumeList.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchParams.currentPage"
                :page-sizes="[10, 50, 100]"
                :page-size="searchParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="consumeList.length"
            >
            </el-pagination>
        </u-layout>
    </u-layout>
</template>

<script>
import { getConsumeList } from '@/server/api'
import { createNamespacedHelpers } from 'vuex'
import { RECHARGE_TYPE_MAP } from '@/utils/config'

const { mapGetters } = createNamespacedHelpers('login')

export default {
    name: 'consume-list',
    data() {
        return {
            searchParams: {
                cardId: -1,
                currentPage: 1,
                pageSize: 50
            },
            rangeTime: [],

            consumeList: [{}],

            RECHARGE_TYPE_MAP
        }
    },
    computed: {
        ...mapGetters(['getUserInfoStore'])
    },
    watch: {
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
                this.searchParams.endTime = endTime.getTime()
            }
            this._getList(true)
        },
        getUserInfoStore: {
            handler(val) {
                this.searchParams.cardId = val.cardId
            },
            immediate: true
        }
    },
    created() {
        this._getList(true)
    },
    methods: {
        _getList(isNew) {
            console.log('拉取列表，isNew：', isNew)
            isNew && (this.searchParams.currentPage = 1)

            getConsumeList(this.searchParams).then(data => {
                this.consumeList = data.list || []
                this.totalCount = data.totalCount || 0
            })
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
        _findRechargeTxt(type) {
            if (typeof type !== 'number') return '-'
            return RECHARGE_TYPE_MAP.find(item => type === item.value).label
        }
    }
}
</script>

<style lang="scss" scoped>
.consume-list {
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
