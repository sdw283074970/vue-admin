import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import '@/styles/global.scss' // customized global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import axios from 'axios'
import VueAxios from 'vue-axios'

import onlyNumber from '@/scripts'
// import permission from '@/directive/permission/index.js'

import Directives from './scripts/validateNumberIndex'
Vue.use(Directives)
Vue.config.productionTip = false

Vue.prototype.$axios = axios
Vue.config.productionTip = false
axios.defaults.baseURL = '/api'

Vue.use(VueAxios, axios)
Vue.use(onlyNumber)

import Driver from 'driver.js' // import driver.js
Vue.prototype.$driver = Driver
import 'driver.js/dist/driver.min.css' // import driver.js css

// import 'bootstrap/dist/css/bootstrap.min.css'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
