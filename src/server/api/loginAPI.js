import http from '../http.js'

/**
 * 登录管理
 */
// 用户名检测
export const checkAccount = data =>
    http({
        url: `/elephant/user/${data}/check`,
        method: 'get',
        data
    })

// 用户登录
export const signIn = data =>
    http({
        url: `/elephant/user/signIn`,
        method: 'post',
        data
    })

// 用户注册
export const signUp = data =>
    http({
        url: `/elephant/user/signUp`,
        method: 'post',
        data
    })

// 用户登出
export const signOut = data =>
    http({
        url: `/elephant/user/signOut`,
        method: 'post',
        data
    })

// 当前用户信息查询
export const getUserInfo = data =>
    http({
        url: `/elephant/user/userInfo`,
        method: 'get',
        data
    })

// 用户信息查询（管理员）
export const getUserInfoByGM = data =>
    http({
        url: `/elephant/user/${data}/userInfo`,
        method: 'get',
        data
    })
