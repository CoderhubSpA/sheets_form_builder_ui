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
      state.config = columns;
      
      state.config.forEach(config => {
        let values = config.format === "TEXT" ? "": [];

        if(config.name == "ACTIONS")
          state.actions_id = config.id
          //if (["SELECTOR", "SELECTOR[MULTIPLE]"].includes(column.format))
          if (!config.entity_type_fk)  // The options are in config.options, or there aren't any options (it may not be a selector)
          {
            let options = [];
            let json_options = JSON.parse(config.options);
            for (let key in json_options)
            {
              options.push({
                'id': key,
                'name': json_options[key],
              });
            }
            state.config_select[config.id] = {
              'options': options,
              'values': values,
            }
          } else {
            const options_fk = config.entity_type_fk;
            state.config_select[config.id] = {
              'options': response.data.content.entities_fk[options_fk],
              'values': values
            }

            if (!state.config_select[config.id].options)
            {
              state.config_select[config.id].options = [{'id': 'F', 'name': 'NO HAY OPCIONES EN EL ENTITIES_FK'}]
            }
          }
      });
    });
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