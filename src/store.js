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
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    count: 0,
    user: {
      username: "",
      password: "",
      fullname: "",
      access_token: "",
      refresh_token: "",
      role: "",
      staff_role: "",
      phone: ""
    },
    wepAPI: {
      url: "http://localhost:3000/"
    },
    customer: [
      {
        id: 0,
        fullname: "",
        phone: "",
        note: "",
        status: 0,
        staff: "",
        driver: "",
        address: {
          latLng: null,
          main_address:
            "Công viên phần mềm Quang Trung, Tân Chánh Hiệp, District 12, Ho Chi Minh City, Vietnam",
          geocoding_address: ""
        }
      }
    ],
    current_customer: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  }
});
