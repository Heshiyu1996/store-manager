<template>
    <div class="login">
        <u-navbar />
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
            showSignIn: true
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
    justify-content: center;
    align-items: center;
    height: 100%;
    background: $border-color;
}
</style>
