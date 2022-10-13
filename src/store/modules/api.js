import axios from "axios";

const state = {
  base_url: 'http://127.0.0.1:8081/',
  info_url: 'entity/info/',
  records_url: 'sheets/getrecord/form/',
  //form_id: '8106ddcc-21d3-40f6-94fa-c2fe85ac638f',
  configuration_id: 'form',
  rows_id: 'form_row',
  sections_id: 'form_section',
  fields_id: 'form_field',
  config: [],
  config_select: {},
  config_values: {},
  rows_config: [],
  rows_config_select: {},
  actions: [],
  sections: [],
  sections_config: [],  // shared config, the values are stored in each section separated
  sections_config_select: {}, // for each config, it's select options
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
  FETCH_FIELDS_CONFIG(state) {
    // We don't need to get the possible fields, that's will be done when the user selects an entity for its form

    // But we do need to get their configurations
    axios.get(
      state.base_url + state.info_url + state.fields_id
    )
    .then(response => {
      let columns = response.data.content.columns;
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
    })
  },

  FETCH_ROWS_CONFIG() {
    axios.get(
      state.base_url + state.info_url + state.rows_id
    )
    .then(response => {
      state.rows_config = response.data.content.columns;

      state.rows_config.forEach(config => {
        if (!config.entity_type_fk)
        {
          // The options are in config.options, or there aren't any options (it may not be a selector)
          let options = [];
          let json_options = JSON.parse(config.options);
          for (let key in json_options)
          {
            options.push({
              'id': key,
              'name': json_options[key]
            })
          }
          state.rows_config_select[config.id] = {
            'options': options,
          }
        } else {
          const options_fk = config.entity_type_fk;
          state.rows_config_select[config.id] = {
            'options': response.data.content.entities_fk[options_fk]
          }

          if (!state.rows_config_select[config.id].options)
          {
            state.rows_config_select[config.id].options = [{'id': 'F', 'name': 'NO HAY OPCIONES EN EL ENTITIES_FK'}]
          }
        }
      });
      
    });
  },

  FETCH_SECTIONS_CONFIG(state) {
    axios.get(
      state.base_url + state.info_url + state.sections_id
    )
    .then(response => {
      state.sections_config = response.data.content.columns;

      state.sections_config.forEach(config => {
        if (!config.entity_type_fk)
        {
          let options = [];
          let json_options = JSON.parse(config.options);
          for (let key in json_options)
          {
            options.push({
              'id': key,
              'name': json_options[key],
            })
          }
          state.sections_config_select[config.id] = {
            'options': options,
          }
        } else {
          const options_fk = config.entity_type_fk;
          state.sections_config_select[config.id] = {
            'options': response.data.content.entities_fk[options_fk]
          }

          if (!state.sections_config_select[config.id].options)
          {
            state.sections_config_select[config.id].options = [{'id': 'F', 'name': 'NO HAY OPCIONES EN EL ENTITIES_FK'}];
          }
        }
      });
      
      // the values, state.sections_config_values[section.id][config.id], will have to be prepared when creating a section
      

    })
  },

  UPDATE_VALUE_CONFIG_SELECT(state, payload){
    state.config_values[payload.id] = payload.values
  }
}

const actions = {
  api_config(context){
    context.commit('API_CONFIG')
  },
  fetch_rows_config(context) {
    context.commit('FETCH_ROWS_CONFIG');
  },
  fetch_section_config(context) {
    context.commit('FETCH_SECTIONS_CONFIG');
  },
  fetch_fields_config(context) {
    context.commit('FETCH_FIELDS_CONFIG');
  },
  update_value_config_select(context, payload){
    context.commit('UPDATE_VALUE_CONFIG_SELECT', payload)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};