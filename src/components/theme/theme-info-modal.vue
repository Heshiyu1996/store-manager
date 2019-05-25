<template>
    <u-modal :visible="visible" :title="type ? '新增主题' : '编辑主题'" @before-close="submit" @close="closeModal" class="key-info-modal">
        <el-form ref="form" :model="form" label-width="110px">
            <el-form-item v-if="!type" label="主题ID">
                <u-label :text="form.id" />
            </el-form-item>
            <el-form-item label="主题名称">
                <u-input v-model="form.name" placeholder="请输入主题名称"> </u-input>
            </el-form-item>
            <el-form-item label="游戏时长">
                <u-input v-model.number="form.duration" placeholder="请输入游戏时长（单位：分）" />
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
import { addTheme, editTheme } from '@/server/api'
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
                id: '',
                name: '',
                storeId: '',
                status: true
            }
        }
    },
    computed: {
        ...mapGetters(['getStoreListStore'])
    },
    created() {
        this.$bus.$on('open-theme-info-modal', (keyDetail, isAdd) => {
            this.type = isAdd
            this.form = this.type ? { status: true } : { ...keyDetail }
        })
    },
    destroyed() {
        this.$bus.$off('open-theme-info-modal')
    },
    methods: {
        submit(e) {
            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }

            this.type ? this._addTheme() : this._editTheme()
        },
        _addTheme() {
            let param = { ...this.form }
            addTheme(param).then(() => {
                this.$message('新增成功')
                this.closeModal(true)
            })
        },
        _editTheme() {
            let param = { ...this.form }
            editTheme(param).then(() => {
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
