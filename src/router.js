import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        // 1-管理平台
        {
            path: '/',
            name: 'main',
            component: require('@/pages/main').default,
            redirect: 'manager',
            children: [
                // 1-管理员
                {
                    path: '/manager',
                    name: 'manager',
                    component: () => import('@/pages/manager/index')
                },
                // 2-用户
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/pages/user/index')
                }
            ]
        },
        // 2-登录页
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "about" */ './pages/main.vue'),
            children: [
                // 2-1登录
                {
                    path: '/sign-in',
                    name: 'sign-in',
                    component: () => import('@/pages/main')
                },
                // 2-2注册
                {
                    path: '/sign-up',
                    name: 'sign-up',
                    component: () => import('@/pages/main')
                }
            ]
        }
    ]
})
