<template>
    <u-modal :visible="visible" :title="type ? '新增消费记录' : '编辑消费记录'" @before-close="submit" @close="closeModal" class="a-password-modal">
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
            <el-form-item label="消费/充值金额">
                <u-input v-model.number="form.amount" placeholder="请输入消费/充值金额" />
            </el-form-item>
            <el-form-item label="充值方式">
                <el-select v-model="form.rechargeWay" filterable placeholder="请选择充值方式">
                    <el-option v-for="item in RECHARGE_TYPE_MAP" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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

export default {
    mixins: [CloseModalMixin, InvalidCheckMixin],
    props: {
        visible: { type: Boolean, default: false }
    },
    data() {
        return {
            type: MODIFY_MODAL_TYPE.ADD,

            form: {},
            RECHARGE_TYPE_MAP
        }
    },
    created() {
        this.$bus.$on('open-consume-modal', (consumeDetail, isAdd) => {
            this.type = isAdd
            this.form = { ...consumeDetail }
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
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .u-modal-body {
    overflow-y: visible;

    .el-form {
        width: 468px;
    }

    .u-error {
        position: absolute;
        bottom: -15px;
        font-size: 12px;
    }
}
</style>
