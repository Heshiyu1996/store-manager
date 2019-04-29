/**
 * 深拷贝
 */
export const deepClone = source => {
    if (!source || typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone')
    }
    var targetObj = source.constructor === Array ? [] : {}
    for (var keys in source) {
        if (source.hasOwnProperty(keys)) {
            if (source[keys] && typeof source[keys] === 'object') {
                targetObj[keys] = source[keys].constructor === Array ? [] : {}
                targetObj[keys] = deepClone(source[keys])
            } else {
                targetObj[keys] = source[keys]
            }
        }
    }
    return targetObj
}

/**
 *生成唯一ID
 */
export const generateUUID = function() {
    let d = new Date().getTime()
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16)
    })
    return uuid
}

/**
 *函数防抖 (只执行最后一次点击)
 */
export const Debounce = (fn, t) => {
    let delay = t || 500
    let timer
    return function() {
        let args = arguments
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            timer = null
            fn.apply(this, args)
        }, delay)
    }
}

export const fetchCookieValue = key => {
    let cookies = document.cookie
    let cookiesArray = cookies.split('; ')
    let cookiesObject = {}
    cookiesArray.forEach(item => {
        let [key, value] = item.split('=')
        cookiesObject[key] = value
    })
    return cookiesObject[key] || ''
}
