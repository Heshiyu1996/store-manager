<template>
    <u-modal
        :visible="visible"
        :enableConfirm="$v.$anyDirty && !$v.$invalid"
        title="新增用户"
        @before-close="submit"
        @close="closeModal"
        class="a-add-user-modal"
    >
        <el-form ref="form" :model="form" label-width="70px">
            <el-form-item label="账号类型">
                <el-select v-model="$v.form.userType.$model" filterable placeholder="请选择账号类型" @change="changeUserType">
                    <el-option v-for="item in userTypeModifiedList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账号">
                <u-input v-model="$v.form.account.$model" placeholder="请输入账号" lazy />
                <u-error :visible="!$v.form.account.required" text="请输入账号" />
                <u-error :visible="!$v.form.account.checkFormat" text="支持长度为2~15的英文、中文、下划线，不能包含空格" />
                <u-error :visible="!$v.form.account.isUnique && !$v.form.account.$pending" text="该账号已被注册" />
            </el-form-item>
            <el-form-item label="密码">
                <u-input v-model="$v.form.password.$model" placeholder="请输入密码" type="password" />
                <u-error :visible="!$v.form.password.required" text="请输入密码" />
                <u-error :visible="!$v.form.password.minLength" text="密码不能少于6个字符" />
            </el-form-item>
            <el-form-item label="姓名">
                <u-input v-model="$v.form.realName.$model" placeholder="请输入姓名" />
                <u-error :visible="!$v.form.realName.required" text="请输入姓名" />
                <u-error :visible="!$v.form.realName.minLength" text="姓名不能少于2个字符" />
            </el-form-item>
            <el-form-item label="手机">
                <u-input v-model="$v.form.phone.$model" :regex="/^[0-9\u4e00-\u9fa5]+$/g" maxLength="11" placeholder="请输入手机号" />
                <u-error :visible="!$v.form.phone.required" text="手机必填" />
                <u-error :visible="!$v.form.phone.isPhone" text="手机格式不正确" />
            </el-form-item>
            <el-form-item label="生日">
                <el-date-picker v-model="$v.form.birthday.$model" type="date" placeholder="请输入你的生日" size="medium"> </el-date-picker>
            </el-form-item>
            <template v-if="form.userType === USER_TYPE.NORMAL">
                <el-form-item label="卡号">
                    <u-input v-model="$v.form.cardId.$model" :regex="/^\d+$/g" placeholder="请输入卡号" />
                    <u-error :visible="!$v.form.cardId.required" text="卡号必填" />
                </el-form-item>
                <el-form-item label="卡种">
                    <el-select v-model="$v.form.cardType.$model" filterable placeholder="请选择卡种">
                        <el-option v-for="item in CARD_TYPE_MAP" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开卡门店">
                    <el-select v-model="$v.form.storeId.$model" filterable placeholder="请选择开卡门店">
                        <el-option v-for="item in getStoreListStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                </el-form-item>
            </template>
        </el-form>
    </u-modal>
</template>

<script>
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { required, requiredIf, minLength, helpers } from 'vuelidate/lib/validators'
import { signUp, checkAccount } from '@/server/api'
import { USER_TYPE, USER_TYPE_MAP, CARD_TYPE_MAP } from '@/utils/config'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')
const DEFAULT_FORM = {
    account: '',
    password: '',
    realName: '',
    phone: '',
    birthday: Date.now(),
    userType: USER_TYPE.NORMAL,

    cardId: '',
    cardType: '',

    storeId: '',
    // extra
    passwordConfirm: ''
}

export default {
    mixins: [CloseModalMixin, InvalidCheckMixin],
    props: {
        visible: { type: Boolean, default: false }
    },
    data() {
        return {
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
    watch: {
        visible(val) {
            if (val) {
                this.$v.$reset()
            } else {
                this._resetData()
            }
        }
    },
    validations: {
        form: {
            account: {
                required,
                checkFormat: function(value) {
                    let regex_account = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,}$/g
                    return !helpers.req(value) || regex_account.test(value) // 有值时!helpers.req为false，这时候才采取后面校验；没值时，不校验
                },
                async isUnique(value) {
                    let result = helpers.req(value) && (await checkAccount(value))
                    return !result
                }
            },
            password: {
                required,
                minLength: minLength(6)
            },
            realName: {
                required,
                minLength: minLength(2)
            },
            phone: {
                required,
                isPhone(value) {
                    let regex_phone = /^1[345678][0-9]{9}$/
                    return !helpers.req(value) || regex_phone.test(value) // 有值时!helpers.req为false，这时候才采取后面校验；没值时，不校验
                }
            },
            userType: { required },
            birthday: { required },
            cardId: {
                required: requiredIf(function() {
                    return this.form.userType === USER_TYPE.NORMAL
                })
            },
            cardType: {
                required: requiredIf(function() {
                    return this.form.userType === USER_TYPE.NORMAL
                })
            },
            storeId: {
                required: requiredIf(function() {
                    return this.form.userType === USER_TYPE.NORMAL
                })
            }
        }
    },
    methods: {
        submit(e) {
            // 检查数据
            // if (this._isInvalid()) return
            e.preventDefault()

            if (!e.ok) {
                this._openConfirmWhenChangedData()
                return
            }

            this._signUp()
        },
        _signUp() {
            if (typeof this.form.birthday !== 'number') {
                this.form.birthday = this.form.birthday.getTime()
            }
            signUp(this.form).then(() => {
                this.$message('添加用户成功')
                this.closeModal(true)
            })
        },
        _openConfirmWhenChangedData() {
            console.log(this.$v.$anyDirty)
            this.$v.$anyDirty ? this.$confirm('确认放弃修改吗？').then(() => this.closeModal(true)) : this.closeModal(false)
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
