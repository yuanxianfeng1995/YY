export default [
    {
        path: '/take-a-photo',
        name: 'take-a-photo',
        component: () => import('../views/take-a-photo/index'),
        meta:{
            title: '拍照抓方-须知'
        }
    },
    {
        path: '/add-take',
        name: 'add-take',
        component: () => import('../views/take-a-photo/add-take'),
        meta:{
            title: '拍照抓方'
        }
    },
    {
        path: '/inquiry-details',
        name: 'inquiry-details',
        component: () => import('../views/take-a-photo/inquiry-details'),
        meta:{
            title: '问诊详情'
        }
    }
]