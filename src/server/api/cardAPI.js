import http from '../http.js'

/**
 * 会员卡管理
 */
// 会员卡流水列表
export const getConsumeList = data =>
    http({
        url: `/api/card/${data.cardId}/flow/list`,
        method: 'post',
        data
    })

// 会员卡流水删除
export const deleteConsume = data =>
    http({
        url: `/api/card/${data.cardId}/flow/${data.id}`,
        method: 'delete',
        data
    })

// 会员卡流水详情（暂时无用）
export const getConsumeDetailById = data =>
    http({
        url: `/api/card/${data.cardId}/flow/${data.id}`,
        method: 'get',
        data
    })

// 会员卡流水修改
export const editConsume = data =>
    http({
        url: `/api/card/${data.cardId}/flow/${data.id}`,
        method: 'put',
        data
    })

// 会员卡流水新增
export const addConsume = data =>
    http({
        url: `/api/card/${data.cardId}/flow/add`,
        method: 'post',
        data
    })

// 获取会员卡列表
export const getCardList = data =>
    http({
        url: `/api/card/list`,
        method: 'post',
        data
    })

// 新增会员卡
export const addCard = data =>
    http({
        url: `/api/card/add`,
        method: 'post',
        data
    })

// 编辑会员卡
export const editCard = data =>
    http({
        url: `/api/card/${data.cardId}`,
        method: 'put',
        data
    })

// 删除会员卡
export const deleteCard = data =>
    http({
        url: `/api/card/${data}`,
        method: 'delete',
        data
    })
