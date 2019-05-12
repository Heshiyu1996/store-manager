import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: { name: 'login' }
        },
        // 1-管理员
        {
            path: '/manager',
            name: 'manager',
            component: () => import('@/pages/manager/index'),
            // redirect: { name: 'login' },
            children: [
                // 1-a[订单管理]订单列表
                {
                    path: 'order-list',
                    name: 'order-list',
                    component: () => import('@/pages/manager/order/list')
                },
                // 1-b[订单管理]历史订单
                {
                    path: 'order-history',
                    name: 'order-history',
                    component: () => import('@/pages/manager/order/history')
                },
                // 2-a[支付类型]类型列表
                {
                    path: 'payment-type-list',
                    name: 'payment-type-list',
                    component: () => import('@/pages/manager/payment/type-list')
                },
                // 2-b[支付类型]分组列表
                {
                    path: 'payment-group-list',
                    name: 'payment-group-list',
                    component: () => import('@/pages/manager/payment/group-list')
                },
                // 10-a[用户管理]用户列表
                {
                    path: 'user-list',
                    name: 'user-list',
                    component: () => import('@/pages/manager/user/list')
                },
                // 10-b[用户管理]会员卡系统
                {
                    path: 'user-card-list',
                    name: 'user-card-list',
                    component: () => import('@/pages/manager/user/card-list')
                },
                // 10-c[用户管理]失信列表
                {
                    path: 'dishonesty-list',
                    name: 'dishonesty-list',
                    component: () => import('@/pages/manager/user/dishonesty-list')
                },
                // 11-a[门店管理]门店列表
                {
                    path: 'store-list',
                    name: 'store-list',
                    component: () => import('@/pages/manager/store-list')
                }
            ]
        },
        // 2-用户
        {
            path: '/client',
            name: 'client',
            component: () => import('@/pages/client/index'),
            children: [
                // 1-消费记录
                {
                    path: 'consume-list',
                    name: 'consume-list',
                    component: () => import('@/pages/client/consume-list')
                }
            ]
        },
        // 3-登录页
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "about" */ './pages/login.vue')
        }
    ]
})
