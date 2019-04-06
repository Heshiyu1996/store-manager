<template>
    <div class="login">
        <el-card class="login-box">
            <div slot="header" class="clearfix">
                <span>用户登录</span>
                <el-button style="float: right; padding: 3px 0" type="text">注册新账号</el-button>
            </div>
            <div class="content">
                <el-form ref="form" :model="form">
                    <el-form-item>
                        <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="passwordMemory">记住密码</el-checkbox>
                        <u-link-text class="password-forget" text="忘记密码" @click="fogetPassword" />
                    </el-form-item>

                    <el-form-item class="operation">
                        <el-button type="primary" @click="onSubmit" round>登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            form: {
                name: '',
                password: ''
            },

            passwordMemory: false
        }
    },
    methods: {
        onSubmit() {
            console.log('submit!')
        },
        fogetPassword() {
            console.log(1)
        }
    }
}
</script>

<style lang="scss" scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: $border-color;

    .login-box {
        display: inline-block;
        position: relative;
        width: 400px;
        height: 496px;

        /deep/ .el-card__body {
            padding: 40px;

            .content {
                .el-input,
                .el-button {
                    width: 320px;
                }
            }

            .password-forget {
                position: absolute;
                right: 0;
            }

            .operation {
                position: absolute;
                bottom: 30px;
            }
        }
    }
}
</style>
