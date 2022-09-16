import Vue from "vue";
import Vuex from 'vuex';
import Axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config : [{name: 'Nombre de campo', type: 'text-input'}, {name: 'required', type: 'checkbox'}, {name: 'Unknown', type: 'Unknown'}, {name: 'Acciones', type: 'acciones'}],
    fields: [{name: 'Campo 1'}, {name: 'Campo 2'}],
    possible_fields: [{name: 'Campo 1'}, {name: 'Campo 2'}],
    acciones_value: [],
    acciones_options: [
      {name: 'Guardar', action:'Guardar'},
      {name: 'Guardar y Cerrar', action:'Guardar y Cerrar'},
      {name: 'Guardar y Refrescar', action:'Guardar y Refrescar'},
  ],
  },

  getters: {
  },

  mutations: {
    SET_CONFIG(state, newConfig){
      state.config = newConfig
    },
    SET_FIELDS(state, newFields){
      state.fields = newFields
    }
  },

  actions: {
    setConfig({commit}, newConfig){
      commit('SET_CONFIG', newConfig)
    },
    setFields({commit}, newFields){
      commit('SET_FIELDS', newFields)
    }
  }
});