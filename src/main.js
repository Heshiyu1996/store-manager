import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/plugins' /* 组件，指令，插件等core统一入口 */

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
