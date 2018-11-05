/*
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  user: {
    username: "1",
    password: "2",
    fullname: "3",
    access_token: "4",
    refresh_token: "5",
  },
  mutations: {
    setUser (user) {
      state.user = user
    }
  }
})
*/
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    count: 0,
    user: {
      username: "1123434",
      password: "2",
      fullname: "3",
      access_token: "4",
      refresh_token: "5",
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
