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

export const playMusic = (musicList, idSelector) => {
    let myAudio = new Audio(),
        targetNode = document.getElementById(idSelector)

    targetNode.childNodes.length && targetNode.removeChild(targetNode.firstChild)
    document.getElementById(idSelector).appendChild(myAudio)

    let src = musicList.shift()

    myAudio.src = src
    myAudio.controls = true
    //将最后一个音乐添加到数组的开头，这样实现循环

    //绑定音乐结束事件，当音乐播放完成后，将会触发playEndedHandler方法
    myAudio.addEventListener('ended', playEndedHandler, false)
    //播放当前音乐
    //将循环播放关闭，如果开启，将不能触发playEndedHandler方法，只能进行单曲循环
    myAudio.loop = false
    myAudio.play()

    function playEndedHandler() {
        src = musicList.shift()
        myAudio.src = src
        myAudio.play()
    }
    return myAudio
}

export const downloadAttachmentFile = (blobData, fileName = `下载文件名.xls`) => {
    const blob = blobData
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = e => {
        const a = document.createElement('a')
        a.download = fileName
        a.href = e.target.result
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
}
