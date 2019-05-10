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

// 用户登录
export const signIn = data =>
    http({
        url: `/api/user/signIn`,
        method: 'post',
        data
    })

// 用户注册
export const signUp = data =>
    http({
        url: `/api/user/signUp`,
        method: 'post',
        data
    })

// 用户登出
export const signOut = data =>
    http({
        url: `/api/user/signOut`,
        method: 'post',
        data
    })

// 当前用户信息查询
export const getUserInfo = data =>
    http({
        url: `/api/user/userInfo`,
        method: 'get',
        data
    })

// 用户信息查询（根据Account、且只能查自己的下级或自己）
export const getUserInfoByAccount = data =>
    http({
        url: `/api/user/${data}/userInfo`,
        method: 'get',
        data
    })

// 用户信息修改
export const setUserInfo = data =>
    http({
        url: `/api/user/${data.account}/userInfo`,
        method: 'put',
        data
    })

// 用户密码修改
export const setPassword = data =>
    http({
        url: `/api/user/${data.account}/password`,
        method: 'put',
        data
    })

// 用户列表查询
export const getUserList = data =>
    http({
        url: `/api/user/list`,
        method: 'post',
        data
    })

// 用户删除
export const deleteUser = data =>
    http({
        url: `/api/user/${data}`,
        method: 'delete',
        data
    })
