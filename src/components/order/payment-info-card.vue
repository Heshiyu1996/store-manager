<template>
    <div class="payment-info-card">
        <div v-for="item in list" :key="item.id">
            {{ item.name }}
            <el-input-number v-model="paymentData[item.id]" size="small" />
        </div>
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
}
</style>
