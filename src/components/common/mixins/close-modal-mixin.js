export default {
    methods: {
        closeModal(success = false) {
            this._close(success)
        },
        _close(success = false, modifyType) {
            this.$emit('close', success, modifyType)
        }
    }
}
