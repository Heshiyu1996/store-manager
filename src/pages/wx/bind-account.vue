<template>
    <div class="bind-account">
        <u-bind-up-wx v-if="!ifBound" :openid="openid" @bind-success="fetchOpenId" />

        <template v-else>
            <div class="info-wrapper">
                {{ accountInfo.nickname }}，你的账号已绑定，无需重复绑定。
                <ul>
                    <li>账号：{{ accountInfo.account }}</li>
                    <li>卡号：{{ accountInfo.cardId }}</li>
                </ul>
                <el-button style="float: right; padding: 3px 0" type="text" @click="removeBound">解绑</el-button>
            </div>
        </template>
    </div>
</template>

<script>
import { FetchOpenIdMixin } from '@/components/common/mixins'
import { removeBindAccount } from '@/server/api'

export default {
    name: 'bind-account',
    mixins: [FetchOpenIdMixin],
    data() {
        return {
            ifBound: false,
            openid: '',

            accountInfo: {}
        }
    },
    created() {
        this.fetchOpenId()
    },
    methods: {
        fetchOpenId() {
            this._getOpenId().then(openid => {
                this.openid = openid
                this.checkIfBind(openid)
            })
        },
        checkIfBind(openid) {
            this._checkIfBind(openid).then(data => {
                let { isBound, account, cardId, nickname } = data
                this.ifBound = isBound
                this.accountInfo = { account, cardId, nickname }
            })
        },
        removeBound() {
            removeBindAccount({ openid: this.openid }).then(() => {
                this.$message('解绑成功')
                this.ifBound = false
                localStorage.removeItem('openid')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.bind-account {
    .info-wrapper {
        padding: 20px;
    }
}
</style>
