import axios from "axios";

const state = {
  base_url: 'http://127.0.0.1:8081/',
  info_url: 'entity/info/',
  records_url: 'sheets/getrecord/form/',
  form_id: '8106ddcc-21d3-40f6-94fa-c2fe85ac638f',
  configuration_id: '41045a45-3ba9-11eb-877b-f23c911d2162',
  config: [],
  config_select: {},
  actions_id: "",
  actions: [],
}

const mutations = {
  API_CONFIG(state){
    axios.get(
      state.base_url + state.info_url + state.configuration_id
    )
    .then(response => {
      let columns = response.data.content.columns;

      for (let i_col = 0; i_col < columns.length; i_col++) {
        let column = columns[i_col];
        state.config.push(column)
        if(column.name == "ACTIONS")
          state.actions_id = column.id
        if (["SELECTOR", "SELECTOR[MULTIPLE]"].includes(column.format))
        {
          let options = [];
          let options_fk = column.entity_type_fk;
          if (!options_fk)
          {
            let json_options = JSON.parse(column.options);
            for (let key in json_options)
            {
              options.push({
                "id": key,
                "name":json_options[key]
              });
            }
          } else {
            options = response.data.content.entities_fk[options_fk];
          }
          
          state.config_select[column.id] = {
            "options": options,
            "values": [],
          }
        }
      }
    })
    return state.config
  },

  UPDATE_VALUE_CONFIG_SELECT(state, payload){
    state.config_select[payload.id].values = payload.values
    console.log(state.config_select[payload.id].values)
  }
}

const actions = {
    api_config(context){
      context.commit('API_CONFIG')
    },
    update_value_config_select(context, payload){
      console.log(payload)
      context.commit('UPDATE_VALUE_CONFIG_SELECT', payload)
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};