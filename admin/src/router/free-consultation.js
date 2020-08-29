export default [
    {
        path: '/',
        name: 'my-doctors',
        component: () => import('../views/free-consultation/my-doctors'),
        meta:{
            title:'我的医生'
        }
    },
    {
        path: '/doctors-details',
        name: 'doctors-details',
        component: () => import('../views/free-consultation/doctors-details'),
        meta:{
            title:'医生详情'
        }
    },
    {
        path: '/advisory-details',
        name: 'advisory-details',
        component: () => import('../views/free-consultation/advisory-details'),
        meta:{
            title:'咨询费详情'
        }
    },
    {
        path: '/doctors-chat',
        name: 'doctors-chat',
        component: () => import('../views/free-consultation/doctors-chat'),
        meta:{
            title: '与医生聊天'
        }
    },
    {
        path: '/questionnaire',
        name: 'questionnaire',
        component: () => import('../views/free-consultation/questionnaire'),
        meta:{
            title: '填写问诊单'
        }
    },
    {
        path: '/consultation-details',
        name: 'consultation-details',
        component: () => import('../views/free-consultation/consultation-details'),
        meta:{
            title: '问诊详情'
        }
    }
]