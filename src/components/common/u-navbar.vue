<template>
    <nav class="u-navbar navbar fix-top">
        <div class="left">大笨象密室逃脱 | 管理平台</div>
        <div class="right">
            <div v-if="true" class="user-wrapper">
                <div class="avatar-wrapper">
                    <u-icon name="avatar.png"></u-icon>
                </div>
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
    methods: {}
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
    }

    .right {
        display: inline-block;

        .user-wrapper {
            display: inline-block;
            width: 30px;
            height: 30px;
            border-radius: 30px;
            cursor: pointer;
            background: red;
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
