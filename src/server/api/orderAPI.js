import http from '../http.js'

/**
 * 订单管理
 */
// 获取安排列表
export const getReserveList = data =>
    http({
        url: `/api/order/arrange/list`,
        method: 'post',
        data
    })

// 新增预定
export const addReserve = data =>
    http({
        url: `/api/order/reserve/add`,
        method: 'post',
        data
    })

// 删除预定
export const deleteReserve = data =>
    http({
        url: `/api/order/reserve/${data}`,
        method: 'delete',
        data
    })

// 修改预定
export const editReserve = data =>
    http({
        url: `/api/order/reserve/${data.id}`,
        method: 'put',
        data
    })

// 执行预定（即开始游戏）
export const startReserve = data =>
    http({
        url: `/api/order/reserve/${data}/update`,
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

// 获取预定所需信息的列表
export const getOrderOtherList = data =>
    http({
        url: `/api/order/reserve/other/list`,
        method: 'post',
        data
    })

// 获取指定日期及门店的收款情况
export const getIncomeList = data =>
    http({
        url: `/api/order/income/list`,
        method: 'post',
        data
    })
