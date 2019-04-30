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
                    path: 'pay-type-list',
                    name: 'pay-type-list',
                    component: () => import('@/pages/manager/pay-type/list')
                },
                // 2-b[支付类型]分组列表
                {
                    path: 'pay-type-group-list',
                    name: 'pay-type-group-list',
                    component: () => import('@/pages/manager/pay-type/group-list')
                },
                // 10-会员卡系统
                {
                    path: 'vip-card',
                    name: 'vip-card',
                    component: () => import('@/pages/manager/vip-card/index')
                }
            ]
        },
        // 2-用户
        {
            path: '/user',
            name: 'user',
            component: () => import('@/pages/user/index'),
            children: [
                // 2-充值记录
                {
                    path: 'recharge-list',
                    name: 'recharge-list',
                    component: () => import('@/pages/user/recharge-list')
                },
                // 2-消费记录
                {
                    path: 'consume-list',
                    name: 'consume-list',
                    component: () => import('@/pages/user/consume-list')
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
