import http from '../http.js'

/**
 * 密室统计
 */
// 收入统计
export const getIncomeStatisticsList = data =>
    http({
        url: `/api/statistics/income/list`,
        method: 'post',
        data
    })

// 订单统计
export const getOrderStatisticsList = data =>
    http({
        url: `/api/statistics/order/list`,
        method: 'post',
        data
    })
