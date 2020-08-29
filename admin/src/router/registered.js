export default [
    {
        path: '/registered',
        name: 'registered-index',
        component: () => import('../views/registered/registered'),
        meta:{
            title:'完善健康资料'
        }
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('../views/index'),
    },
    {
        path: '/registered-index-1',
        name: 'registered-index-1',
        component: () => import('../views/registered/registered-index-1'),
        meta:{
            title:'健康档案管理'
        }
    },
    {
        path: '/add-patient-info',
        name: 'add-patient-info',
        component: () => import('../views/registered/add-patient-info'),
        meta:{
            title:'健康档案管理'
        }
    },
    {
        path: '/harvest-address',
        name: 'harvest-address',
        component: () => import('../views/registered/harvest-address'),
        meta:{
            title:'收货地址管理'
        }
    },
    {
        path: '/add-address',
        name: 'add-address',
        component: () => import('../views/registered/add-address'),
        meta:{
            title:'收货地址管理'
        }
    }
]