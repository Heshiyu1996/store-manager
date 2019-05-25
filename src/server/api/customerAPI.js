import http from '../http.js'

/**
 * 客户来源
 */
// 获取客户来源列表
export const getCustomerList = data =>
    http({
        url: `/api/customer/list`,
        method: 'post',
        data
    })

// 增加客户来源
export const addCustomer = data =>
    http({
        url: `/api/customer/add`,
        method: 'post',
        data
    })

// 删除客户来源
export const deleteCustomer = data =>
    http({
        url: `/api/customer/delete`,
        method: 'delete',
        data
    })

// 修改客户来源
export const editCustomer = data =>
    http({
        url: `/api/customer/${data.id}`,
        method: 'put',
        data
    })

// 批量启用/禁用（客户来源）
export const updateCustomerStatus = data =>
    http({
        url: `/api/customer/status/update`,
        method: 'put',
        data
    })
