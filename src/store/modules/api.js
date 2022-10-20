import axios from "axios";

const state = {
  status_msg: '',
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
  FETCH_FORM_CONFIG(state){
    return axios.get(
      state.base_url + state.info_url + state.configuration_id
    )
    .then(response => {
      let columns = response.data.content.columns;
      state.config = columns;

      state.config.forEach(config => {

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
      });
    });
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
  
  GET_FIELDS(state, entity_id){
    axios.get(state.base_url + state.info_url + entity_id)
    .then(response => 
      state.fields = response.data.content.columns)
  }
}

const actions = {
  fetch_form_config(context){
    return context.commit('FETCH_FORM_CONFIG');
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
  get_fields(context, payload){
    context.commit('GET_FIELDS', payload);
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
      state.config, context.rootState.form.form.config_values, []);
    
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
      axios.get(state.base_url + state.info_url + state.configuration_id)
        .then(response => config_id = response.data.content.entity_type.id),
      axios.get(state.base_url + state.info_url + state.rows_id)
        .then(response => rows_config_id = response.data.content.entity_type.id),
      axios.get(state.base_url + state.info_url + state.sections_id)
        .then(response => sections_config_id = response.data.content.entity_type.id),
      axios.get(state.base_url + state.info_url + state.fields_id)
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
  mutations,
  actions
};