<template>
    <div class="login" :style="{ backgroundImage: `url(${bgImg})` }">
        <!-- <u-navbar /> -->
        <transition name="el-zoom-in-center" mode="out-in">
            <u-sign-in v-if="showSignIn" @toggle="toggleBox" />
            <u-sign-up v-else @toggle="toggleBox" />
        </transition>
    </div>
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            showSignIn: true,
            bgImg: require('@/assets/img/bg.png')
        }
    },
    created() {
        this.$route.params.type === 'sign-up' && this.toggleBox()
        this.$bus.$on('toggleBox', loginType => this.toggleBox(loginType))
    },
    beforeDestroy() {
        this.$bus.$off('toggleBox', loginType => this.toggleBox(loginType))
    },
    methods: {
        toggleBox(loginType) {
            if (loginType) {
                this.showSignIn = loginType === 'sign-in' ? true : false
            } else {
                this.showSignIn = !this.showSignIn
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.login {
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    top: 0;
    height: 100%;
    width: 100%;
    background-size: 100% 100%;
}
</style>
