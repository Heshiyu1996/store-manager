import Vue from 'vue'

const filters = {
    /**
     * 时间戳转为时间格式（例如：2018-12-03）
     */
    dateFormat(time, format = 'yyyy-MM-dd') {
        let getDate = new Date(time)
        let o = {
            'M+': getDate.getMonth() + 1,
            'd+': getDate.getDate(),
            'h+': getDate.getHours(),
            'm+': getDate.getMinutes(),
            's+': getDate.getSeconds(),
            'q+': Math.floor((getDate.getMonth() + 3) / 3),
            S: getDate.getMilliseconds()
        }
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            }
        }
        return format
    },

    /**
     * 时间戳转为时间段格式（例如：今天？昨天？今年？跨年？）
     */
    dateFormatDetail(time) {
        let getDate = new Date(time)
        let transDate = {
            year: getDate.getFullYear(),
            month: getDate.getMonth() + 1 < 10 ? '0' + (getDate.getMonth() + 1) : getDate.getMonth() + 1,
            day: getDate.getDate() < 10 ? '0' + getDate.getDate() : getDate.getDate(),
            hour: getDate.getHours() < 10 ? '0' + getDate.getHours() : getDate.getHours(),
            minute: getDate.getMinutes() < 10 ? '0' + getDate.getMinutes() : getDate.getMinutes()
        }
        return isToday(time, transDate)
    }
}

const isToday = function(str, transDate) {
    let modifiedTime = ''
    let judgeData = new Date(str).toDateString()
    let todayDate = new Date().toDateString()
    let yesterdayDate = new Date(new Date() - 24 * 3600 * 1000).toDateString()
    let ifSameYear = new Date(str).getFullYear() === new Date().getFullYear()

    if (judgeData === todayDate) {
        // 今天
        modifiedTime = `今天 ${transDate.hour}:${transDate.minute}`
    } else if (judgeData === yesterdayDate) {
        // 昨天
        modifiedTime = `昨天 ${transDate.hour}:${transDate.minute}`
    } else if (ifSameYear) {
        // 今年
        modifiedTime = `${transDate.month}-${transDate.day} ${transDate.hour}:${transDate.minute}`
    } else {
        // 跨年
        modifiedTime = `${transDate.year}-${transDate.month}-${transDate.day} ${transDate.hour}:${transDate.minute}`
    }
    return modifiedTime
}

Object.keys(filters).map(t => {
    Vue.filter(t, filters[t])
})
