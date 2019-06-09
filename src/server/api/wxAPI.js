import http from '../http.js'

/**
 * 微信
 */
// 获得openid
export const getOpenId = data =>
    http({
        url: `/api/wx/user/openid`,
        method: 'post',
        data
    })

// 绑定大笨象账号
export const bindAccount = data =>
    http({
        url: `/api/wx/user/bind/${data.type}`,
        method: 'post',
        data
    })

// 解绑大笨象账号
export const removeBindAccount = data =>
    http({
        url: `/api/wx/user/bind/remove`,
        method: 'post',
        data
    })

// 获取账号是否已绑定大笨象账号
export const checkIfBind = data =>
    http({
        url: `/api/wx/user/bind/check`,
        method: 'post',
        data
    })

// 通过openid查流水
export const getFlowListWX = data =>
    http({
        url: `/api/wx/card/flowlist`,
        method: 'post',
        data
    })
