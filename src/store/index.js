import Vue from 'vue'
import Vuex from 'Vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    io: {},
    overtime: 0,
    user: {}
  },
  getters: {
    personalBaseInfo(state) {
      let baseInfo = Object.assign({}, state.user);
      baseInfo.gender = baseInfo.gender === '1' ? '男' : '女';

      return baseInfo;
    }
  },
  mutations: {
    setSocketIO(state, io) {
      state.io = io
    },
    setOvertime(state, code) {
      state.overtime = code
    },
    setUser(state, user) {
      state.user = user
    }
  }
})
