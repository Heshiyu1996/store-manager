<template>
    <div class="u-layout" :direction="direction" @click="clickHandle"><slot></slot></div>
</template>
<script>
export default {
    name: 'u-layout',
    props: {
        direction: {
            default: 'h',
            validator: value => ['h', 'v'].includes(value)
        }
    },
    methods: {
        clickHandle(e) {
            this.$emit('click', e)
        }
    }
}
</script>
<style lang="scss" scoped>
$margin-small: 10px;
$margin-base: 20px;
$margin-large: 30px;

.u-layout {
    &[direction='h'] {
        & > *:not(:last-child) {
            margin-right: $margin-base;
        }

        &[gap='shrink'] {
            & > *:not(:last-child) {
                margin-right: -1px;
            }
        }

        &[gap='none'] {
            & > *:not(:last-child) {
                margin-right: 0;
            }
        }

        &[gap='s'] {
            & > *:not(:last-child) {
                margin-right: $margin-small;
            }
        }

        &[gap='l'] {
            & > *:not(:last-child) {
                margin-right: $margin-large;
            }
        }
    }

    &[direction='v'] {
        & > *:not(:last-child) {
            margin-bottom: $margin-base;
        }

        &[gap='shrink'] {
            & > *:not(:last-child) {
                margin-bottom: -1px;
            }
        }

        &[gap='none'] {
            & > *:not(:last-child) {
                margin-bottom: 0;
            }
        }

        &[gap='s'] {
            & > *:not(:last-child) {
                margin-bottom: $margin-small;
            }
        }

        &[gap='l'] {
            & > *:not(:last-child) {
                margin-bottom: $margin-large;
            }
        }
    }
}
</style>
