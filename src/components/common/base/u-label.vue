<template>
    <span class="u-label" :title="text" :style="style" :reset="reset">
        <slot>{{ text }}</slot>
    </span>
</template>

<script>
export default {
    props: {
        text: { type: [String, Number], default: '' },
        reset: { type: Boolean, default: false },
        maxWidth: { type: [String, Number], default: 160 }
    },
    computed: {
        style() {
            return { 'max-width': this.maxWidth + 'px' }
        }
    }
}
</script>

<style lang="scss" scoped>
.u-label {
    @include ellipse();
    display: inline-block;

    &[reset] {
        display: inline;
        overflow: unset;
        white-space: normal;
        max-width: none;
    }
}
</style>
