<template>
    <u-modal :visible="visible" :title="type ? '新增会员卡' : '编辑会员卡'" @before-close="submit" @close="closeModal" class="card-info-modal">
        <el-form ref="form" :model="form" label-width="110px">
            <el-form-item label="卡号">
                <u-input v-model="form.cardId" placeholder="请输入卡号" />
            </el-form-item>
            <el-form-item label="初始金额">
                <u-input v-model="form.balance" placeholder="请输入初始金额" />
            </el-form-item>
            <el-form-item label="持卡人账号">
                <u-input v-model="form.ownerAccount" placeholder="请输入持卡人账号" />
            </el-form-item>
            <el-form-item label="开卡门店">
                <el-select v-model="form.storeId" filterable placeholder="请选择开卡门店">
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { addCard, editCard } from '@/server/api'
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
        this.$bus.$on('open-card-info-modal', (cardInfoDetail, isAdd) => {
            this.type = isAdd
            this.form = { ...cardInfoDetail }
            this._setRecordType()
        })
    },
    destroyed() {
        this.$bus.$off('open-card-info-modal')
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
            this.type ? this._addCard() : this._editCard()
        },
        _addCard() {
            let param = { ...this.form }
            addCard(param).then(() => {
                this.$message('新增成功')
                this._close()
            })
        },
        _editCard() {
            let param = { ...this.form }
            editCard(param).then(() => {
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
.card-info-modal {
    /deep/ .u-modal-body {
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
