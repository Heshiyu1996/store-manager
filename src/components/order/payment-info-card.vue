<template>
    <div class="payment-info-card">
        <u-table ref="operationTable" :list="list" auto is-list>
            <template slot-scope="{ row }">
                <u-table-column width="200px" label="类型" ellipse>{{ row.name }}</u-table-column>
                <u-table-column width="200px" label="数量" ellipse> <el-input-number v-model="paymentData[row.id]" size="mini"/></u-table-column>
            </template>
        </u-table>
    </div>
</template>

<script>
export default {
    props: {
        list: { type: Array, default: () => [] },
        value: { type: Object, default: () => {} },
        amount: { type: Number, default: 0 }
    },
    data() {
        return {
            paymentData: {}
        }
    },
    watch: {
        value: {
            handler(val) {
                val && this.list.forEach(item => this.$set(this.paymentData, item.id, val[item.id] || 0))
            },
            immediate: true,
            deep: true
        },
        paymentData: {
            handler(val) {
                let amount = Object.keys(this.paymentData).reduce((total, paymentType) => {
                    let targetPrice = this.list.filter(item => item.id === Number(paymentType))[0]['price']
                    return total + this.paymentData[paymentType] * targetPrice
                }, 0)
                this.$emit('update:amount', Number(amount.toFixed(2)))
                this.$emit('input', val)
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style lang="scss" scoped>
.payment-info-card {
    display: inline-block;
    width: 400px;
    /deep/ .u-table th {
        padding: 0;
        padding-left: 22px;
    }

    /deep/ .u-table-column,
    th {
        padding: 4px 0;
    }
}
</style>
