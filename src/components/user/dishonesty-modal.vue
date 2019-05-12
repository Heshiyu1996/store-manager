<template>
    <u-modal :visible="visible" :title="type ? '新增失信人' : '编辑失信人'" @before-close="submit" @close="closeModal" class="u-dishonesty-modal">
        <el-form ref="form" :model="form" label-width="110px">
            <el-form-item v-if="!type" label="失信人ID">
                <u-label :text="form.id" />
            </el-form-item>
            <el-form-item label="分组名称">
                <u-input v-model="form.name" placeholder="请输入分组名称"> </u-input>
            </el-form-item>
            <el-form-item label="电话号码">
                <u-input v-model.number="form.telephone" placeholder="请输入电话号码"> </u-input>
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
import { addPaymentGroup, editPaymentGroup } from '@/server/api'
import { MODIFY_MODAL_TYPE } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')

export default {
    mixins: [CloseModalMixin, InvalidCheckMixin],
    props: {
        visible: { type: Boolean, default: false }
    },
    data() {
        return {
            type: MODIFY_MODAL_TYPE.ADD,

            form: {
                status: true
            }
        }
    },
    computed: {
        ...mapGetters(['getStoreListStore'])
    },
    created() {
        this.$bus.$on('open-dishonesty-modal', (groupDetail, isAdd) => {
            this.type = isAdd
            this.form = this.type ? { status: true } : { ...groupDetail }
        })
    },
    destroyed() {
        this.$bus.$off('open-dishonesty-modal')
    },
    methods: {
        submit(e) {
            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }

            this.type ? this._addPaymentGroup() : this._editPaymentGroup()
        },
        _addPaymentGroup() {
            let param = { ...this.form }
            addPaymentGroup(param).then(() => {
                this.$message('新增成功')
                this.closeModal(true)
            })
        },
        _editPaymentGroup() {
            let param = { ...this.form }
            editPaymentGroup(param).then(() => {
                this.$message('修改成功')
                this.closeModal(true)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.u-dishonesty-modal {
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
