<template>
    <nav class="u-navbar-mobile navbar fix-top">
        <div class="left"><u-icon name="slogan.png" class="slogan"></u-icon></div>
    </nav>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            searchParams: {
                code: '',
                state: ''
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.u-navbar-mobile {
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

    &.fix-top {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
    }
}
</style>
