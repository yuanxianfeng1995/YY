export default [
    {
        path: '/order-list',
        name: 'order-list',
        component: () => import('../views/order-pay/order-list'),
        meta:{
            title: '订单列表'
        }
    },
    {
        path: '/order-details',
        name: 'order-details',
        component: () => import('../views/order-pay/order-details'),
        meta:{
            title: '订单详情'
        }
    },
    {
        path: '/prescription-details',
        name: 'prescription-details',
        component: () => import('../views/order-pay/prescription-details'),
        meta:{
            title: '处方详情'
        }
    },
    {
        path: '/pay-for',
        name: 'pay-for',
        component: () => import('../views/order-pay/pay-for'),
        meta:{
            title: '他人支付'
        }
    },
    {
        path: '/amount-of-logistics',
        name: 'amount-of-logistics',
        component: () => import('../views/order-pay/amount-of-logistics'),
        meta:{
            title: '物流查询'
        }
    },
]