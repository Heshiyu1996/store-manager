<template>
    <nav class="u-sign-up-wx">
        <el-card class="sign-up-wrapper">
            <div slot="header" class="clearfix">
                <span>注册</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="goToBindAccount">去绑定</el-button>
            </div>
            <div class="content">
                <el-form ref="form" :model="form">
                    <el-form-item>
                        <u-input v-model="form.account" placeholder="请输入账号" lazy />
                        <u-error :visible="!$v.form.account.required" text="请输入账号" />
                        <u-error :visible="!$v.form.account.checkFormat" text="支持长度为2~15的英文、中文、下划线，不能包含空格" />
                        <u-error :visible="!$v.form.account.isUnique && !$v.form.account.$pending" text="该账号已被注册" />
                    </el-form-item>
                    <el-form-item>
                        <u-input v-model="form.password" placeholder="请输入密码" type="password" />
                        <u-error :visible="!$v.form.password.required" text="请输入密码" />
                        <u-error :visible="!$v.form.password.minLength" text="密码不能少于6个字符" />
                    </el-form-item>
                    <el-form-item>
                        <u-input v-model="form.passwordConfirm" placeholder="请再次输入密码" type="password" lazy />
                        <u-error :visible="!$v.form.passwordConfirm.required" text="请再次输入密码" />
                        <u-error :visible="!$v.form.passwordConfirm.isTheSame" text="两次输入的密码不一致" />
                    </el-form-item>
                    <el-form-item>
                        <u-input v-model="form.realName" placeholder="请输入姓名" />
                        <u-error :visible="!$v.form.realName.required" text="请输入姓名" />
                        <u-error :visible="!$v.form.realName.minLength" text="姓名不能少于2个字符" />
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="form.birthday" type="date" placeholder="请输入你的生日" size="medium"> </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <u-input v-model="form.phone" :regex="/^[0-9\u4e00-\u9fa5]+$/g" maxLength="11" placeholder="请输入手机号" />
                        <u-error :visible="!$v.form.phone.required" text="手机必填" />
                        <u-error :visible="!$v.form.phone.isPhone" text="手机格式不正确" />
                    </el-form-item>
                    <el-form-item>
                        <ASmsCodeInput v-model="form.smsCode" :phone="form.phone" :isCorrectPhone="!$v.form.phone.required || !$v.form.phone.isPhone" />
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="autoBind">注册后自动绑定当前微信号</el-checkbox>
                    </el-form-item>
                    <el-form-item class="operation">
                        <el-button type="primary" @click="onSubmit" :disabled="$v.$invalid" round class="sign-up-btn">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </nav>
</template>

<script>
import { FetchOpenIdMixin } from '@/components/common/mixins'
import USignUp from '@/components/common/u-sign-up'
import { signUp } from '@/server/api'
import { USER_TYPE, WX_URL } from '@/utils/config'

export default {
    mixins: [FetchOpenIdMixin, USignUp],
    props: {},
    data() {
        return {
            form: {
                account: '',
                password: '',
                passwordConfirm: '',
                realName: '',
                phone: '',
                birthday: '',
                smsCode: '',
                userType: USER_TYPE.NORMAL
            },

            openid: '',

            autoBind: false
        }
    },
    created() {
        this.fetchOpenId()
    },
    methods: {
        goToBindAccount() {
            window.open(`${WX_URL.PRE_FIX}bind-account${WX_URL.POST_FIX}`)
        },
        fetchOpenId() {
            this._getOpenId().then(openid => (this.openid = openid))
        },
        onSubmit() {
            if (typeof this.form.birthday !== 'number') {
                this.form.birthday = this.form.birthday.getTime()
            }

            let param = { ...this.form, openid: this.autoBind ? this.openid : '' }
            signUp(param).then(() => {
                if (this.autoBind) {
                    window.open(`${WX_URL.PRE_FIX}bind-account${WX_URL.POST_FIX}`)
                } else {
                    this.$message('注册成功，你可以通过“大笨象密室公众号” —— “账号绑定”进行账号绑定了', 8000)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.u-sign-up-wx {
    display: inline-block;
    position: relative;
    width: 100vw;

    .sign-up-wrapper {
        border: 0;
        box-shadow: unset;

        /deep/ .el-card__body {
            padding: 30px 40px 0;

            .el-form-item {
                margin-bottom: 20px !important;
            }

            .smsCode-button {
                font-size: 0.12rem;
            }

            .operation {
                bottom: 0;
            }

            .login-type-wrapper {
                bottom: -20px;
            }
        }
    }

    .u-input,
    .el-input,
    input {
        width: 100% !important;
    }

    .sign-up-btn {
        width: 100%;
    }

    /deep/ .u-sign-up {
        height: 6rem;

        .smsCode-button {
            width: 1.6rem !important;
        }
    }
}
</style>
