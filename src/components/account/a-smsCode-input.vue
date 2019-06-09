<template>
    <div class="a-smsCode-input">
        <div class="smsCode-wrapper">
            <u-input v-model="smsCode" type="number" placeholder="请输入手机验证码" class="smsCode-input" />
            <el-button :disabled="smsCodeButtonDisabled" @click="getSmsCode" plain class="smsCode-button">{{ smsCodeButtonText }}</el-button>
        </div>
        <u-error :visible="!$v.smsCode.required" text="请输入手机验证码" />
    </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { getSignupSmsCode, getSigninSmsCode } from '@/server/api'

const WAIT_TIME_CONFIG = 45

export default {
    props: {
        code: { type: Number },
        phone: { type: String, default: '188' },
        isCorrectPhone: { type: Boolean, default: false },
        isLogin: { type: Boolean, default: false }
    },
    data() {
        return {
            smsCode: '',

            smsCodeWaitTime: 0,
            waitTimerID: -1
        }
    },
    watch: {
        smsCode(val) {
            this.$emit('input', val)
        }
    },
    computed: {
        smsCodeButtonText() {
            let text = !this.smsCodeWaitTime ? '获取验证码' : `已发送（${this.smsCodeWaitTime}s）`
            return text
        },
        smsCodeButtonDisabled() {
            let hasWaitTime = !!this.smsCodeWaitTime
            return this.isCorrectPhone || hasWaitTime
        }
    },
    validations: {
        smsCode: { required }
    },
    methods: {
        getSmsCode() {
            if (this.smsCodeButtonDisabled) return

            let param = { phone: this.phone }
            this.isLogin &&
                getSigninSmsCode(param).then(() => {
                    this.$message('短信验证码已发送，请查收！')
                    this.countWaitTime()
                })

            !this.isLogin &&
                getSignupSmsCode(param).then(() => {
                    this.$message('短信验证码已发送，请查收！')
                    this.countWaitTime()
                })
        },
        countWaitTime() {
            this.smsCodeWaitTime = WAIT_TIME_CONFIG
            if (this.waitTimerID)
                this.waitTimerID = setInterval(() => {
                    this.smsCodeWaitTime--

                    if (!this.smsCodeWaitTime) {
                        clearInterval(this.waitTimerID)
                    }
                }, 1000)
        }
    }
}
</script>

<style lang="scss" scoped>
.a-smsCode-input {
    .smsCode-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;

        /deep/ .smsCode-input {
            display: inline-block;
            width: 600px;
            margin-right: 10px;

            input {
                width: 100% !important;
            }
        }

        .smsCode-button {
            display: inline-block;
            width: 120px;
            height: 40px;
            padding: 0;
        }
    }
}
</style>
