<template>
    <nav class="u-sign-in">
        <el-card class="sign-in-wrapper">
            <div slot="header" class="clearfix">
                <span>用户登录</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="toggleBox">去注册</el-button>
            </div>
            <div class="content">
                <el-form ref="form" :model="form">
                    <el-form-item>
                        <u-input v-model.trim="form.account" :regex="/^[a-zA-Z0-9\u4e00-\u9fa5]+$/g" maxLength="100" placeholder="请输入账号" />
                        <u-error :visible="!$v.form.account.required" text="账号不能为空" />
                    </el-form-item>
                    <el-form-item>
                        <u-input v-model.trim="form.password" maxLength="100" placeholder="请输入密码" type="password" @keypress.enter="onSubmit" />
                        <u-error :visible="!$v.form.password.required" text="密码不能为空" />
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="passwordMemory">记住密码</el-checkbox>
                        <u-link-text class="password-forget" text="忘记密码" @click="fogetPassword" />
                    </el-form-item>

                    <el-form-item class="operation">
                        <el-button type="primary" @click="onSubmit" :disabled="$v.$invalid" round>登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </nav>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { signIn } from '@/server/api'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('login')

export default {
    props: {},
    data() {
        return {
            form: {
                account: '',
                password: ''
            },

            passwordMemory: false,
            value: ''
        }
    },
    validations: {
        form: {
            account: { required },
            password: { required }
        }
    },
    methods: {
        toggleBox() {
            this.$emit('toggle')
        },
        onSubmit() {
            console.log(this.form)
            signIn(this.form).then(() => {
                this.$message('登录成功')
                this.actSetIfLogin(true)
                this.$bus.$emit('getUserInfo')
            })
        },
        fogetPassword() {
            console.log(1)
        },
        ...mapActions(['actSetIfLogin', 'actSetUserInfoStore'])
    }
}
</script>

<style lang="scss" scoped>
.u-sign-in {
    display: inline-block;
    position: relative;
    width: 400px;
    height: 520px;

    .sign-in-wrapper {
        height: 100%;

        /deep/ .el-card__body {
            padding: 40px;
            padding-top: 30px;

            .content {
                .el-input,
                .el-button {
                    width: 320px;
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
