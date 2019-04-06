<template>
    <a :class="['u-icon', isSvg ? name : '']" :href="href" :disabled="disabled" @click="onClick" v-on="listeners">
        <svgicon v-if="isSvg" :name="name" :scale="scale" v-bind="$attrs" :original="original" /> <img v-else :src="imgSrc" v-bind="$attrs" />
    </a>
</template>

<script>
import ULink from './u-link.vue'

export default {
    mixins: [ULink],
    props: {
        name: { type: String, default: '' },
        // disclick: { type: Boolean, default: false },
        scale: { type: [String, Number], default: '1' },
        original: { type: Boolean, default: true }
    },
    computed: {
        isSvg() {
            return !~this.name.indexOf('.')
        },
        imgSrc() {
            return /^(http|https)/g.test(this.name) ? this.name : require(`@/assets/img/${this.name}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.u-icon {
    position: relative;
    align-items: center;
    display: inline-block;
    vertical-align: middle;
    line-height: 0;
    overflow: hidden;

    &[disabled] {
        cursor: not-allowed;
    }

    img {
        max-width: 100%;
        max-height: 100%;
    }
}
</style>
