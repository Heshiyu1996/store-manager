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
                    component: () => import('@/pages/manager/index'),
                    children: [
                        // 1-a[订单管理]订单列表
                        {
                            path: 'order-list',
                            name: 'order',
                            component: () => import('@/pages/manager/order/list')
                        },
                        // 1-b历史订单
                        {
                            path: 'order-history',
                            name: 'order',
                            component: () => import('@/pages/manager/order/history')
                        },
                        // 10-会员系统
                        {
                            path: 'client',
                            name: 'client',
                            component: () => import('@/pages/manager/client/index')
                        }
                    ]
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
