<template>
    <div class="login">
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
    methods: {
        toggleBox() {
            this.showSignIn = !this.showSignIn
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
