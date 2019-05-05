<template>
    <nav class="u-navbar navbar fix-top">
        <div class="left" @click="goHomePage">大笨象密室逃脱 | 管理平台</div>
        <div class="right">
            <div v-if="getIflogin" class="user-wrapper">
                <span class="name">{{ getUserInfoStore.realName }}</span>
                <el-dropdown @command="handleAvatar">
                    <div class="avatar-wrapper">
                        <u-icon name="avatar.png"></u-icon>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item disabled>{{ getUserInfoStore.account }}</el-dropdown-item>
                        <el-dropdown-item command="updateInfo" divided>编辑信息</el-dropdown-item>
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

        <AUserinfoModal :visible="isOpenUserInfoModal" @close="closeUserInfoModal" />
        <APasswordModal :visible="isOpenPasswordModal" @close="closePasswordModal" />
    </nav>
</template>

<script>
import AUserinfoModal from '@/components/account/a-userinfo-modal'
import APasswordModal from '@/components/account/a-password-modal'
import { signOut, getUserInfo } from '@/server/api'
import { createNamespacedHelpers } from 'vuex'
import { USER_TYPE } from '@/utils/config'

const { mapGetters, mapActions } = createNamespacedHelpers('login')

export default {
    props: {},
    components: { AUserinfoModal, APasswordModal },
    data() {
        return {
            ifLogin: false,

            isOpenUserInfoModal: false,
            isOpenPasswordModal: false
        }
    },
    computed: {
        ...mapGetters(['getIflogin', 'getUserInfoStore'])
    },
    watch: {
        getIflogin(val) {
            val && this._getUserInfo()
        }
    },
    created() {
        this._getUserInfo()
    },
    methods: {
        _getUserInfo() {
            getUserInfo()
                .then(data => {
                    this.actSetIfLogin(true)
                    this.actSetUserInfoStore({ ...data })

                    if (this.$route.name === 'login') {
                        this.$router.push(this.getUserInfoStore.userType === USER_TYPE.NORMAL ? { name: 'user' } : { name: 'manager' })
                    }
                })
                // TODO: 避免未登录状态下会跳到登录页
                .catch(() => this.$router.push({ name: 'login' }))
        },
        closeUserInfoModal() {
            this.isOpenUserInfoModal = false
            this._getUserInfo()
        },
        closePasswordModal(isSuccess) {
            this.isOpenPasswordModal = false
            // 点击ok
            if (isSuccess) {
                // 创建实体 Or 编辑实体名称
                console.log('创建实体 Or 编辑实体名称')
            } else {
                // 点击cancel
                console.log('点击cancel')
            }
        },
        logout() {
            this.$confirm('是否退出登录?', '提示', {
                confirmButtonText: '是',
                cancelButtonText: '否',
                type: 'warning'
            }).then(() => {
                signOut().then(() => {
                    this.actSetIfLogin(false)
                    this.actSetUserInfoStore({})
                    this.$message('登出成功')
                    this.$router.push({ name: 'login' })
                })
            })
        },
        changePassword() {
            this.isOpenPasswordModal = true
        },
        updateInfo() {
            this.$bus.$emit('open-userinfo-modal', this.getUserInfoStore)
            this.isOpenUserInfoModal = true
        },
        goHomePage() {
            this.$router.push('/')
        },
        handleAvatar(ev) {
            console.log(ev)
            let op = {
                logout: this.logout,
                changePassword: this.changePassword,
                updateInfo: this.updateInfo
            }
            op[ev]()
        },
        gotoPage(path) {
            this.$router.push(path)
        },
        ...mapActions(['actSetIfLogin', 'actSetUserInfoStore'])
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
