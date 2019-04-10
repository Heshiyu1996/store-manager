export default {
    methods: {
        _isInvalid() {
            this.$v.$touch() // 手动检查全局
            console.log(this.$v)
            return this.$v.$invalid
        }
    }
}
