import http from '../http.js'

/**
 * 会员卡系统
 */
// 会员卡流水列表
export const getConsumeList = data =>
    http({
        url: `/elephant/card/${data.cardId}/flow/list`,
        method: 'post',
        data
    })

// 会员卡流水删除
export const deleteConsume = data =>
    http({
        url: `/elephant/card/${data.cardId}/flow/${data.id}`,
        method: 'delete',
        data
    })

// 会员卡流水详情（暂时无用）
export const getConsumeDetailById = data =>
    http({
        url: `/elephant/card/${data.cardId}/flow/${data.id}`,
        method: 'get',
        data
    })

// 会员卡流水修改
export const editConsume = data =>
    http({
        url: `/elephant/card/${data.cardId}/flow/${data.id}`,
        method: 'put',
        data
    })

// 会员卡流水新增
export const addConsume = data =>
    http({
        url: `/elephant/card/${data.cardId}/flow/add`,
        method: 'post',
        data
    })
