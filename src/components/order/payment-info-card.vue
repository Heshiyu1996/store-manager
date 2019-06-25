<template>
    <div class="payment-info-card">
        <div class="payment-consumption-wrapper">
            <div class="consumption-content" v-for="item in list" :key="item.id">
                <div class="key">{{ item.name }}</div>
                <div class="value"><el-input-number :disabled="disabled" v-model="paymentData[item.id]" size="mini" :min="0" /></div>
            </div>
        </div>
        <!-- <u-table ref="operationTable" :list="list" auto is-list emptyTip="">
            <template slot-scope="{ row }">
                <u-table-column width="200px" label="类型" ellipse>{{ row.name }}</u-table-column>
                <u-table-column width="200px" label="数量" ellipse>
                    <el-input-number :disabled="disabled" v-model="paymentData[row.id]" size="mini" :min="0"
                /></u-table-column>
            </template>
        </u-table> -->
        <div class="card-consumption-wrapper">
            <div class="consumption-content">
                <u-input
                    v-model="cardId"
                    maxLength="11"
                    placeholder="请输入会员卡"
                    size="mini"
                    @blur="getCardInfo(cardId)"
                    @keypress.enter="getCardInfo(cardId)"
                    :class="{ 'is-invalid': !isValidCardId && !firstInputCardId }"
                />
                <u-input v-model.number="cardConsumption" maxLength="11" placeholder="请输入消费金额" size="mini" @change="addAmount(cardConsumption)" />
            </div>
            <div class="card-info">
                <template v-if="targetCard.cardId">
                    卡号：<b>{{ targetCard.cardId }}</b
                    >；卡内余额：<b>{{ targetCard.balance }} 元</b>；所属人：<b>{{ targetCard.ownerName }}</b>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { getCardList } from '@/server/api'

export default {
    props: {
        list: { type: Array, default: () => [] },
        value: { type: Object, default: () => {} },
        amount: { type: Number, default: 0 },
        disabled: { type: Boolean, default: false }
    },
    data() {
        return {
            paymentData: {},
            targetCard: {},

            cardId: null,
            cardConsumption: null,

            isValidCardId: false,
            firstInputCardId: true
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
                let paymentSum = Object.keys(this.paymentData).reduce((total, paymentType) => {
                    let targetPrice = this.list.filter(item => item.id === Number(paymentType))[0]['price']
                    return total + this.paymentData[paymentType] * targetPrice
                }, 0)
                this.$emit('update:amount', Number(paymentSum.toFixed(2)))
                this.$emit('input', val)
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        getCardInfo(cardId) {
            if (!cardId) {
                this.isValidCardId = true
                this.targetCard = {}
            } else {
                this.firstInputCardId = false

                getCardList({ cardId })
                    .then(data => {
                        this.targetCard = data.list[0] || {}
                        this.isValidCardId = true
                    })
                    .catch(() => {
                        this.isValidCardId = false
                        this.targetCard = {}
                    })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.payment-info-card {
    width: 420px;
    border: 1px dashed $border-color;
    border-radius: 4px;

    /deep/ .u-table {
        border: 1px dashed $border-color;

        th {
            padding: 0;
            padding-left: 22px;
        }

        .u-table-column,
        th {
            padding: 8px;
        }

        tbody {
            tr {
                padding: 2px;

                &:last-child {
                    border-bottom: 0;
                }
            }
        }
    }

    .payment-consumption-wrapper,
    .card-consumption-wrapper {
        .consumption-content {
            height: 38px;
            padding: 0 10px;
            display: flex;
            justify-content: space-between;

            .key,
            .value {
                display: inline-block;
            }

            .key {
                @include font-normal(14px, $normal-color-m);
            }
        }

        &:before {
            display: block;
            height: 20px;
            line-height: 20px;
            content: '会员卡消费';
            @include font-normal(12px, $tip-color-m);
        }

        .card-info {
            height: 20px;
            line-height: 20px;
            @include font-normal(12px, $normal-color-s);
        }
    }

    .payment-consumption-wrapper {
        padding: 6px 8px;

        &:before {
            content: '非会员卡消费';
        }
    }

    .card-consumption-wrapper {
        margin: 2px 8px;
        padding: 4px 0;

        border-top: 1px solid $border-color;

        &:before {
            content: '会员卡消费';
        }

        /deep/ .u-input {
            width: 130px !important;

            &:last-child {
                margin-left: 74px;
            }

            input {
                width: 130px;
            }

            &.is-invalid {
                input {
                    border: 1px solid $error-color;
                }
            }
        }
    }
}
</style>
