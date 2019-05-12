<template>
    <u-modal :visible="visible" title="用户修改信息" @before-close="submit" @close="closeModal" class="a-password-modal">
        <el-form ref="form" :model="form" label-width="68px">
            <el-form-item v-if="isGM" label="账号类型">
                <el-select v-model="form.userType" filterable placeholder="请选择账号类型" @change="changeUserType">
                    <el-option v-for="item in userTypeModifiedList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名">
                <u-input v-model="form.realName" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="手机">
                <u-input v-model="form.phone" :regex="/^[0-9\u4e00-\u9fa5]+$/g" maxLength="11" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="生日">
                <el-date-picker v-model="form.birthday" type="date" placeholder="请输入你的生日" size="medium"> </el-date-picker>
            </el-form-item>
            <template v-if="form.userType === USER_TYPE.NORMAL">
                <el-form-item label="卡号">
                    <u-input v-model="form.cardId" placeholder="请输入卡号" />
                </el-form-item>
                <el-form-item label="卡种">
                    <el-select v-model="form.cardType" filterable placeholder="请选择卡种">
                        <el-option v-for="item in CARD_TYPE_MAP" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
            </template>
            <template v-else>
                <el-form-item label="所属门店">
                    <el-select v-model="form.storeId" filterable placeholder="请选择所属门店">
                        <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
            </template>
        </el-form>
    </u-modal>
</template>

<script>
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
// import { required, requiredIf, minLength, helpers } from 'vuelidate/lib/validators'
import { setUserInfo } from '@/server/api'
import { USER_TYPE, USER_TYPE_MAP, MODIFY_MODAL_TYPE, CARD_TYPE_MAP } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')
const DEFAULT_FORM = {
    realName: '',
    phone: '',
    birthday: Date.now(),
    userType: 0,

    cardId: '',
    cardType: '',

    storeId: ''
}

export default {
    mixins: [CloseModalMixin, InvalidCheckMixin],
    props: {
        visible: { type: Boolean, default: false }
    },
    data() {
        return {
            type: MODIFY_MODAL_TYPE.ADD,
            form: { ...DEFAULT_FORM },

            account: '',

            USER_TYPE,
            USER_TYPE_MAP,
            CARD_TYPE_MAP
        }
    },
    computed: {
        isGM() {
            return this.getUserInfoStore.userType > USER_TYPE.NORMAL
        },
        userTypeModifiedList() {
            return USER_TYPE_MAP.filter(item => item.value <= this.getUserInfoStore.userType)
        },
        ...mapGetters(['getUserInfoStore', 'getStoreListStore'])
    },
    created() {
        this.$bus.$on('open-userinfo-modal', accountDetail => {
            console.log(accountDetail)
            this.form = { ...DEFAULT_FORM, ...accountDetail }
        })
    },
    destroyed() {
        this.$bus.$off('open-userinfo-modal')
    },
    // validations: {
    //     form: {
    //         userType: { required },
    //         realName: {
    //             required,
    //             minLength: minLength(2)
    //         },
    //         phone: {
    //             required,
    //             isPhone(value) {
    //                 let regex_phone = /^1[345678][0-9]{9}$/
    //                 return !helpers.req(value) || regex_phone.test(value) // 有值时!helpers.req为false，这时候才采取后面校验；没值时，不校验
    //             }
    //         },
    //         birthday: { required },
    //         cardId: {
    //             required: requiredIf(function() {
    //                 console.log(this.form.userType)
    //                 return this.form.userType === USER_TYPE.NORMAL
    //             })
    //         },
    //         cardType: {
    //             required: requiredIf(function() {
    //                 return this.form.userType === USER_TYPE.NORMAL
    //             })
    //         },
    //         storeId: {
    //             required: requiredIf(function() {
    //                 return this.form.userType !== USER_TYPE.NORMAL
    //             })
    //         }
    //     }
    // },
    methods: {
        submit(e) {
            // 检查数据
            // if (this._isInvalid()) return

            e.preventDefault()
            if (!e.ok) {
                this.closeModal()
                return
            }

            this._setUserInfo()
        },
        _setUserInfo() {
            if (typeof this.form.birthday !== 'number') {
                this.form.birthday = this.form.birthday.getTime()
            }
            setUserInfo(this.form).then(() => {
                this.$message('修改成功')
                this.closeModal(true)
            })
        },
        changeUserType(val) {
            if (val === USER_TYPE.NORMAL) {
                this.form.storeId = ''
            } else {
                this.form.cardId = ''
                this.form.cardType = ''
            }
        },
        _resetData() {
            this.form = { ...DEFAULT_FORM }
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .u-modal-body {
    overflow-y: visible;

    .u-error {
        position: absolute;
        bottom: -15px;
        font-size: 12px;
    }
}
</style>
