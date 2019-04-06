import Vue from 'vue'

/** global component */
const Components = require.context('../components/common', true, /(\.vue)|(^\.\/u.*\.js)$/)
Components.keys().map(key => {
    // 文件名作为组件名
    let componentName = key.replace(/(.*\/)*([^.]+).*/gi, '$2')
    Vue.component(componentName, Components(key).default)
})
