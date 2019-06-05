<template>
    <u-modal :visible="visible" :title="type ? '新增入库记录' : '编辑入库记录'" @before-close="submit" @close="closeModal" class="m-import-info-modal">
        <el-form ref="form" :model="form" label-width="110px">
            <el-form-item v-if="!type" label="入库记录ID">
                <u-label :text="form.id" />
            </el-form-item>
            <el-form-item label="所属门店">
                <el-select v-model="form.storeId" filterable placeholder="请选择所属门店" disabled="">
                    <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请人员">
                <el-select v-model="form.applicantAccount" filterable placeholder="请选择申请人员">
                    <el-option v-for="item in otherList['staffList']" :key="item.account" :label="item.nickName" :value="item.account"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="物料名称">
                <el-select v-model="form.itemId" filterable placeholder="请选择物料名称">
                    <el-option v-for="item in otherList['materialItemList']" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请数量">
                <u-input v-model="form.amount" placeholder="请输入申请数量"> </u-input>
            </el-form-item>
            <el-form-item label="备注">
                <u-input v-model="form.remark" placeholder="请输入备注" type="textarea"> </u-input>
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { addMaterialImport, editMaterialImport, getOtherList } from '@/server/api'
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

            form: {},
            otherList: {}

            // materialHouseList: []
        }
    },
    computed: {
        ...mapGetters(['getStoreListStore'])
    },
    created() {
        this.$bus.$on('open-material-import-info-modal', (itemDetail, isAdd) => {
            console.log(itemDetail)
            this.type = isAdd
            this.form = { ...itemDetail }
            this._getOtherList()
        })
    },
    destroyed() {
        this.$bus.$off('open-material-import-info-modal')
    },
    methods: {
        submit(e) {
            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }

            this.type ? this._addMaterialImport() : this._editMaterialImport()
        },
        _getOtherList() {
            let { storeId } = this.form
            getOtherList({ storeId }).then(data => {
                this.otherList = data || {}
            })
        },
        _addMaterialImport() {
            let param = { ...this.form }
            addMaterialImport(param).then(() => {
                this.$message('新增成功')
                this.closeModal(true)
            })
        },
        _editMaterialImport() {
            let param = { ...this.form }
            editMaterialImport(param).then(() => {
                this.$message('修改成功')
                this.closeModal(true)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.m-import-info-modal {
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
