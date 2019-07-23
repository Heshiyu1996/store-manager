import http from '../http.js'

/**
 * 用户管理
 */
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

// 失信名单列表
export const getDishonestyList = data =>
    http({
        url: `/api/dishonesty/list`,
        method: 'post',
        data
    })

// 增加失信人
export const addDishonesty = data =>
    http({
        url: `/api/dishonesty/add`,
        method: 'post',
        data
    })

// 修改失信人
export const editDishonesty = data =>
    http({
        url: `/api/dishonesty/${data.id}`,
        method: 'put',
        data
    })

// 删除失信人
export const deleteDishonesty = data =>
    http({
        url: `/api/dishonesty/delete`,
        method: 'delete',
        data
    })

// 批量启用/禁用（失信人）
export const updateDishonestyStatus = data =>
    http({
        url: `/api/dishonesty/status/update`,
        method: 'put',
        data
    })

// 获取预定所需信息的列表
export const getOtherList = data =>
    http({
        url: `/api/common/list`,
        method: 'post',
        data
    })

// 一键导出手机
export const outputPhoneList = data =>
    http({
        url: `/api/user/output`,
        method: 'post',
        data
    })
