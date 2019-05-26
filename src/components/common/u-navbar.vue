<template>
    <nav class="u-navbar navbar fix-top">
        <div class="left" @click="goHomePage"><u-icon name="slogan.png" class="slogan"></u-icon> | <span class="platform">管理平台</span></div>
        <div class="right">
            <u-layout v-if="getIflogin" class="user-wrapper" gap="s">
                <el-tag size="mini" :user-type="getUserInfoStore.userType">{{ userTypeModified }}</el-tag>
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
            </u-layout>
            <div v-else class="sign-wrapper">
                <span class="sign sign-in" @click="goToLogin('sign-in')">登录</span>
                <span class="sign sign-up" @click="goToLogin('sign-up')">注册</span>
            </div>
        </div>

        <AUserinfoModal :visible="isOpenUserInfoModal" @close="closeUserInfoModal" />
        <APasswordModal :visible="isOpenPasswordModal" @close="closePasswordModal" />
    </nav>
</template>

<script>
import AUserinfoModal from '@/components/account/a-userinfo-modal'
import APasswordModal from '@/components/account/a-password-modal'
import { signOut, getUserInfo, getStoreList } from '@/server/api'
import { createNamespacedHelpers } from 'vuex'
import { USER_TYPE, USER_TYPE_MAP } from '@/utils/config'
import { isMock } from '@/utils/config'

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
        isGM() {
            return this.getUserInfoStore.userType !== USER_TYPE.NORMAL
        },
        userTypeModified() {
            let targetObj = USER_TYPE_MAP.filter(item => item.value === this.getUserInfoStore.userType)[0]
            return (targetObj && targetObj.label) || '未知身份'
        },
        ...mapGetters(['getIflogin', 'getUserInfoStore', 'getStoreListStore'])
    },
    created() {
        this._getUserInfo()
        this.$bus.$on('getUserInfo', () => this._getUserInfo())
    },
    beforeDestroy() {
        this.$bus.$off('getUserInfo')
    },
    methods: {
        _getUserInfo() {
            getUserInfo()
                .then(userInfo => {
                    this.actSetIfLogin(true)
                    this.actSetUserInfoStore({ ...userInfo })
                    this.isGM && this._getStoreList()

                    if (this.$route.name === 'login') {
                        this.$router.push(this.isGM ? { name: 'manager' } : { name: 'client' })
                    }
                })
                // TODO: 避免未登录状态下会跳到登录页
                .catch(() => !isMock && this.$router.push({ name: 'login' }))
        },
        _getStoreList() {
            getStoreList({ currentPage: 1 })
                .then(data => {
                    this.actSetStoreListStore(data.list || [])
                })
                .catch(e => console.log(e))
        },
        closeUserInfoModal(isSuccess) {
            this.isOpenUserInfoModal = false
            isSuccess && this._getUserInfo()
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
        goToLogin(loginType) {
            if (this.$route.name === 'login') {
                // 本身就在login页内
                this.$bus.$emit('toggleBox', loginType)
            } else {
                this.$router.push({ name: 'login', params: { type: loginType } })
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
        ...mapActions(['actSetIfLogin', 'actSetUserInfoStore', 'actSetStoreListStore'])
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

        .slogan {
            width: 110px;
            margin-right: 5px;
        }

        .platform {
            margin-left: 5px;
        }
    }

    .right {
        display: inline-block;

        .user-wrapper {
            display: inline-block;

            .el-tag {
                vertical-align: middle;
                color: white;

                // 0普通用户、1~5依次代表：店员、副店、店长、区域管理员、老板
                &[user-type='0'] {
                    background-color: #409eff;
                }
                &[user-type='1'] {
                    background-color: #dbb64c;
                }
                &[user-type='2'] {
                    background-color: #6d6dc1;
                }
                &[user-type='3'] {
                    background-color: #67c23a;
                }
                &[user-type='4'] {
                    background-color: #e6a23c;
                }
                &[user-type='5'] {
                    background-color: #f56c6c;
                }
            }

            .name {
                line-height: 30px;
                width: 200px;
                max-width: 200px;
                vertical-align: middle;
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
