<template>
    <u-modal :visible="visible" :title="type ? '新增客户来源' : '编辑客户来源'" @before-close="submit" @close="closeModal" class="key-info-modal">
        <el-form ref="form" :model="form" label-width="110px">
            <el-form-item v-if="!type" label="客户来源ID">
                <u-label :text="form.id" />
            </el-form-item>
            <el-form-item label="来源名称">
                <u-input v-model="form.name" placeholder="请输入客户来源名称"> </u-input>
            </el-form-item>
            <el-form-item label="来源类别">
                <el-select v-model="form.sourceType" filterable placeholder="请选择来源类别">
                    <el-option v-for="item in SOURCE_TYPE_MAP" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属门店">
                <el-select v-model="form.storeId" filterable placeholder="请选择所属门店">
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="使用状态">
                <el-radio v-model="form.status" :label="true">启用</el-radio>
                <el-radio v-model="form.status" :label="false">禁用</el-radio>
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { addCustomer, editCustomer } from '@/server/api'
import { MODIFY_MODAL_TYPE } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')
const SOURCE_TYPE_MAP = [
    {
        value: 1,
        label: '线上'
    },
    {
        value: 2,
        label: '线下'
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
                id: '',
                name: '',
                storeId: '',
                status: true
            },
            SOURCE_TYPE_MAP
        }
    },
    computed: {
        ...mapGetters(['getStoreListStore'])
    },
    created() {
        this.$bus.$on('open-customer-info-modal', (keyDetail, isAdd) => {
            this.type = isAdd
            this.form = this.type ? { status: true } : { ...keyDetail }
        })
    },
    destroyed() {
        this.$bus.$off('open-customer-info-modal')
    },
    methods: {
        submit(e) {
            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }

            this.type ? this._addCustomer() : this._editCustomer()
        },
        _addCustomer() {
            let param = { ...this.form }
            addCustomer(param).then(() => {
                this.$message('新增成功')
                this.closeModal(true)
            })
        },
        _editCustomer() {
            let param = { ...this.form }
            editCustomer(param).then(() => {
                this.$message('修改成功')
                this.closeModal(true)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.key-info-modal {
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
