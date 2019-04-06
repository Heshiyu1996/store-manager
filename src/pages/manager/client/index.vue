<template>
    <div class="client-index">
        我是顾客
    </div>
</template>

<script>
export default {
    name: 'client-index',
    data() {
        return {
            activeIndex: '1'
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath)
        }
    }
}
</script>

<style lang="scss" scoped>
.client-index {
}
</style>
