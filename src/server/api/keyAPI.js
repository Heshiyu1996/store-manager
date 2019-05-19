import http from '../http.js'

/**
 * 钥匙管理
 */
// 获取钥匙列表
export const getKeyList = data =>
    http({
        url: `/api/key/list`,
        method: 'post',
        data
    })

// 钥匙新增
export const addKey = data =>
    http({
        url: `/api/key/add`,
        method: 'post',
        data
    })

// 钥匙删除
export const deleteKey = data =>
    http({
        url: `/api/key/delete`,
        method: 'delete',
        data
    })

// 钥匙修改
export const editKey = data =>
    http({
        url: `/api/key/${data.id}`,
        method: 'put',
        data
    })

// 批量启用/禁用（钥匙）
export const updateKeyStatus = data =>
    http({
        url: `/api/key/status/update`,
        method: 'put',
        data
    })
