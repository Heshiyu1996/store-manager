import http from '../http.js'

/**
 * 登录管理
 */
// 用户名检测
export const checkAccount = data =>
    http({
        url: `/api/user/${data}/check`,
        method: 'get',
        data
    })

// 登录
export const signIn = data =>
    http({
        url: `/api/user/signIn`,
        method: 'post',
        data
    })

// 注册
export const signUp = data =>
    http({
        url: `/api/user/signUp`,
        method: 'post',
        data
    })

// 登出
export const signOut = data =>
    http({
        url: `/api/user/signOut`,
        method: 'post',
        data
    })
