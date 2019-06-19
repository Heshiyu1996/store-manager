import http from '../http.js'

/**
 * 主题管理
 */
// 获取主题列表
export const getThemeList = data =>
    http({
        url: `/api/theme/list`,
        method: 'post',
        data
    })

// 增加主题
export const addTheme = data =>
    http({
        url: `/api/theme/add`,
        method: 'post',
        data
    })

// 删除主题
export const deleteTheme = data =>
    http({
        url: `/api/theme/delete`,
        method: 'delete',
        data
    })

// 修改主题
export const editTheme = data =>
    http({
        url: `/api/theme/${data.id}`,
        method: 'put',
        data
    })

// 批量启用/禁用（主题）
export const updateThemeStatus = data =>
    http({
        url: `/api/theme/status/update`,
        method: 'put',
        data
    })

// 音频上传
export const uploadVoice = data =>
    http({
        url: `/api/voice/upload`,
        method: 'post',
        data
    })

// 音频保存
export const saveVoice = data =>
    http({
        url: `/api/voice/save`,
        method: 'post',
        data
    })
