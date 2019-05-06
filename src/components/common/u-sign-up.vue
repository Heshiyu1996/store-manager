<template>
    <nav class="u-sign-up">
        <el-card class="sign-up-wrapper">
            <div slot="header" class="clearfix">
                <span>用户注册</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="toggleBox">去登录</el-button>
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
                        <u-input v-model="form.phone" :regex="/^[0-9\u4e00-\u9fa5]+$/g" maxLength="11" placeholder="请输入手机号" />
                        <u-error :visible="!$v.form.phone.required" text="手机必填" />
                        <u-error :visible="!$v.form.phone.isPhone" text="手机格式不正确" />
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="form.birthday" type="date" placeholder="请输入你的生日" size="medium"> </el-date-picker>
                    </el-form-item>

                    <el-form-item class="operation">
                        <el-button type="primary" @click="onSubmit" :disabled="$v.$invalid" round>注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </nav>
</template>

<script>
import { required, helpers, minLength } from 'vuelidate/lib/validators'
import { checkAccount, signUp } from '@/server/api'
import { USER_TYPE } from '@/utils/config'

export default {
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
                userType: USER_TYPE.NORMAL
            },

            value: ''
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
            passwordConfirm: {
                required,
                isTheSame(value) {
                    return !helpers.req(value) || value === this.form.password // 有值时!helpers.req为false，这时候才采取后面校验；没值时，不校验
                }
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
            birthday: { required }
        }
    },
    methods: {
        toggleBox() {
            this.$emit('toggle')
        },
        onSubmit() {
            if (typeof this.form.birthday !== 'number') {
                this.form.birthday = this.form.birthday.getTime()
            }
            signUp(this.form).then(() => {
                this.$message('注册成功')
                this.toggleBox()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.u-sign-up {
    display: inline-block;
    position: relative;
    width: 400px;
    height: 520px;

    .sign-up-wrapper {
        height: 100%;

        /deep/ .el-card__body {
            padding: 40px;
            padding-top: 30px;

            .content {
                .el-input,
                .el-button,
                input {
                    width: 320px;
                    height: 40px;
                }
                .el-form-item {
                    margin-bottom: 16px;
                }
            }

            .password-forget {
                position: absolute;
                right: 0;
            }

            .operation {
                position: absolute;
                bottom: 20px;
            }
        }
    }
}
</style>
