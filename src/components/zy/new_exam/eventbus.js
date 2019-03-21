function install(Vue) {
  Vue.prototype.$eventbus = new Vue()
}

export default install
