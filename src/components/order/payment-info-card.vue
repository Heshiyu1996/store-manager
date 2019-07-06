<template>
    <div class="payment-info-card">
        <div class="payment-consumption-wrapper">
            <div class="title fix">支付类型消费（{{ paymentSum || 0 }} 元）</div>
            <div class="consumption-content" v-for="item in list" :key="item.id">
                <div class="key ellipsis" :title="item.name">{{ item.name }}</div>
                <div class="price">{{ item.price }} 元/人</div>
                <div class="value"><el-input-number :disabled="disabled" v-model="paymentData[item.id]" size="mini" :min="0" /></div>
            </div>
        </div>
        <div class="card-consumption-wrapper">
            <div class="title">会员卡消费（{{ cardConsumption || 0 }} 元，折后 {{ Number((cardConsumption * discountRate || 0).toFixed(2)) }} 元）</div>
            <div class="consumption-content">
                <u-input
                    v-model.number="cardIdInput"
                    maxLength="11"
                    placeholder="请输入会员卡"
                    size="mini"
                    searchIcon
                    @blur="getCardInfo(cardIdInput)"
                    @keypress.enter="getCardInfo(cardIdInput)"
                    :disabled="disabled"
                    :class="{ 'is-invalid': !isValidCardId && !firstInputCardId }"
                />
                <div v-show="targetCard.cardId" class="card-type" :class="`type-${targetCard.type}`">
                    这是一张{{ _findCardTypeText(targetCard.type) }}! 可以享受折扣：{{ discountRate }}
                </div>
            </div>
            <template v-if="targetCard.cardId">
                <div class="card-info-wrapper" :class="`type-${targetCard.type}`">
                    <div class="info">
                        <span>卡号：{{ targetCard.cardId }}</span>
                        <span>所属人：{{ targetCard.ownerName }}</span>
                        <span>余额：{{ targetCard.balance }} 元</span>
                    </div>
                    <div class="card-consume-wrapper">
                        <u-input
                            v-model.number="cardPeopleNumInput"
                            maxLength="11"
                            placeholder="请输入消费人数"
                            size="mini"
                            :disabled="disabled || !targetCard.cardId"
                        />
                        <u-input
                            v-model.number="cardConsumptionInput"
                            :disabled="disabled || !targetCard.cardId"
                            maxLength="11"
                            placeholder="请输入消费金额"
                            size="mini"
                        />
                        元
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { getCardList } from '@/server/api'
import { CARD_TYPE_MAP } from '@/utils/config'

export default {
    props: {
        list: { type: Array, default: () => [] },
        value: { type: Object, default: () => {} },
        amountTemp: { type: Number, default: 0 },
        cardId: { type: [Number, String], default: 0 },
        cardConsumption: { type: [Number, String], default: 0 },
        cardPeopleNum: { type: [Number, String], default: 0 },
        disabled: { type: Boolean, default: false }
    },
    data() {
        return {
            paymentData: {},
            targetCard: {},

            cardPeopleNumInput: this.cardPeopleNum || null,
            paymentSum: 0,

            cardIdInput: this.cardId || null,
            cardConsumptionInput: this.cardConsumption || null,

            isValidCardId: false,
            firstInputCardId: true
        }
    },
    computed: {
        discountRate() {
            return this.targetCard.cardId && this.targetCard.type ? this.targetCard.discount : 1
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
        cardId(val) {
            this.cardIdInput = val
        },
        cardIdInput(val) {
            this.$emit('update:cardId', val)
        },
        cardConsumption(val) {
            this.cardConsumptionInput = val
        },
        cardConsumptionInput(val) {
            this.$emit('update:cardConsumption', val || null)
            let amountTemp = this.paymentSum + (val || 0) * this.discountRate
            this.$emit('update:amountTemp', amountTemp)
        },
        paymentData: {
            handler(val) {
                let paymentSum = Object.keys(this.paymentData).reduce((total, paymentType) => {
                    let targetPrice = this.list.filter(item => item.id === Number(paymentType))[0]['price']
                    return total + this.paymentData[paymentType] * targetPrice
                }, 0)
                this.paymentSum = paymentSum
                this.$emit('input', val)
            },
            immediate: true,
            deep: true
        },
        paymentSum(val) {
            let amountTemp = val + this.cardConsumption * this.discountRate
            this.$emit('update:amountTemp', amountTemp)
        },
        cardPeopleNum(val) {
            this.cardPeopleNumInput = val
        },
        cardPeopleNumInput(val) {
            this.$emit('update:cardPeopleNum', val)
        },
        'targetCard.cardId'(val) {
            !val && (this.cardConsumptionInput = this.cardPeopleNumInput = null)
        }
    },
    created() {
        this.cardIdInput && this.getCardInfo(this.cardIdInput)
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
        },

        _findCardTypeText(type) {
            if (!type) return '-'
            return CARD_TYPE_MAP.find(item => type === item.value).label
        },

        _findCardTypeDiscount(type) {
            if (!type) return '-'
            return CARD_TYPE_MAP.find(item => type === item.value).discountRate
        }
    }
}
</script>

<style lang="scss" scoped>
.payment-info-card {
    position: relative;
    width: 100%;
    height: 170px;
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

    .payment-consumption-wrapper {
        display: inline-block;
        width: 360px;
        height: 100%;
        max-height: 142px;
        margin-top: 25px;
        padding: 6px 8px;
        border-right: 1px solid $border-color;
        overflow: scroll;

        .consumption-content {
            height: 38px;
            padding: 0 10px;
            display: flex;
            justify-content: space-between;

            .icon {
                right: 6px;
            }

            .key,
            .price,
            .value {
                display: inline-block;
                @include font-normal(12px, $normal-color-m);
            }

            .ellipsis {
                min-width: 90px;
                max-width: 90px;
                @include ellipse();
            }
        }
    }

    .card-consumption-wrapper {
        display: inline-block;
        width: 377px;
        margin: 2px 8px;
        padding: 4px 0;
        vertical-align: top;

        .consumption-content {
            position: relative;
        }

        .card-type {
            display: inline-block;
            height: 12px;
            line-height: 12px;
            margin-left: 6px;
            font-size: 12px;
            @include font-normal(12px, $error-color);

            &.type-1 {
                color: lightcoral;
            }

            &.type-2 {
                color: thistle;
            }

            &.type-3 {
                color: sandybrown;
            }
        }

        .card-info-wrapper {
            width: 100%;
            display: inline-block;
            margin-top: 12px;
            padding: 0 8px;
            // border-top: 1px dashed $border-color;
            background: $border-color;
            border-radius: 6px;
            @include font-normal(12px, $normal-color-s);

            .info {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid $normal-color-s;
                height: 36px;
                line-height: 36px;
            }

            &.type-1 {
                background: lightcoral;
                color: white;

                .info {
                    border-bottom: 1px solid white;
                }
            }

            &.type-2 {
                background: lavender;
            }

            &.type-3 {
                background: sandybrown;
            }
        }

        /deep/ .u-input {
            width: 130px !important;
            height: 28px;
            line-height: 28px;

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

        ::-webkit-input-placeholder {
            font-size: 12px;
        }
    }

    .title {
        display: block;
        height: 20px;
        line-height: 20px;
        @include font-normal(12px, $tip-color-m);

        &.fix {
            position: absolute;
            top: 5px;
        }
    }
}
</style>
