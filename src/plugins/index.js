import Vue from 'vue'

import './svg' /* 导入所有svg图片 */
import './filters' /* 导入所有过滤器 */
import './components' /* 自注册common下所有组件 */

/* 第三方插件 */
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

// Promise Catch不报错
window.addEventListener('unhandledrejection', event => event.preventDefault())
