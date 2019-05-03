<template>
    <u-modal
        :visible="visible"
        :enableConfirm="$v.$anyDirty && !$v.$invalid"
        title="修改密码"
        @before-close="submit"
        @close="closeModal"
        class="a-password-modal"
    >
        <el-form ref="form" :model="form" label-width="70px">
            <el-form-item label="旧密码">
                <u-input v-model="$v.form.password.$model" placeholder="请输入密码" type="password" />
                <u-error :visible="!$v.form.password.required" text="请输入密码" />
                <u-error :visible="!$v.form.password.minLength" text="密码不能少于6个字符" />
            </el-form-item>
            <el-form-item label="新密码">
                <u-input v-model="$v.form.newPassword.$model" placeholder="请输入新密码" type="password" />
                <u-error :visible="!$v.form.newPassword.required" text="请输入密码" />
                <u-error :visible="!$v.form.newPassword.minLength" text="密码不能少于6个字符" />
            </el-form-item>
            <el-form-item label="确认密码">
                <u-input v-model="$v.form.newPasswordConfirm.$model" placeholder="请再次输入新密码" type="password" lazy />
                <u-error :visible="!$v.form.newPasswordConfirm.required" text="请再次输入新密码" />
                <u-error :visible="!$v.form.newPasswordConfirm.isTheSame" text="两次输入的新密码不一致" />
            </el-form-item>
        </el-form>
    </u-modal>
</template>

<script>
import { CloseModalMixin, InvalidCheckMixin } from '@/components/common/mixins'
import { required, minLength, helpers } from 'vuelidate/lib/validators'
import { setPassword } from '@/server/api'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('login')
const DEFAULT_FORM = {
    password: '',
    newPassword: '',
    newPasswordConfirm: ''
}

export default {
    mixins: [CloseModalMixin, InvalidCheckMixin],
    props: {
        visible: { type: Boolean, default: false }
    },
    data() {
        return {
            form: { ...DEFAULT_FORM }
        }
    },
    computed: {
        ...mapGetters(['getUserInfoStore'])
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
            password: {
                required,
                minLength: minLength(6)
            },
            newPassword: {
                required,
                minLength: minLength(6)
            },
            newPasswordConfirm: {
                required,
                isTheSame(value) {
                    return !helpers.req(value) || value === this.form.newPassword // 有值时!helpers.req为false，这时候才采取后面校验；没值时，不校验
                }
            }
        }
    },
    methods: {
        submit(e) {
            // 检查数据
            if (this._isInvalid()) return

            e.preventDefault()
            if (!e.ok) {
                this._openConfirmWhenChangedData()
                return
            }

            this._setPassword()
        },
        _openConfirmWhenChangedData() {
            this.$v.$anyDirty ? this.$confirm('确认放弃修改密码吗？').then(() => this.closeModal()) : this.closeModal()
        },
        _setPassword() {
            console.log(this.form)
            this.form.account = this.getUserInfoStore.account
            setPassword(this.form).then(() => {
                this.$message('密码修改成功')
                this._close()
            })
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
