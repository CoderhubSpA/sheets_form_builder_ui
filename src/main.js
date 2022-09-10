import Vue from 'vue'
import App from './App.vue'
import Icon from "vue-awesome/components/Icon";
import BootstrapVue from 'bootstrap-vue';

Vue.component("v-icon", Icon);
Vue.use(BootstrapVue)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
