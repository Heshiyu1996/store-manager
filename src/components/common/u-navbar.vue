<template>
    <nav class="u-navbar navbar fix-top">
        <div class="left" @click="goHomePage">大笨象密室逃脱 | 管理平台</div>
        <div>
            <p @click="gotoPage('/manager')">
                管理员
            </p>
            <p @click="gotoPage('/user')">
                用户
            </p>
            <p @click="gotoPage('/login')">
                登录
            </p>
        </div>
        <div class="right">
            <div v-if="true" class="user-wrapper">
                <span class="name">大笨象密室深圳一店</span>
                <el-dropdown @command="handleAvatar">
                    <div class="avatar-wrapper">
                        <u-icon name="avatar.png"></u-icon>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="updateInfo">编辑信息</el-dropdown-item>
                        <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div v-else class="sign-wrapper">
                <span class="sign sign-in">登录</span>
                <span class="sign sign-up">注册</span>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    props: {},
    data() {
        return {}
    },
    methods: {
        goHomePage() {
            this.$router.push('/')
        },
        handleAvatar(ev) {
            console.log(ev)
        },
        gotoPage(path) {
            this.$router.push(path)
        }
    }
}
</script>

<style lang="scss" scoped>
.u-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    margin-bottom: 20px;
    padding: 0 40px;
    border: 1px solid transparent;
    border-width: 0 0 1px;
    background: $normal-color-m;
    border-color: $border-color;
    color: $white;

    .left {
        display: inline-block;
        min-width: 300px;
        @include font-large(16px, $white);
        cursor: pointer;
    }

    .right {
        display: inline-block;

        .user-wrapper {
            display: inline-block;

            .name {
                line-height: 30px;
                width: 200px;
                max-width: 200px;
                vertical-align: middle;
                margin-right: 10px;
            }

            .avatar-wrapper {
                width: 30px;
                height: 30px;
                border-radius: 30px;
                cursor: pointer;

                .u-icon {
                    height: 30px;
                }
            }
        }

        .sign-wrapper {
            display: inline-block;

            .sign {
                cursor: pointer;
            }

            .sign-in {
                margin-right: 10px;
            }

            .sign-up {
            }
        }
    }

    &.fix-top {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    }
}
</style>
