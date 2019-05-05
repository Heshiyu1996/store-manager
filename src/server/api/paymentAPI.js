import http from '../http.js'

/**
 * 支付类型
 */
// 获取支付类型列表
export const getPaymentList = data =>
    http({
        url: `/elephant/payment/type/list`,
        method: 'post',
        data
    })

// 添加支付类型
export const addPayment = data =>
    http({
        url: `/elephant/payment/type/add`,
        method: 'post',
        data
    })

// 批量启用/禁用（支付类型）
export const updatePaymentStatus = data =>
    http({
        url: `/elephant/payment/type/status/update`,
        method: 'put',
        data
    })

// 删除支付类型
export const deletePayment = data =>
    http({
        url: `/elephant/payment/type/delete`,
        method: 'delete',
        data
    })

// 修改支付类型
export const editPayment = data =>
    http({
        url: `/elephant/payment/type/${data.typeId}`,
        method: 'put',
        data
    })

/**
 * 支付类型分组
 */
// 获取支付类型分组列表
export const getPaymentGroupList = data =>
    http({
        url: `/elephant/payment/group/list`,
        method: 'post',
        data
    })

// 添加支付类型分组
export const addPaymentGroup = data =>
    http({
        url: `/elephant/payment/group/add`,
        method: 'post',
        data
    })

// 批量启用/禁用（支付类型分组）
export const updatePaymentGroupStatus = data =>
    http({
        url: `/elephant/payment/group/status/update`,
        method: 'put',
        data
    })

// 删除支付类型分组
export const deletePaymentGroup = data =>
    http({
        url: `/elephant/payment/group/delete`,
        method: 'delete',
        data
    })

// 修改支付类型分组
export const editPaymentGroup = data =>
    http({
        url: `/elephant/payment/group/${data.groupId}`,
        method: 'put',
        data
    })
