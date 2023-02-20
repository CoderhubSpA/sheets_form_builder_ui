import Vue from "vue";
import App from "./App.vue";
import store from "./store";

import Icon from "vue-awesome/components/Icon";
import BootstrapVue from "bootstrap-vue";
import Toasted from "vue-toasted";import "vue-awesome/icons";
import CustomSlider from "vue-custom-range-slider";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircleInfo, faXmark, faGear, faCircleXmark, faEye } from "@fortawesome/free-solid-svg-icons";

import "./assets/bootstrap-colors.scss";

library.add(faCircleInfo, faXmark, faGear, faCircleXmark, faEye);

Vue.component("v-icon", Icon);
Vue.component("custom-slider", CustomSlider);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(BootstrapVue);
Vue.use(Toasted, {
  position: "bottom-center",
  duration: 3000,
  class: "toasted-class",
  action: {
    text: "x",
    onClick: (e, toastObject) => {
      toastObject.goAway(0);
    },
  },
});


new Vue({
  store: store,
  render: (h) => h(App),
}).$mount("#app");
