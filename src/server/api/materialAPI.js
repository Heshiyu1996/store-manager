import http from '../http.js'

/**
 * 物料管理
 */
// 获取仓库列表
export const getMaterialHouseList = data =>
    http({
        url: `/api/material/house/list`,
        method: 'post',
        data
    })

// 新增仓库
export const addMaterialHouse = data =>
    http({
        url: `/api/material/house/add`,
        method: 'post',
        data
    })

// 批量禁用/启用（仓库）
export const updateMaterialHouseStatus = data =>
    http({
        url: `/api/material/house/status/update`,
        method: 'put',
        data
    })

// 删除仓库
export const deleteMaterialHouse = data =>
    http({
        url: `/api/material/house/delete`,
        method: 'delete',
        data
    })

// 修改仓库信息
export const editMaterialHouse = data =>
    http({
        url: `/api/material/house/${data.id}`,
        method: 'put',
        data
    })

// 获取物料列表
export const getMaterialItemList = data =>
    http({
        url: `/api/material/item/list`,
        method: 'post',
        data
    })

// 新建物料
export const addMaterialItem = data =>
    http({
        url: `/api/material/item/add`,
        method: 'post',
        data
    })

// 批量禁用/启用（物料）
export const updateMaterialItemStatus = data =>
    http({
        url: `/api/material/item/status`,
        method: 'put',
        data
    })

// 删除物料
export const deleteMaterialItem = data =>
    http({
        url: `/api/material/item/delete`,
        method: 'delete',
        data
    })

// 修改物料信息
export const editMaterialItem = data =>
    http({
        url: `/api/material/item/${data.id}`,
        method: 'put',
        data
    })

// 获取预警物料列表
export const getMaterialAlarmItemList = data =>
    http({
        url: `/api/material/item/alarmlist`,
        method: 'post',
        data
    })
