<template>
    <nav class="u-bind-up-wx">
        <el-card class="bind-up-wrapper">
            <div slot="header" class="clearfix">
                <span>绑定</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="goToSignUp">去注册</el-button>
            </div>
            <div class="content">
                <el-form ref="form" :model="form">
                    <template v-if="form.type === LOGIN_TYPE.BY_PHONE">
                        <el-form-item>
                            <u-input v-model="form.phone" type="number" :regex="/^[0-9\u4e00-\u9fa5]+$/g" maxLength="11" placeholder="请输入手机号" />
                            <u-error :visible="!$v.form.phone.required" text="手机必填" />
                            <u-error :visible="!$v.form.phone.isPhone" text="手机格式不正确" />
                        </el-form-item>
                        <el-form-item>
                            <ASmsCodeInput
                                v-model="form.smsCode"
                                :phone="form.phone"
                                :isCorrectPhone="!$v.form.phone.required || !$v.form.phone.isPhone"
                                :isLogin="true"
                            />
                        </el-form-item>
                    </template>

                    <template v-else>
                        <el-form-item>
                            <u-input v-model.trim="form.account" :regex="/^[a-zA-Z0-9\u4e00-\u9fa5]+$/g" maxLength="100" placeholder="请输入账号" />
                            <u-error :visible="!$v.form.account.required" text="账号不能为空" />
                        </el-form-item>
                        <el-form-item>
                            <u-input v-model.trim="form.password" maxLength="100" placeholder="请输入密码" type="password" @keypress.enter="onSubmit" />
                            <u-error :visible="!$v.form.password.required" text="密码不能为空" />
                        </el-form-item>
                    </template>
                    <el-form-item class="operation">
                        <el-button type="primary" @click="onSubmit" :disabled="$v.$invalid" round class="bind-up-btn">绑定</el-button>
                    </el-form-item>

                    <el-form-item class="login-type-wrapper">
                        <u-link-text class="login-type-btn" :text="!!form.type ? '使用账号密码绑定' : '使用手机号绑定'" @click="toggletype" />
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </nav>
</template>

<script>
import ASmsCodeInput from '@/components/account/a-smsCode-input'
import { requiredIf, helpers } from 'vuelidate/lib/validators'
import { bindAccount } from '@/server/api'
import { WX_URL } from '@/utils/config'

const LOGIN_TYPE = {
    BY_ACCOUNT: 0,
    BY_PHONE: 1
}

export default {
    components: { ASmsCodeInput },
    props: {
        openid: { type: String, default: '' }
    },
    data() {
        return {
            form: {
                openid: '',
                account: '',
                password: '',
                phone: '',
                smsCode: '',
                type: LOGIN_TYPE.BY_PHONE
            },

            value: '',

            LOGIN_TYPE
        }
    },
    validations: {
        form: {
            account: {
                required: requiredIf(function() {
                    return this.form.type === LOGIN_TYPE.BY_ACCOUNT
                })
            },
            password: {
                required: requiredIf(function() {
                    return this.form.type === LOGIN_TYPE.BY_ACCOUNT
                })
            },
            phone: {
                required: requiredIf(function() {
                    return this.form.type === LOGIN_TYPE.BY_PHONE
                }),
                isPhone(value) {
                    let regex_phone = /^1[345678][0-9]{9}$/
                    return !helpers.req(value) || regex_phone.test(value) // 有值时!helpers.req为false，这时候才采取后面校验；没值时，不校验
                }
            },
            smsCode: {
                required: requiredIf(function() {
                    return this.form.type === LOGIN_TYPE.BY_PHONE
                })
            }
        }
    },
    methods: {
        toggletype() {
            if (this.form.type === LOGIN_TYPE.BY_ACCOUNT) {
                this.form.type = LOGIN_TYPE.BY_PHONE
                this.form.account = ''
                this.form.password = ''
            } else {
                this.form.type = LOGIN_TYPE.BY_ACCOUNT
                this.form.phone = ''
                this.form.smsCode = ''
            }
        },
        goToSignUp() {
            window.open(`${WX_URL.PRE_FIX}sign-up-wx${WX_URL.POST_FIX}`)
        },
        onSubmit() {
            let param = { ...this.form, openid: this.openid }
            bindAccount(param).then(() => {
                this.$message('绑定成功')
                this.$emit('bind-success')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.u-bind-up-wx {
    position: absolute;
    top: 56px;
    width: 100vw;
    height: 3rem;

    .bind-up-wrapper {
        border: 0;
        box-shadow: unset;

        /deep/ .el-card__body {
            padding: 40px;
            padding-top: 30px;

            .content {
                .el-input,
                .el-button {
                    width: 320px;
                }
                .el-form-item {
                    margin-bottom: 20px !important;
                }
            }

            .operation {
                position: absolute;
                bottom: 30px;

                .bind-up-btn {
                    width: 78vw !important;
                }
            }

            .login-type-wrapper {
                position: absolute;
                right: 40px;
                bottom: -20px;
            }
        }

        .u-input,
        input {
            width: 100%;
        }

        .smsCode-button {
            width: 1.8rem !important;
            font-size: 0.12rem;
        }
    }
}
</style>
