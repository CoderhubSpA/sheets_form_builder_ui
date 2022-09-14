import Vue from 'vue'
import App from './App.vue'
import Icon from 'vue-awesome/components/Icon'
import BootstrapVue from 'bootstrap-vue'
import store from "./store";

import "vue-awesome/icons";
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// import './assets/main.css'
Vue.component("v-icon", Icon);
Vue.use(BootstrapVue);

new Vue({
  store:store,
  render: (h) => h(App)
}).$mount('#app')


