<template>
    <u-modal :visible="visible" :title="type ? '新增预定' : '编辑预定'" @before-close="submit" @close="closeModal" class="arrange-info-modal">
        <el-form ref="form" :inline="true" :model="form" label-width="110px">
            <el-form-item label="所属门店">
                <el-select v-model="form.storeId" filterable disabled>
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <br />
            <el-form-item label="预定主题">
                <el-select v-model="form.themeId" filterable placeholder="请选择预定主题" :disabled="hasStarted">
                    <el-option v-for="item in otherList['themeList']" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="接待人员">
                <el-select v-model="form.receiverAccount" filterable placeholder="请选择接待人员">
                    <el-option v-for="item in otherList['staffList']" :key="item.account" :label="item.nickName" :value="item.account"> </el-option>
                </el-select>
            </el-form-item>
            <el-divider content-position="right">客户信息</el-divider>
            <el-form-item label="客户来源">
                <el-select v-model="form.sourceType" placeholder="请选择客户来源">
                    <el-option-group v-show="group.children.length" v-for="group in sourceTypeOptions" :key="group.label" :label="group.label">
                        <el-option v-for="item in group.children" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-option-group>
                </el-select>
            </el-form-item>
            <br />

            <el-form-item label="预约时间" class="arrange-time-wrapper">
                <el-date-picker v-model="form.arrangeTime" type="datetime" placeholder="请输入预约时间" size="medium" class="arrange-time"> </el-date-picker>
            </el-form-item>
            <el-form-item label="预约电话">
                <u-input v-model="form.phone" :regex="/^[0-9\u4e00-\u9fa5]+$/g" maxLength="11" :disabled="hasStarted" placeholder="请输入预约电话" />
            </el-form-item>
            <br />
            <el-divider content-position="right">支付信息</el-divider>
            <el-form-item label="支付类型">
                <PaymentInfoCard v-model="form.paymentList" :amount.sync="form.amount" :list="otherList['paymentList']"></PaymentInfoCard>
            </el-form-item>
            <br />

            <el-form-item label="订单总金额">
                <u-label :text="form.amount + ' 元'" />
            </el-form-item>
            <br />
            <div v-if="!hasStarted" class="before-started-info-wrapper">
                <el-form-item label="是否付款">
                    <el-switch v-model="form.isPaid"></el-switch>
                </el-form-item>
                <br />
                <el-form-item label="是否到店">
                    <el-switch v-model="form.isArrived"></el-switch>
                </el-form-item>
                <br />
                <el-form-item label="钥匙编号">
                    <el-select v-model="form.keyId" filterable placeholder="请选择钥匙编号">
                        <el-option v-for="item in otherList['keyList']" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="押金">
                    <u-input v-model.number="form.deposit" placeholder="请输入押金" />
                </el-form-item>
            </div>
            <br />
            <el-form-item label="备注">
                <u-input v-model="form.remark" placeholder="请输入备注" type="textarea"> </u-input>
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import PaymentInfoCard from '@/components/order/payment-info-card'
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { addReserve, editReserve } from '@/server/api'
import { MODIFY_MODAL_TYPE, ARRANGE_STATUS_MAP } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')

export default {
    components: { PaymentInfoCard },
    mixins: [CloseModalMixin, InvalidCheckMixin],
    props: {
        visible: { type: Boolean, default: false },
        otherList: { type: Object, default: () => {} }
    },
    data() {
        return {
            type: MODIFY_MODAL_TYPE.ADD,

            form: {
                id: '',
                paymentList: {},
                amount: 0
            },
            num: 0,

            ARRANGE_STATUS_MAP
        }
    },
    computed: {
        sourceTypeOptions() {
            let onlineGroup = {
                label: '线上',
                children: []
            }
            let offGroup = {
                label: '线下',
                children: []
            }

            let list = this.otherList['sourceList']
            list &&
                list.forEach(item => {
                    let option = { value: item.id, label: item.name }

                    if (item.sourceType === 2) {
                        offGroup.children.push(option)
                    } else {
                        onlineGroup.children.push(option)
                    }
                })
            return [onlineGroup, offGroup] || []
        },
        hasStarted() {
            return this.form.status > ARRANGE_STATUS_MAP.ARRANGED
        },
        ...mapGetters(['getStoreListStore'])
    },
    created() {
        this.$bus.$on('open-arrange-info-modal', (arrangeDetail, isAdd) => {
            console.log(arrangeDetail)
            let { storeId } = arrangeDetail
            this.type = isAdd
            this.form = this.type ? { storeId } : { ...this.form, ...arrangeDetail }
            console.log(this.form)
        })
    },
    destroyed() {
        this.$bus.$off('open-arrange-info-modal')
    },
    methods: {
        submit(e) {
            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }

            this.type ? this._addReserve() : this._editReserve()
        },
        _addReserve() {
            if (typeof this.form.arrangeTime !== 'number') {
                this.form.arrangeTime = this.form.arrangeTime.getTime()
            }
            let param = { ...this.form }
            addReserve(param).then(() => {
                this.$message('新增成功')
                this.closeModal(true)
            })
        },
        _editReserve() {
            let param = { ...this.form }
            editReserve(param).then(() => {
                this.$message('修改成功')
                this.closeModal(true)
            })
        },
        handleSourceType(value) {
            console.log(value)
        }
    }
}
</script>

<style lang="scss" scoped>
.arrange-info-modal {
    /deep/ .u-modal-body {
        overflow-y: scroll;

        .el-form {
            width: 680px;

            .payment-wrapper {
                width: 500px;

                td {
                    line-height: 24px;
                }
            }

            .arrange-time-wrapper {
                width: 303px;

                .arrange-time {
                    width: 193px;
                }
            }

            .u-input {
                width: 193px;
            }

            .textarea {
                width: 506px;
                height: 130px;
            }
        }

        .u-error {
            position: absolute;
            bottom: -15px;
            font-size: 12px;
        }
    }
}
</style>
