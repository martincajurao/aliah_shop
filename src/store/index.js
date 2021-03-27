import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    flavor: ''
  },
  getters: {
    flavor: state => state.flavor
  },
  mutations: {
    change(state, flavor) {
      state.flavor = flavor
    }
  },

})
