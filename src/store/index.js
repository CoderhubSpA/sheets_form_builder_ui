import Vue from "vue";
import Vuex from "vuex";

import form from "./modules/form";
import tools from "./modules/tools";
import api from "./modules/api";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    form: form,
    tools: tools,
    api: api,
  },
});
