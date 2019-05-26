import http from '../http.js'

/**
 * 订单管理
 */
// 获取订单列表
export const getKeyList = data =>
    http({
        url: `/api/key/list`,
        method: 'post',
        data
    })

// 订单新增
export const addKey = data =>
    http({
        url: `/api/key/add`,
        method: 'post',
        data
    })

// 订单删除
export const deleteKey = data =>
    http({
        url: `/api/key/delete`,
        method: 'delete',
        data
    })

// 订单修改
export const editKey = data =>
    http({
        url: `/api/key/${data.id}`,
        method: 'put',
        data
    })

// 获取历史订单列表
export const getOrderHistoryList = data =>
    http({
        url: `/api/order/history/list`,
        method: 'post',
        data
    })
