import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css';


Vue.use(Vant);
Vue.config.productionTip = false

import './permission'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
