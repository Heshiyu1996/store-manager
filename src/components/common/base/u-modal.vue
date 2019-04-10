<template>
    <transition name="el-fade-in-linear">
        <div class="u-modal-wapper" v-if="currentVisible" @click="maskClosable && cancel()" @keydown.esc="cancel()">
            <div class="u-modal" :class="type" v-bind="$attrs" v-on="$listeners">
                <div class="u-modal-head" v-if="title">
                    <slot name="head">
                        <div class="title">
                            <slot name="title">{{ title }}</slot>
                        </div>
                    </slot>
                </div>
                <div class="u-modal-body">
                    <slot>{{ content }}</slot>
                </div>
                <div class="u-modal-foot" v-if="okButton || cancelButton">
                    <el-button v-if="cancelButton" @click="cancel">{{ cancelButton }}</el-button>
                    <el-button v-if="okButton" @click="ok" :disabled="!enableConfirm" type="primary">{{ okButton }}</el-button>
                </div>
                <u-icon v-if="showClose" name="close" class="close" @click="cancel" />
            </div>
        </div>
    </transition>
</template>

<script>
import Vue from 'vue'

const ModalType = {
    Modal: 'modal',
    CONFIRM: 'confirm',
    ALERT: 'alert'
}

const Modal = {
    name: 'u-modal',
    props: {
        showClose: { type: Boolean, default: true },
        visible: { type: Boolean, default: false },
        enableConfirm: { type: Boolean, default: true },
        title: { type: String, default: '' },
        content: String,
        maskClosable: { type: Boolean, default: false },
        okButton: { type: String, default: '确定' },
        cancelButton: { type: String, default: '取消' },
        type: { type: String, default: ModalType.Modal }
    },
    data() {
        return {
            currentVisible: this.visible,
            ModalType
        }
    },
    watch: {
        visible(visible) {
            this.currentVisible = visible
        },
        currentVisible(visible) {
            document.body.style.overflow = visible ? 'hidden' : ''
        }
    },
    mounted() {
        document.body.appendChild(this.$el)
    },
    methods: {
        open() {
            if (!this.$el) this.$mount(document.createElement('div'))

            this.currentVisible = true
            this.$emit('update:visible', true)
            this.$emit('open')
        },
        ok() {
            this.$emit('ok')
            this.close(true)
        },
        cancel() {
            this.$emit('cancel')
            this.close(false)
        },
        close(ok) {
            let cancel = false
            this.$emit('before-close', {
                ok,
                preventDefault: () => (cancel = true)
            })
            if (cancel) return

            this.currentVisible = false
            this.$emit('update:visible', false)
            this.$emit('close', {
                ok
            })
        }
    }
}

Modal.confirm = (content, title, okButton, cancelButton) =>
    new Promise((resolve, reject) => {
        const Ctor = Vue.component('u-modal')
        if (!Ctor) return

        const instance = new Ctor({
            propsData: { content, title, okButton, cancelButton, type: ModalType.CONFIRM, showClose: false }
        })
        instance.$on('ok', () => resolve())
        instance.$on('cancel', () => reject())
        instance.open()
    })
Modal.alert = (content, title, okButton, cancelButton = '') =>
    new Promise((resolve, reject) => {
        const Ctor = Vue.component('u-modal')
        if (!Ctor) return

        const instance = new Ctor({
            propsData: { content, title, okButton, cancelButton, type: ModalType.ALERT, showClose: false }
        })
        instance.$on('ok', () => resolve())
        instance.open()
    })
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$alert = Modal.alert
export default Modal
</script>

<style lang="scss" scoped>
.u-modal-wapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    -webkit-overflow-scrolling: touch;
    touch-action: cross-slide-y pinch-zoom double-tap-zoom;
    text-align: center;
    overflow: hidden;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.5);

    &:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 100%;
    }

    &:focus {
        outline: none;
    }
}

.u-modal {
    position: relative;
    min-width: 440px;
    min-height: 240px;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    background: #ffffff;
    color: #222222;
    border: 1px solid #ebedf0;
    box-shadow: 0 2px 8px 0 rgba(23, 23, 26, 0.1), 0 2px 4px 0 rgba(23, 23, 26, 0.1);
    border-radius: 2px;

    &.confirm,
    &.alert {
        .u-modal-body {
            position: absolute;
            left: 50%;
            top: 40%;
            transform: translate(-50%, -50%);
            margin: 0;
        }

        .u-modal-foot {
            position: absolute;
            bottom: 40px;
            right: 50px;
            margin: 0;
        }
    }

    .close {
        position: absolute;
        right: 16px;
        top: 16px;
    }

    &-head {
        position: relative;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid $border-color;

        .title {
            padding-left: 20px;
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
        }
    }

    &-body {
        position: relative;
        margin: 30px 25px;
        max-height: 60vh;
        max-width: 80vw;
        overflow-y: auto;
    }

    &-foot {
        margin: 30px 25px;
        text-align: right;

        .u-button {
            margin-left: 20px;

            &:first-child {
                margin-left: 0;
            }
        }
    }
}
</style>
