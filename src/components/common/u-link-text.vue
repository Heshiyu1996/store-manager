<template>
    <div class="u-link-text" :disabled="disabled" @click="onClick" v-on="listeners">
        <u-icon v-if="icon" :name="icon" :color="disabled ? '#c4ccd8' : '#337EFF'" />
        <u-link>{{ text }}</u-link>
        <u-tooltip v-if="tooltip" :content="tooltip"><u-icon name="info"/></u-tooltip>
    </div>
</template>

<script>
export default {
    props: {
        icon: { type: String, default: '' },
        text: { type: [String, Number] },
        disabled: { type: Boolean, default: false },
        tooltip: { type: String, default: '' }
    },
    computed: {
        listeners() {
            const listeners = Object.assign({}, this.$listeners)
            delete listeners.click
            return listeners
        }
    },
    methods: {
        onClick(e) {
            if (this.disabled) return e.preventDefault()

            this.$emit('click', e)
        }
    }
}
</script>

<style lang="scss" scoped>
.u-link-text {
    display: inline-block;
    color: $primary-color;

    &[disabled] {
        color: $brand-disabled;

        .u-link {
            cursor: not-allowed;
        }
    }

    .u-icon {
        margin-right: 5px;
    }
}
</style>
