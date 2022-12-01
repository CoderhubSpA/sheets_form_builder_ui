import Vue from "vue";
import App from "./App.vue";
import Icon from "vue-awesome/components/Icon";
import BootstrapVue from "bootstrap-vue";
import store from "./store";
import VueRouter from "vue-router";

import routes from "./routes"
import "vue-awesome/icons";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import CustomSlider from "vue-custom-range-slider";
import "vue-custom-range-slider/dist/vue-custom-range-slider.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCircleInfo,
  faXmark,
  faGear,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

library.add(faCircleInfo, faXmark, faGear, faCircleXmark);

import './assets/main.css'
import './assets/bootstrap-colors.scss'
import './assets/multiselect.scss'


Vue.component("v-icon", Icon);
Vue.use(BootstrapVue);
Vue.component("custom-slider", CustomSlider);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.use(VueRouter);


const router = new VueRouter({
  routes: routes,
  mode: "history"
});


new Vue({
  store: store,
  router,
  render: (h) => h(App),
}).$mount("#app");
