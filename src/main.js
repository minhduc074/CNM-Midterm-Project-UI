// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import axios from "axios";

//import VueWebsocket from "vue-websocket";
//Vue.use(VueWebsocket, "ws://localhost:3000");

import * as VueGoogleMaps from "vue2-google-maps";
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAMn4lpHhrMrLICzyZrIWAKYeMKXEUkp6U",
    libraries: "places, Geocoder" // necessary for places input
  }
});

import Vuex from "vuex";
Vue.use(Vuex);

import storePlugin from "./storePlugin";
Vue.use(storePlugin);

Vue.use(Vuetify);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
