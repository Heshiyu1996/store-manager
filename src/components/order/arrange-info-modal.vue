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
                <el-radio v-model="form.sourceType" :label="1">线上</el-radio>
                <el-radio v-model="form.sourceType" :label="2">线下</el-radio>
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
                <!-- <u-table :list="otherList['paymentList']" auto is-list class="payment-wrapper">
                    <template slot-scope="{ row }">
                        <u-table-column width="200px" label="类型" ellipse>{{ row.name }}</u-table-column>
                        <u-table-column width="160px" label="人数" ellipse><el-input-number v-model="num" size="small"/></u-table-column>
                    </template>
                </u-table> -->
                <!-- <div v-for="payment in otherList['paymentList']" :key="payment.id">
                    <div class="payment-wrapper">
                        {{ payment.name }}：<el-input-number v-model="form.paymentList" size="small"/>

                    </div>
                </div> -->
            </el-form-item>
            <br />

            <el-form-item label="订单总金额">
                <u-input v-model.number="form.amount" placeholder="请输入订单总金额" :disabled="hasStarted" />
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
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { addReserve, editReserve } from '@/server/api'
import { MODIFY_MODAL_TYPE, ARRANGE_STATUS_MAP } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')

export default {
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
                sourceType: 1,
                paymentList: [
                    {
                        paymentType: 5,
                        count: 2
                    }
                ]
            },
            num: 0,

            ARRANGE_STATUS_MAP
        }
    },
    computed: {
        hasStarted() {
            return this.form.status > ARRANGE_STATUS_MAP.ARRANGED
        },
        ...mapGetters(['getStoreListStore'])
    },
    created() {
        this.$bus.$on('open-arrange-info-modal', (arrangeDetail, isAdd) => {
            console.log(arrangeDetail)
            this.type = isAdd
            // this.form = this.type ? { ...arrangeDetail } :  {}
            this.form = { ...this.form, ...arrangeDetail }
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
