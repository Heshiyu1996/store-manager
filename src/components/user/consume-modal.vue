<template>
    <u-modal :visible="visible" :title="type ? '新增消费记录' : '编辑消费记录'" @before-close="submit" @close="closeModal" class="u-consume-modal">
        <el-form ref="form" :model="form" label-width="110px">
            <el-form-item v-if="!type" label="流水ID">
                <u-label :text="form.id" />
            </el-form-item>
            <el-form-item v-if="!type" label="余额">
                <u-label :text="form.balance" />
            </el-form-item>
            <el-form-item v-if="!type" label="消费时间">
                <u-label :text="form.flowTime | dateFormat" />
            </el-form-item>
            <el-form-item label="金额" class="record-type-wrapper">
                <el-select v-model="recordType" filterable placeholder="请选择记录类型">
                    <el-option v-for="item in RECORD_TYPE_MAP" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                <u-input v-model.number="form.amount" :placeholder="'请输入' + (isRecharge ? '充值' : '消费') + '金额'" />
            </el-form-item>
            <el-form-item v-if="isRecharge" label="充值方式">
                <el-select v-model="form.rechargeWay" filterable placeholder="请选择充值方式">
                    <el-option v-for="item in RECHARGE_TYPE_MAP" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="isRecharge" label="操作门店">
                <el-select v-model="form.storeId" filterable>
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="流水描述">
                <u-input v-model="form.flowDesc" placeholder="请输入流水描述" type="textarea"> </u-input>
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { addConsume, editConsume } from '@/server/api'
import { RECHARGE_TYPE_MAP, MODIFY_MODAL_TYPE } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')

const RECORD_TYPE = {
    CONSUME: 1,
    RECHARGE: 2
}

const RECORD_TYPE_MAP = [
    {
        label: '消费',
        value: RECORD_TYPE.CONSUME
    },
    {
        label: '充值',
        value: RECORD_TYPE.RECHARGE
    }
]

export default {
    mixins: [CloseModalMixin, InvalidCheckMixin],
    props: {
        visible: { type: Boolean, default: false }
    },
    data() {
        return {
            type: MODIFY_MODAL_TYPE.ADD,

            form: {},
            recordType: 1,

            RECHARGE_TYPE_MAP,
            RECORD_TYPE,
            RECORD_TYPE_MAP
        }
    },
    computed: {
        isRecharge() {
            return this.recordType === RECORD_TYPE.RECHARGE
        },
        ...mapGetters(['getStoreListStore'])
    },
    created() {
        this.$bus.$on('open-consume-modal', (consumeDetail, isAdd) => {
            this.type = isAdd
            this.form = { ...consumeDetail }
            this._setRecordType()
        })
    },
    destroyed() {
        this.$bus.$off('open-consume-modal')
    },
    methods: {
        submit(e) {
            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }
            // 将数据预处理（例如：消费、充值金额正负号）
            this._beforeSubmit()
            this.type ? this._addConsume() : this._editConsume()
        },
        _addConsume() {
            let param = { ...this.form }
            addConsume(param).then(() => {
                this.$message('新增成功')
                this._close()
            })
        },
        _editConsume() {
            if (typeof this.form.flowTime !== 'number') {
                this.form.flowTime = this.form.flowTime.getTime()
            }
            let param = { ...this.form }
            editConsume(param).then(() => {
                this.$message('修改成功')
                this._close()
            })
        },
        _beforeSubmit() {
            if (this.recordType === RECORD_TYPE.CONSUME) {
                let num = this.form.amount
                this.form.amount = num - num * 2
            }
        },
        _setRecordType() {
            if (this.form.amount < 0) {
                this.recordType = RECORD_TYPE.CONSUME
                let num = this.form.amount
                this.form.amount = num - num * 2
            } else {
                this.recordType = RECORD_TYPE.RECHARGE
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.u-consume-modal {
    /deep/ .u-modal-body {
        min-height: 500px;
        overflow-y: visible;

        .el-form {
            width: 468px;

            .record-type-wrapper {
                .el-select {
                    width: 80px;
                    margin-right: 10px;
                }
                .u-input {
                    width: 230px;
                }
            }

            .textarea {
                height: 100px;
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
