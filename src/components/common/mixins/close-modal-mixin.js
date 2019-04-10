export default {
    methods: {
        closeModal() {
            this._close()
        },
        _close(success = false, modifyType) {
            this.$emit('close', success, modifyType)
        }
    }
}
