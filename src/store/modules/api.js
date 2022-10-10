import axios from "axios";

const state = {
  base_url: 'http://127.0.0.1:8081/',
  info_url: 'entity/info/',
  records_url: 'sheets/getrecord/form/',
  form_id: '8106ddcc-21d3-40f6-94fa-c2fe85ac638f',
  configuration_id: '41045a45-3ba9-11eb-877b-f23c911d2162',
  fields_id: '41045aca-3ba9-11eb-877b-f23c911d2162',
  config: [],
  config_select: {},
  config_values: {},
  actions_id: "",
  actions: [],
  fields: [
    // {"id":"id-field1", ...}, {"id": "id-field2", ...}
  ],
  fields_config: [
    // each field will have it's own independent config values
    // but they share the configuration columns, so all of them are stored here like shared config
    // [{"id-config1"...}, {"id-config2"...}, ...]
  ],
  fields_config_select: {
    // each configuration may have its possible options, but it's values are field-dependent so they are not stored here
    "id-config": {
      "options": [],
    }
  },
  fields_config_values: {
    // stores, for each field, its config's values
    "id-field": {
      "id-config": {
        "values": []
      }
    }
  }
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
            }
          } else {
            const options_fk = config.entity_type_fk;
            state.config_select[config.id] = {
              'options': response.data.content.entities_fk[options_fk],
            }

            if (!state.config_select[config.id].options)
            {
              state.config_select[config.id].options = [{'id': 'F', 'name': 'NO HAY OPCIONES EN EL ENTITIES_FK'}]
            }
          }

          state.config_values[config.id] = values;
      });
    });
    return state.config
  },
  FETCH_FIELDS(state) {
    axios.get(
      state.base_url + state.info_url + state.fields_id
    )
    .then(response => {
      // console.log(response.data.content);
      let columns = response.data.content.columns;

      // First, we need to get the possible fields, so we search for the column "Columna"
      let field_columna = columns.find(col => col.name == "Columna");
      let all_possible_fields = response.data.content.entities_fk[field_columna.entity_type_fk];
      // Filter the fields that are from other forms
      all_possible_fields = all_possible_fields.filter(
        field => (field.form_id == state.form_id) && (field.form_id != null)
      );
      state.fields = all_possible_fields;
      
      // All fields share the configuration columns, so we load that shared information
      state.fields_config = columns;
      // and for selectors and those configuration of that kind, we load their options
      state.fields_config.forEach(config => {
        const options_fk = config.entity_type_fk;
        if (!options_fk)
        {
          let options = [];
          let json_options = JSON.parse(config.options);
          for (let key in json_options)
          {
            options.push({
              "id": key,
              "name": json_options[key]
            })
          }
          state.fields_config_select[config.id] = {
            'options': options
          };
        } else {
          if (!response.data.content.entities_fk[options_fk])
          {
            state.fields_config_select[config.id] = {
              'options': [{'id': 'ff', 'name': 'NO HAY OPCIONES EN EL ENTITIES_FK'}]
            }
          } else {
            state.fields_config_select[config.id] = {
              'options': response.data.content.entities_fk[options_fk]
            }
          }
        }
      });
      
      // Finally, we prepare the store for keep the values for each configuration of each field
      state.fields.forEach(field => {
        state.fields_config_values[field.id] = {}

        state.fields_config.forEach(config => {
          state.fields_config_values[field.id][config.id] = config.format === "TEXT" ? "": [];
        });
      });
      /*
      console.log(state.fields)
      console.log(state.fields_config_select)
      console.log(state.fields_config_values)
      */
    })
  },

  UPDATE_VALUE_CONFIG_SELECT(state, payload){
    state.config_values[payload.id] = payload.values
    console.log(state.config_values[payload.id])
  }
}

const actions = {
  api_config(context){
    context.commit('API_CONFIG')
  },
  update_value_config_select(context, payload){
    console.log(payload)
    context.commit('UPDATE_VALUE_CONFIG_SELECT', payload)
  },
  fetch_fields(context) {
    context.commit('FETCH_FIELDS');
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};