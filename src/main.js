// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { countdown, adjust, voice_icon, messagebox, KmRadio } from './ui'
import eventbus from '../src/components/zy/new_exam/eventbus.js'

Vue.config.productionTip = false

Vue.use(messagebox)
Vue.use(voice_icon)
Vue.use(adjust)
Vue.use(countdown)
Vue.use(eventbus)
Vue.use(KmRadio)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
