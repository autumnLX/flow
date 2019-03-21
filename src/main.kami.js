// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App_exam from './components/zy/Examination/App'
import {
  countdown,
  adjust,
  voice_icon,
  messagebox,
  KmRadio
} from './ui'
import eventbus from '../src/components/zy/new_exam/eventbus.js'
import App_new_exam from './components/zy/new_exam/app.vue'

const modelId = window.location.href.match(/(?<=modelId=)\d*/)[0]
const mids = {
  2: 'Beijing',
  3: 'Yinchuan',
  4: 'KuaiLeMaiTian',
  5: 'Shenyang',
  8: 'JiangSuZhongKao',
  9: 'Newshengyang',
  10: 'Ningbo'
}

let App = App_new_exam
if (mids[modelId]) {
  App = App_exam
}
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
  template: '<App/>',
  components: {
    App
  }
})
