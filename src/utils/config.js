export const isDev = process.env.NODE_ENV === 'development'
export const isMock = false
export const rootURL = isDev ? (isMock ? 'http://localhost:8002' : 'http://localhost:8082') : '/'

/* 编辑模式，新增/编辑 */
export const MODIFY_MODAL_TYPE = {
    ADD: 1,
    EDIT: 0
}

/* 管理员导航 */
export const MENU_LIST = [
    {
        subMenuInfo: {
            value: 'order',
            label: '订单管理'
        },
        subMenuItemList: [
            {
                value: 'order-list',
                label: '订单列表'
            },
            {
                value: 'order-history',
                label: '历史订单'
            },
            {
                value: 'order-delete',
                label: '删除记录'
            },
            {
                value: 'order-loss',
                label: '流失单管理'
            }
        ]
    },
    {
        subMenuInfo: {
            value: 'pay-type',
            label: '支付类型'
        },
        subMenuItemList: [
            {
                value: 'pay-type-list',
                label: '支付类型'
            },
            {
                value: 'pay-type-group-list',
                label: '支付类型分组'
            }
        ]
    },
    {
        subMenuInfo: {
            value: 'theme',
            label: '主题管理'
        },
        subMenuItemList: []
    },
    {
        subMenuInfo: {
            value: 'room',
            label: '密室统计'
        },
        subMenuItemList: [
            {
                value: 'room-income',
                label: '收入统计'
            },
            {
                value: 'room-order',
                label: '订单统计'
            }
        ]
    },
    {
        subMenuInfo: {
            value: 'staff',
            label: '员工信息'
        },
        subMenuItemList: []
    },
    {
        subMenuInfo: {
            value: 'customer',
            label: '客户来源'
        },
        subMenuItemList: []
    },
    {
        subMenuInfo: {
            value: 'key',
            label: '钥匙管理'
        },
        subMenuItemList: []
    },
    {
        subMenuInfo: {
            value: 'goal',
            label: '目标管理'
        },
        subMenuItemList: []
    },
    {
        subMenuInfo: {
            value: 'material',
            label: '物料管理'
        },
        subMenuItemList: [
            {
                value: 'material-location',
                label: '库位管理'
            },
            {
                value: 'material-storage',
                label: '库存管理'
            },
            {
                value: 'material-output',
                label: '出库单'
            },
            {
                value: 'material-input',
                label: '入库单'
            }
        ]
    },
    {
        subMenuInfo: {
            value: 'vip-card',
            label: '会员卡系统'
        },
        subMenuItemList: []
    }
]

// 成功-200 数据重复-601 参数不正确-401
export const SERVER_ERROR_CODE = {
    SUCCESS: 200,
    REPEAT: 601,
    ERROR_PARAM: 401
}
// 账号类型。0普通用户、1~5依次代表：店员、副店、店长、区域管理员、老板
export const ACCOUNT_TYPE = {
    NORMAL: 0,
    STAFF: 1,
    VICE_MANAGER: 2,
    MAIN_MANAGER: 3,
    AREA_MANAGER: 4,
    BOSS: 5
}
