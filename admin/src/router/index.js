import Vue from 'vue'
import VueRouter from 'vue-router'

import registered from './registered'
import freeConsultation from './free-consultation'
import orderPay from './order-pay'
import takeAPhoto from './take-a-photo'
import heapCenter from './help-center'
Vue.use(VueRouter)



const router = new VueRouter({
    routes: [...registered,...freeConsultation,...orderPay,...takeAPhoto,...heapCenter]
})


export default router
