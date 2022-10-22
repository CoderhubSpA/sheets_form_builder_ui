import axios from "axios";

// Helpers
function retrieveConfigurationsOptions(configurations, entities_fk) {
  let config_select = {};

  configurations.forEach(config => {

    let options = [];

    if (!config.entity_type_fk)  // The options are in config.options, or there aren't any options (it may not be a selector)
    {
      let json_options = JSON.parse(config.options);
      for (let key in json_options)
      {
        options.push({
          'id': key,
          'name': json_options[key],
        });
      }
      config_select[config.id] = {
        'options': options,
      }
    } else {
      const options_fk = config.entity_type_fk;
      config_select[config.id] = {
        'options': entities_fk[options_fk],
      }

      if (!config_select[config.id].options)
      {
        config_select[config.id].options = [{'id': 'F', 'name': 'NO HAY OPCIONES EN EL ENTITIES_FK'}]
      }
    }
  });

  return config_select;
}


const state = {
  status_msg: '',
  base_url: 'http://127.0.0.1:8081/',
  info_url: 'entity/info/',
  records_url: 'sheets/getrecord/form/',
  form_entity_name: 'form',
  row_entity_name: 'form_row',
  section_entity_name: 'form_section',
  field_entity_name: 'form_field',
  form_config: [],
  form_config_select: {},
  rows_config: [],
  rows_config_select: {},
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

const getters = {
  formConfigURL (state) {
    return state.base_url + state.info_url + state.form_entity_name;
  },
  rowsConfigURL (state) {
    return state.base_url + state.info_url + state.row_entity_name;
  },
  sectionsConfigURL (state) {
    return state.base_url + state.info_url + state.section_entity_name;
  },
  fieldsConfigURL (state) {
    return state.base_url + state.info_url + state.field_entity_name;
  }
}

const mutations = {
  SET_FORM_CONFIG(state, config) {
    state.form_config = config;
  },
  SET_FORM_CONFIG_SELECT_OPTIONS(state, config_select_options) {
    state.form_config_select = config_select_options;
  },
  SET_ROWS_CONFIG(state, config) {
    state.rows_config = config;
  },
  SET_ROWS_CONFIG_SELECT_OPTIONS(state, config_select_options) {
    state.rows_config_select = config_select_options;
  },
  SET_SECTIONS_CONFIG(state, config) {
    state.sections_config = config;
  },
  SET_SECTIONS_CONFIG_SELECT_OPTIONS(state, config_select_options) {
    state.sections_config_select = config_select_options;
  },
  SET_FIELDS_CONFIG(state, config) {
    state.fields_config = config;
  },
  SET_FIELDS_CONFIG_SELECT_OPTIONS(state, config_select_options) {
    state.fields_config_select = config_select_options;
  },
  SET_FIELDS(state, fields){
    state.fields = fields;
  }
}

const actions = {
  fetchFormConfig(context){
    return axios.get(
      context.getters.formConfigURL
    )
    .then(response => {
      let config_columns = response.data.content.columns;
      context.commit('SET_FORM_CONFIG', config_columns);
      let config_select = retrieveConfigurationsOptions(config_columns, response.data.content.entities_fk)
      context.commit('SET_FORM_CONFIG_SELECT_OPTIONS', config_select);
    });
  },
  fetchRowsConfig(context) {
    return axios.get(
      context.getters.rowsConfigURL
    )
    .then(response => {
      let config_columns = response.data.content.columns;
      context.commit('SET_ROWS_CONFIG', config_columns);
      let config_select = retrieveConfigurationsOptions(config_columns, response.data.content.entities_fk);
      context.commit('SET_ROWS_CONFIG_SELECT_OPTIONS', config_select);      
    });
  },
  fetchSectionConfig(context) {
    return axios.get(
      context.getters.sectionsConfigURL
    ).then(response => {
      let config_columns = response.data.content.columns;
      context.commit('SET_SECTIONS_CONFIG', config_columns);
      let config_select = retrieveConfigurationsOptions(config_columns, response.data.content.entities_fk);
      context.commit('SET_SECTIONS_CONFIG_SELECT_OPTIONS', config_select);
    });
  },
  fetchFieldsConfig(context) {
    return axios.get(
      context.getters.fieldsConfigURL
    ).then(response => {
      let config_columns = response.data.content.columns;
      context.commit('SET_FIELDS_CONFIG', config_columns);
      let config_select = retrieveConfigurationsOptions(config_columns, response.data.content.entities_fk);
      context.commit('SET_FIELDS_CONFIG_SELECT_OPTIONS', config_select);
    });
  },
  fetchFields(context, entity_id){
    return axios.get(state.base_url + state.info_url + entity_id)
    .then(response => context.commit('SET_FIELDS', response.data.content.columns))
  },
  post_form(context) {
    /**
     * Checks that all required configurations are valid.
     * Then starts sending in cascade the form configuration, the rows, the sections and the fields
     */
    let state = context.state;

    let fill_data = (configurations, values, ignore_required_array) => {
      // parses and generates a json with all valid values
      let data_values = {};
      configurations.forEach(config => {
        let value = values[config.id];
        if ((value || value === 0) && // check it has a truthy value, but counting 0 as valid
          (!Array.isArray(value) || (value.length > 0))) // and that is not an empty array
        {
          data_values[config.id] = values[config.id].id ? values[config.id].id : values[config.id];
        } else if (config.required_in_create_form && !ignore_required_array.includes(config.id)) {
          unfilled_required_values += 1;
        }
      })
      return data_values;
    };
    let autofill_order = (elements, order_id) => {
      // fills the config_values
      elements.forEach((element, index) => {
        element.config_values[order_id] = index;
      })
    };

    // Parse form configuration
    let unfilled_required_values = 0;
    let form_config_values = fill_data(
      state.form_config, context.rootState.form.form.config_values, []);
    
    // Parse form rows while checking for unfilled required values
    let rows = context.rootState.form.form.rows;  // form.name existe también, pero no es la idea que exista eso, pues eso debería estar en config_values
    autofill_order(rows, state.rows_config.find(config => config.name === 'Orden').id);

    let rows_data = [];
    let all_sections_data = [];  // [[sections_data of row1], [sections_data of row2], ...]
    let all_fields_data = [];  // [[[fields_data of section1], ... of row1], ...]
    rows.forEach(row => {
      
      rows_data.push(fill_data(state.rows_config, row.config_values, [state.rows_config.find(config => config.name === 'Formulario').id]));
      
      
      autofill_order(row.sections, state.sections_config.find(config => config.name === 'Orden').id);
      let sections_data = [];
      let sections_fields_data = [];
      row.sections.forEach(section => {
        sections_data.push(
          fill_data(
            state.sections_config, section.config_values, [
              state.sections_config.find(config => config.name === 'Formulario').id,
              state.sections_config.find(config => config.name === 'Fila del formulario').id
            ]
          )
        );
        
        autofill_order(section.fields, state.fields_config.find(config => config.name === 'Orden').id);
        let fields_data = [];
        section.fields.forEach(field => {
          fields_data.push(
            fill_data(
              state.fields_config, field.config_values, [
                state.fields_config.find(config => config.name === 'Formulario').id,
                state.fields_config.find(config => config.name === 'Sección formulario').id
              ]
            )
          );
        })
        sections_fields_data.push(fields_data);
      })
      all_sections_data.push(sections_data);
      all_fields_data.push(sections_fields_data);
      
    })
    
    // TODO: It should show a modal letting the user know that there're required configurations that are not filled
    if (unfilled_required_values) throw Error('There are ' + unfilled_required_values + ' unfilled values');
    
    state.status_msg = 'Guardando';

    let config_id, rows_config_id, sections_config_id, fields_config_id;
      
    Promise.all([
      axios.get(context.getters.formConfigURL)
        .then(response => config_id = response.data.content.entity_type.id),
      axios.get(context.getters.rowsConfigURL)
        .then(response => rows_config_id = response.data.content.entity_type.id),
      axios.get(context.getters.sectionsConfigURL)
        .then(response => sections_config_id = response.data.content.entity_type.id),
      axios.get(context.getters.fieldsConfigURL)
        .then(response => fields_config_id = response.data.content.entity_type.id)])
    .then(() => {
      /**
       * POST request using the config_id with the values in a JSON that the API supports.
       */

      let content = {};
      content[config_id] = [form_config_values];
      return axios.post(state.base_url + 'entity', content);      
    })
    .then(response => {
      /**
       * Add the inserted_id in all the rows and post it
       */
      let form_id = response.data.content.inserted_id;

      // find the 'Formulario' configuration
      let row_form_config = state.rows_config.find(config => config.name === 'Formulario').id;
      rows_data.forEach(row_data => {
        // Associate the row with the created form
        row_data[row_form_config] = form_id;
      })

      console.log("inserted form_id " + form_id);
      // The API doesn't return the inserted_id of all elements, so while we can send all the rows, 
      // we shouldn't because we need all of the inserted_id
      /*
      let content = {};
      content[rows_config_id] = rows_data;
      */
      for (let i_row = 0; i_row < rows_data.length; i_row++)
      {
        let row_data = rows_data[i_row];

        let content = {};
        content[rows_config_id] = [row_data];
        axios.post(state.base_url + 'entity', content)
        .then(response => {
          let row_id = response.data.content.inserted_id;
          console.log("inserted row_id "+row_id);

          all_sections_data[i_row].forEach(section_data => {
            // Associate the section with the created row and form
            section_data[
              state.sections_config.find(config => config.name == 'Fila del formulario').id
            ] = row_id;
            section_data[
              state.sections_config.find(config => config.name == 'Formulario').id
            ] = form_id;
          });

          for (let i_section = 0; i_section < all_sections_data[i_row].length; i_section++)
          {
            let section_data = all_sections_data[i_row][i_section];

            let content = {};
            content[sections_config_id] = [section_data];
            axios.post(state.base_url + 'entity', content)
            .then(response => {
              let section_id = response.data.content.inserted_id;
              console.log("inserted section_id" + section_id);

              all_fields_data[i_row][i_section].forEach(field_data => {
                field_data[
                  state.fields_config.find(config => config.name == 'Sección formulario').id
                ] = section_id;
                field_data[

                  state.fields_config.find(config => config.name == 'Formulario').id
                ] = form_id;
              });
              
              let fields_post_requests = [];

              for (let i_field = 0; i_field < all_fields_data[i_row][i_section].length; i_field++)
              {
                let field_data = all_fields_data[i_row][i_section][i_field];

                let content = {};
                content[fields_config_id] = [field_data];
                fields_post_requests.push(
                  axios.post(state.base_url + 'entity', content)
                  .then(response => {
                    let field_id = response.data.content.inserted_id;
                    console.log("inserted field_id " + field_id);
                  })
                );
              }
              Promise.all(fields_post_requests)
              .then(() => {state.status_msg = '';});
            })
          }
        })
      }
    })
    .then(response => {
      console.log(response);
    })
    .catch(e => console.log(e));

  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};