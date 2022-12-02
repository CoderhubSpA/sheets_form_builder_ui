import axios from "axios";

// Helpers
/**
 * For each configuration, looks if it has options and stores them in a json.
 *
 * For a given configuration, its options may be obtained from entities_fk or from the same configuration's options
 * @param configurations Array of configurations
 * @param entities_fk The entity/info json with options
 * @returns {{}} The json of configuration options config_select
 */
function retrieveConfigurationsOptions(configurations, entities_fk) {
  let config_select = {};

  configurations.forEach((config) => {
    let options = [];

    if (!config.entity_type_fk) {
      // The options are in config.options, or there aren't any options (it may not be a selector)
      let json_options = JSON.parse(config.options);
      for (let key in json_options) {
        options.push({
          id: key,
          name: json_options[key],
        });
      }
      config_select[config.id] = {
        options: options,
      };
    } else {
      const options_fk = config.entity_type_fk;
      config_select[config.id] = {
        options: entities_fk[options_fk],
      };

      if (!config_select[config.id].options) {
        config_select[config.id].options = [
          { id: "F", name: "NO HAY OPCIONES EN EL ENTITIES_FK" },
        ];
      }
    }
  });

  return config_select;
}

function parseJSONValues(json) {
  for (let key in json) {
    try {
      json[key] = JSON.parse(json[key]);
    } catch (e) {
      continue;
    }
  }
}

const state = {
  status_msg: "",
  url: {
    base: "http://127.0.0.1:8081/",
    info: "entity/info/",
    data: "entity/data/",
    records: "sheets/getrecord/form/",
    form_entity_name: "form",
    action_entity_name: "form_has_action",
    row_entity_name: "form_row",
    section_entity_name: "form_section",
    field_entity_name: "form_field",
    document_entity_name: "document",
  },
  axios_no_cache_config: {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  },
  form_list_options: [],
  form_config: [],
  form_config_select: {},
  actions_config: [],
  actions_config_select: {},
  rows_config: [],
  rows_config_select: {},
  sections_config: [], // shared config, the values are stored in each section separated
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
      options: [],
    },
  },
  documents_list: [],
};

const getters = {
  formConfigURL(state) {
    return state.url.base + state.url.info + state.url.form_entity_name;
  },
  actionsConfigURL(state) {
    return state.url.base + state.url.info + state.url.action_entity_name;
  },
  rowsConfigURL(state) {
    return state.url.base + state.url.info + state.url.row_entity_name;
  },
  sectionsConfigURL(state) {
    return state.url.base + state.url.info + state.url.section_entity_name;
  },
  fieldsConfigURL(state) {
    return state.url.base + state.url.info + state.url.field_entity_name;
  },
  formDataURL(state) {
    return state.url.base + state.url.data + state.url.form_entity_name;
  },
  actionsDataURL(state) {
    return state.url.base + state.url.data + state.url.action_entity_name;
  },
  rowsDataURL(state) {
    return state.url.base + state.url.data + state.url.row_entity_name;
  },
  sectionsDataURL(state) {
    return state.url.base + state.url.data + state.url.section_entity_name;
  },
  fieldsDataURL(state) {
    return state.url.base + state.url.data + state.url.field_entity_name;
  },
  documentsDataURL(state) {
    return state.url.base + state.url.data + state.url.document_entity_name;
  },
  sectionImageURL: (state) => (id) => {
    return (
      state.url.base +
      state.documents_list.find((d) => d.id === id)?.src.slice(1)
    );
  },
};

const mutations = {
  SET_FORM_CONFIG(state, config) {
    state.form_config = config;
  },
  SET_FORM_CONFIG_SELECT_OPTIONS(state, config_select_options) {
    state.form_config_select = config_select_options;
  },
  SET_ACTIONS_CONFIG(state, config) {
    state.actions_config = config;
  },
  SET_ACTIONS_CONFIG_SELECT_OPTIONS(state, config_select_options) {
    state.actions_config_select = config_select_options;
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
  SET_FIELDS(state, fields) {
    state.fields = fields;
  },
  REMOVE_FIELD(state, field) {
    state.fields = state.fields.filter((element) => element !== field);
  },
  SET_DOCUMENTS(state, documents) {
    state.documents_list = documents;
  },
};

const actions = {
  /**
   * Fetch form-entity configuration, select options included
   * @param context
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchFormConfig(context) {
    return axios.get(context.getters.formConfigURL).then((response) => {
      let config_columns = response.data.content.columns;
      context.commit("SET_FORM_CONFIG", config_columns);
      let config_select = retrieveConfigurationsOptions(
        config_columns,
        response.data.content.entities_fk
      );
      context.commit("SET_FORM_CONFIG_SELECT_OPTIONS", config_select);
    });
  },
  /**
   * Fetch action-entity configuration, select options included
   * @param context
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchActionsConfig(context) {
    return axios.get(context.getters.actionsConfigURL).then((response) => {
      let config_columns = response.data.content.columns;
      context.commit("SET_ACTIONS_CONFIG", config_columns);
      let config_select = retrieveConfigurationsOptions(
        config_columns,
        response.data.content.entities_fk
      );
      context.commit("SET_ACTIONS_CONFIG_SELECT_OPTIONS", config_select);
    });
  },
  /**
   * Fetch row-entity configuration, select options included
   * @param context
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchRowsConfig(context) {
    return axios.get(context.getters.rowsConfigURL).then((response) => {
      let config_columns = response.data.content.columns;
      context.commit("SET_ROWS_CONFIG", config_columns);
      let config_select = retrieveConfigurationsOptions(
        config_columns,
        response.data.content.entities_fk
      );
      context.commit("SET_ROWS_CONFIG_SELECT_OPTIONS", config_select);
    });
  },
  /**
   * Fetch section-entity configuration, select option included
   * @param context
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchSectionConfig(context) {
    return axios.get(context.getters.sectionsConfigURL).then((response) => {
      let config_columns = response.data.content.columns;
      context.commit("SET_SECTIONS_CONFIG", config_columns);
      let config_select = retrieveConfigurationsOptions(
        config_columns,
        response.data.content.entities_fk
      );
      context.commit("SET_SECTIONS_CONFIG_SELECT_OPTIONS", config_select);
    });
  },
  /**
   * Fetch fields-entity configuration, select option included
   * @param context
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchFieldsConfig(context) {
    return axios.get(context.getters.fieldsConfigURL).then((response) => {
      let config_columns = response.data.content.columns;
      context.commit("SET_FIELDS_CONFIG", config_columns);
      let config_select = retrieveConfigurationsOptions(
        config_columns,
        response.data.content.entities_fk
      );
      context.commit("SET_FIELDS_CONFIG_SELECT_OPTIONS", config_select);
    });
  },
  /**
   * Fetch all possible fields for a given form's entity-type
   * @param context
   * @param entity_id id of the form's entity-type
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchFields(context, entity_id) {
    return axios
      .get(state.url.base + state.url.info + entity_id)
      .then((response) => {
        let fields = [];
        response.data.content.columns.forEach((column) => {
          let config_values = {};
          let format_config;
          context.state.fields_config.forEach((config) => {
            if (config.col_name === "format") {
              format_config = config.id;
            }
            config_values[config.id] =
              config.name === "Columna"
                ? column
                : config.col_name === "name"
                ? column.name
                : context.rootGetters["tools/selectFormat"](config);
          });

          config_values[format_config] = {
            id: column.format,
            name: null,
            valid: "1",
            color: null,
            text_color: null,
          };

          fields.push({
            index: fields.length,
            idxRow: -1,
            idxSection: -1,
            show: false,
            local_entity_data: {},
            unfilled_required_values: 0,
            config_values: config_values,
            show_in_create_form: column.show_in_create_form,
            show_in_edit_form: column.show_in_edit_form,
            name: column.name,
            // format: column.format,
            format_config_id: format_config,
          });
        });
        context.commit("SET_FIELDS", fields); // response.data.content.columns)
      });
  },
  /**
   * Fetch available forms list (not the whole forms themselves)
   * @param state
   * @param getters
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchFormList({ state, getters }) {
    return axios
      .get(getters.formDataURL, state.axios_no_cache_config)
      .then((response) => {
        let form_options = [];
        response.data.content.data.forEach((form) => {
          form_options.push({
            name: form[
              state.form_config.find((config) => config.col_name === "name").id
            ],
            value:
              form[
                state.form_config.find((config) => config.col_name === "id").id
              ],
            state:
              form[
                state.form_config.find((config) => config.col_name === "valid")
                  .id
              ],
          });
        });
        state.form_list_options = form_options;
      });
  },
  /**
   * Fetch a whole existing form, with all of its elements (rows, etc)
   * @param context
   * @param form_id
   * @returns {Promise<any>}
   */
  fetchForm(context, form_id) {
    // Fetch the form and all of its content
    let form, rows, sections, fields, actions;
    let requests = [
      // Form
      axios
        .get(context.getters.formDataURL, context.state.axios_no_cache_config)
        .then((response) => {
          form = response.data.content.data.find((form) => form.id === form_id);
          parseJSONValues(form);
        }),
      // Rows
      axios
        .get(context.getters.rowsDataURL, context.state.axios_no_cache_config)
        .then((response) => {
          let form_id_config = context.state.rows_config.find(
            (config) => config.col_name === "form_id"
          ).id;
          rows = response.data.content.data.filter(
            (row) => row[form_id_config] === form_id
          );
          parseJSONValues(rows);
        }),
      // Sections
      axios
        .get(
          context.getters.sectionsDataURL,
          context.state.axios_no_cache_config
        )
        .then((response) => {
          let form_id_config = context.state.sections_config.find(
            (config) => config.col_name === "form_id"
          ).id;
          sections = response.data.content.data.filter(
            (section) => section[form_id_config] === form_id
          );
          parseJSONValues(sections);
        }),
      // Fields
      axios
        .get(context.getters.fieldsDataURL, context.state.axios_no_cache_config)
        .then((response) => {
          let form_id_config = context.state.fields_config.find(
            (config) => config.col_name === "form_id"
          ).id;
          fields = response.data.content.data.filter(
            (field) => field[form_id_config] === form_id
          );
          parseJSONValues(fields);
        }),
      // Actions
      axios
        .get(
          context.getters.actionsDataURL,
          context.state.axios_no_cache_config
        )
        .then((response) => {
          let form_id_config = context.state.actions_config.find(
            (config) => config.col_name === "form_id"
          ).id;
          actions = response.data.content.data.filter(
            (action) => action[form_id_config] === form_id
          );
        }),
    ];

    // Calls to fetch the form's possible fields, and then calls for loading the form with all the info
    return Promise.all(requests)
      .then(() =>
        context.dispatch(
          "fetchFields",
          form[
            context.state.form_config.find(
              (config) => config.name === "Tipo de Entidad"
            ).id
          ]
        )
      )
      .then(() =>
        context.dispatch(
          "form/loadForm",
          {
            form: form,
            rows: rows,
            sections: sections,
            fields: fields,
            actions: actions,
          },
          { root: true }
        )
      );
  },
  /**
   * Post the form after validating it and parsing it
   * @param context
   */
  async postForm(context) {
    /**
     * First checks that all required configurations are valid.
     * Then starts sending in cascade the form configuration, the rows, the sections and the fields
     */
    let state = context.state;

    let autofill_order = (elements, order_id) => {
      // fills the order on the config_values
      for (let [index, element] of elements.entries()) {
        element.config_values[order_id] = index;
      }
    };
    let form = context.rootState.form.form;
    // First fills the order config for all elements that need it
    let rows = form.rows;
    autofill_order(
      rows,
      state.rows_config.find((config) => config.name === "Orden").id
    );
    for (let row of rows) {
      autofill_order(
        row.sections,
        state.sections_config.find((config) => config.name === "Orden").id
      );
      for (let section of row.sections) {
        autofill_order(
          section.fields,
          state.fields_config.find((config) => config.name === "Orden").id
        );
      }
    }
    // Then call for filling the local entity data,
    // parsing each config_values
    await context.dispatch("form/fillLocalEntityData", null, { root: true });
    // As last step of the preparations, we count the unfilled_required_values, throwing an error if there's any
    let unfilled_required_count = form.unfilled_required_values.length;
    for (let row of form.rows) {
      unfilled_required_count += row.unfilled_required_values.length;
      for (let section of row.sections) {
        unfilled_required_count += section.unfilled_required_values.length;
        for (let field of section.fields) {
          unfilled_required_count += field.unfilled_required_values.length;
        }
      }
    }
    for (let action of form.actions) {
      unfilled_required_count += action.unfilled_required_values.length;
    }

    // TODO: It should show a modal letting the user know that there're required configurations that are not filled
    if (unfilled_required_count) {
      throw Error("There are " + unfilled_required_count + " unfilled values");
    }

    // Then starts the posting-process

    state.status_msg = "Guardando";

    let config_id,
      actions_config_id,
      rows_config_id,
      sections_config_id,
      fields_config_id;
    
    try {
      // Get the urls where to post the information
      let formConfigURLResponse = await axios.get(context.getters.formConfigURL);
      config_id = formConfigURLResponse.data.content.entity_type.id;
      let actionsConfigURLResponse = await axios.get(context.getters.actionsConfigURL);
      actions_config_id = actionsConfigURLResponse.data.content.entity_type.id;
      let rowsConfigURLResponse = await axios.get(context.getters.rowsConfigURL);
      rows_config_id = rowsConfigURLResponse.data.content.entity_type.id;
      let sectionsConfigURLResponse = await axios.get(context.getters.sectionsConfigURL);
      sections_config_id = sectionsConfigURLResponse.data.content.entity_type.id;
      let fieldsConfigURLResponse = await axios.get(context.getters.fieldsConfigURL);
      fields_config_id = fieldsConfigURLResponse.data.content.entity_type.id;

      /**
       * POST request using the config_id with the values in a JSON that the API supports.
        */
      let content = {};
      let _actions_config_id = state.form_config.find(
        (config) => config.name === "Acciones"
      ).id;
      if (form.local_entity_data[_actions_config_id]) {
        delete form.local_entity_data[_actions_config_id];
      }
      content[config_id] = [form.local_entity_data];
      let postResponse = await axios.post(
        state.url.base + (form.local_entity_data["id"] ? "entity/update" : "entity"),
        content
      );
      /**
       * Add the inserted_id in the form_config_values, and add it to form.cloud_entity_data.
       *
       * Then, add the inserted_id in all the actions and rows and post them
       */
      let form_id = postResponse.data.content.inserted_id;
    
      form.config_values[
        state.form_config.find((config) => config.name === "id").id
      ] =
        form.local_entity_data[
          state.form_config.find((config) => config.name === "id").id
        ] =
        form.local_entity_data["id"] =
          form_id;

      // find the 'Formulario' configuration
      let action_form_config = state.actions_config.find(
        (config) => config.name === "Formulario"
      ).id;
      for (let action of form.actions) {
        // Associate the action with the created form
        action.config_values[action_form_config] = form_id;
        action.local_entity_data[action_form_config] = form_id;
      }

      let row_form_config = state.rows_config.find(
        (config) => config.name === "Formulario"
      ).id;
      for (let row of form.rows) {
        // Associate the row with the created form
        row.config_values[row_form_config] = form_id;
        row.local_entity_data[row_form_config] = form_id;
      }

      // The API doesn't return the inserted_id of all elements, so while we can send all the rows,
      // we shouldn't because we need all the inserted_id
      // POST actions
      for (let action of form.actions) {
        let _content = {};

        if (action.local_entity_data["id"]) {
          delete action.local_entity_data[
            state.actions_config.find((config) => config.name === "id").id
          ];
          _content[actions_config_id] = [action.local_entity_data];
        }
        try {
          let _postResponse = await axios.post(
            state.url.base + (action.local_entity_data["id"] ? "entity/update" : "entity"),
            _content
          );

          let action_id = _postResponse.data.content.inserted_id;
          action.config_values[
            state.actions_config.find((config) => config.name === "id").id
          ] =
            action.local_entity_data[
              state.actions_config.find(
                (config) => config.name === "id"
              ).id
            ] =
            action.local_entity_data["id"] =
              action_id;
        } catch (error) {
          console.log(error);
        }
      }
      // POST rows
      for (let row of form.rows) {
        let _content = {};
        _content[rows_config_id] = [row.local_entity_data];
        let _postResponse = await axios.post(
          state.url.base + (row.local_entity_data["id"] ? "entity/update" : "entity"),
          _content
        );

        let row_id = _postResponse.data.content.inserted_id;
        row.config_values[
          state.rows_config.find((config) => config.name === "id").id
        ] =
          row.local_entity_data[
            state.rows_config.find((config) => config.name === "id").id
          ] =
          row.local_entity_data["id"] =
            row_id;

        for (let section of row.sections) {
          section.local_entity_data[
            state.sections_config.find(
              (config) => config.name === "Fila del formulario"
            ).id
          ] = section.config_values[
            state.sections_config.find(
              (config) => config.name === "Fila del formulario"
            ).id
          ] = row_id;
          section.local_entity_data[
            state.sections_config.find(
              (config) => config.name === "Formulario"
            ).id
          ] = section.config_values[
            state.sections_config.find(
              (config) => config.name === "Formulario"
            ).id
          ] = form_id;
        }

        for (let section of row.sections) {
          let _content = {};
          _content[sections_config_id] = [section.local_entity_data];
          let _postResponse = await axios.post(
            state.url.base + (section.local_entity_data["id"] ? "entity/update" : "entity"),
            _content
          );
          let section_id = _postResponse.data.content.inserted_id;
          section.config_values[
            state.sections_config.find(
              (config) => config.name === "id"
            ).id
          ] =
            section.local_entity_data[
              state.sections_config.find(
                (config) => config.name === "id"
              ).id
            ] =
            section.local_entity_data["id"] =
              section_id;

          for (let field of section.fields)  {
            // Associate the field with the created section and form
            field.local_entity_data[
              state.fields_config.find(
                (config) => config.name === "Sección formulario"
              ).id
            ] = field.config_values[
              state.fields_config.find(
                (config) => config.name === "Sección formulario"
              ).id
            ] = section_id;
            field.local_entity_data[
              state.fields_config.find(
                (config) => config.name === "Formulario"
              ).id
            ] = field.config_values[
              state.fields_config.find(
                (config) => config.name === "Formulario"
              ).id
            ] = form_id;
          }
          // POST fields
          for (let field of section.fields) {
            let _content = {};
            _content[fields_config_id] = [field.local_entity_data];
            let _postResponse = await axios.post(
              state.url.base + (field.local_entity_data["id"] ? "entity/update" : "entity"),
              _content
            );
            let field_id = _postResponse.data.content.inserted_id;
            field.config_values[
              state.fields_config.find(
                (config) => config.name === "id"
              ).id
            ] =
              field.local_entity_data[
                state.fields_config.find(
                  (config) => config.name === "id"
                ).id
              ] =
              field.local_entity_data["id"] =
                field_id;
          }
        }
        // Delete requests
        let del_content = {};
        // Deleted rows
        if (context.rootState.form.deleted.rows.length > 0) {
          del_content[rows_config_id] = [];
          for (let deleted_row_entity_data of context.rootState.form.deleted.rows) {
            deleted_row_entity_data[
              state.rows_config.find(
                (config) => config.col_name === "valid"
              ).id
            ] = false;
            del_content[rows_config_id].push(deleted_row_entity_data);
          }
        }
        // Deleted sections
        if (context.rootState.form.deleted.sections.length > 0) {
          del_content[sections_config_id] = [];
          for (let deleted_section_entity_data of context.rootState.form.deleted.sections) {
            deleted_section_entity_data[
              state.sections_config.find(
                (config) => config.col_name === "valid"
              ).id
            ] = false;
            del_content[sections_config_id].push(deleted_section_entity_data);
          }
        }
        // Deleted fields
        if (context.rootState.form.deleted.fields.length > 0) {
          del_content[fields_config_id] = [];
          for (let deleted_field_entity_data of context.rootState.form.deleted.fields) {
            deleted_field_entity_data[
              state.fields_config.find(
                (config) => config.col_name === "valid"
              ).id
            ] = false;
            del_content[fields_config_id].push(deleted_field_entity_data);
          }
        }
        // Deleted actions
        context.rootState.form.deleted.actions = [];
        for (let action of context.rootState.form.form.actions_unlisted) {
          let action_id =
            action.config_values[
              state.actions_config.find((config) => config.col_name === "id").id
            ];
          if (action_id) {
            action.local_entity_data[
              state.actions_config.find(
                (config) => config.col_name === "valid"
              ).id
            ] = false;
            context.rootState.form.deleted.actions.push(
              action.local_entity_data
            );
          }
        }
        if (context.rootState.form.deleted.actions.length > 0) {
          del_content[actions_config_id] = [];
          for (let deleted_action_entity_data of context.rootState.form.deleted.actions) {
            del_content[actions_config_id].push(deleted_action_entity_data);
          }
        }
        if (Object.keys(del_content).length > 0) {
          await axios.post(state.url.base + "entity/update", del_content);
        }
      } 
      console.log("Finished");
      this._vm.$toasted.success("Formulario guardado!");
      state.status_msg = "";
    } catch (e) {
      this._vm.$toasted.error("Error al guardar formulario!");
      console.log(e);
    }
  },

  /**
   * Fetch all possible documents
   * @param context
   * @returns {Promise<AxiosResponse<any>>}
   */
  fetchDocuments(context) {
    return axios.get(context.getters.documentsDataURL).then((response) => {
      let documents = response.data.content.entities_fk.document;
      context.commit("SET_DOCUMENTS", documents); // response.data.content.columns)
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
