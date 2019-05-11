import http from '../http.js'

/**
 * 门店管理
 */
// 获取门店列表
export const getStoreList = data =>
    http({
        url: `/api/store/list`,
        method: 'post',
        data
    })

// 门店新增
export const addStore = data =>
    http({
        url: `/api/store/add`,
        method: 'post',
        data
    })

// 门店删除
export const deleteStore = data =>
    http({
        url: `/api/store/${data}`,
        method: 'delete',
        data
    })

// 门店修改
export const editStore = data =>
    http({
        url: `/api/store/${data.id}`,
        method: 'put',
        data
    })
