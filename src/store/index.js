import Vue from "vue";
import Vuex from 'vuex';
import Axios from 'axios';

import tools from './modules/tools';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tools: tools,
  }
});