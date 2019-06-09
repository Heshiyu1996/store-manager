import { getOpenId, checkIfBind } from '@/server/api'

export default {
    methods: {
        _getOpenId() {
            return new Promise((resolve, reject) => {
                let openid = localStorage.getItem('openid')
                if (openid) {
                    return resolve(openid)
                }
                let str = location.href,
                    targetObj = /\?/g.exec(str)
                if (!targetObj) {
                    this.$message.error('请从微信公众号打开此绑定页面')
                    return
                }

                let startIdx = targetObj.index || 0,
                    paramList = str.slice(startIdx + 1).split('&')

                let param = {}
                paramList.forEach(item => {
                    let [key, value] = item.split('=')
                    param[key] = value
                })

                getOpenId(param)
                    .then(openid => resolve(openid))
                    .catch(err => reject(err))
            })
        },
        _checkIfBind(openid) {
            return new Promise((resolve, reject) => {
                checkIfBind({ openid })
                    .then(data => resolve(data))
                    .catch(err => reject(err))
            })
        }
    }
}
