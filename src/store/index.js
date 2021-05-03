import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    flavor: '',
    user:{}
  },
  getters: {
    flavor: state => state.flavor,
    user: state => state.user
  },
  mutations: {
    change(state, flavor) {
      state.flavor = flavor
    },
    setUser(state, user) {
      state.user = user
    },
  },

})
