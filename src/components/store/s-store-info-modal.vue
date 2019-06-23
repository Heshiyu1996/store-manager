<template>
    <u-modal :visible="visible" :title="type ? '新增门店' : '编辑门店'" @before-close="submit" @close="closeModal" class="s-store-modal">
        <el-form ref="form" :model="form" label-width="110px">
            <el-form-item label="门店名称">
                <u-input v-model="form.name" placeholder="请输入门店名称"> </u-input>
            </el-form-item>
            <el-form-item label="电话">
                <u-input v-model="form.telephone" :regex="/^\d+$/g" placeholder="请输入门店电话" />
            </el-form-item>
            <el-form-item label="省/市">
                <el-cascader v-model="form.area" size="large" :options="cityAreaOptions" />
            </el-form-item>
            <el-form-item label="详细地址">
                <u-input v-model="form.address" placeholder="请输入门店详细地址"> </u-input>
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import { provinceAndCityData } from 'element-china-area-data'
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { addStore, editStore } from '@/server/api'
import { RECHARGE_TYPE_MAP, MODIFY_MODAL_TYPE } from '@/utils/config'

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

            form: {
                area: []
            },
            recordType: 1,
            cityAreaOptions: provinceAndCityData,

            RECHARGE_TYPE_MAP,
            RECORD_TYPE_MAP
        }
    },
    created() {
        this.$bus.$on('open-store-info-modal', (storeDetail, isAdd) => {
            this.type = isAdd
            this.form = { ...storeDetail }
        })
    },
    destroyed() {
        this.$bus.$off('open-store-info-modal')
    },
    methods: {
        submit(e) {
            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }

            this.type ? this._addStore() : this._editStore()
        },
        _addStore() {
            let param = { ...this.form }
            addStore(param).then(() => {
                this.$message('新增成功')
                this.closeModal(true)
            })
        },
        _editStore() {
            let param = { ...this.form }
            editStore(param).then(() => {
                this.$message('修改成功')
                this.closeModal(true)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.s-store-modal {
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
