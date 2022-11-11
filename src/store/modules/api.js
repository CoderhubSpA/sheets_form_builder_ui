import axios from "axios";

// Helpers
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
};

const actions = {
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
  fetchFields(context, entity_id) {
    return axios
      .get(state.url.base + state.url.info + entity_id)
      .then((response) => {
        let fields = [];
        response.data.content.columns.forEach((column) => {
          let config_values = {};
          context.state.fields_config.forEach((config) => {
            config_values[config.id] =
              config.name === "Columna"
                ? column
                : context.rootGetters["tools/selectFormat"](config);
          });

          fields.push({
            index: fields.length,
            idxRow: -1,
            idxSection: -1,
            show: false,
            local_entity_data: {},
            unfilled_required_values: 0,
            config_values: config_values,
            show_in_create_form: column.show_in_create_form,
            name: column.name,
            format: column.format,
          });
        });
        context.commit("SET_FIELDS", fields); // response.data.content.columns)
      });
  },
  fetchFormList({ state, getters }) {
    return axios.get(getters.formDataURL).then((response) => {
      let form_options = [];
      response.data.content.data.forEach((form) => {
        console.log();
        form_options.push({
          name: form[
            state.form_config.find((config) => config.col_name === "name").id
          ],
          value:
            form[
              state.form_config.find((config) => config.col_name === "id").id
            ],
        });
      });
      state.form_list_options = form_options;
    });
  },
  fetchForm(context, form_id) {
    let form, rows, sections, fields, actions;
    let requests = [
      // Form
      axios.get(context.getters.formDataURL).then((response) => {
        form = response.data.content.data.find((form) => form.id === form_id);
        parseJSONValues(form);
      }),
      // Rows
      axios.get(context.getters.rowsDataURL).then((response) => {
        let form_id_config = context.state.rows_config.find(
          (config) => config.col_name === "form_id"
        ).id;
        rows = response.data.content.data.filter(
          (row) => row[form_id_config] === form_id
        );
        parseJSONValues(rows);
      }),
      // Sections
      axios.get(context.getters.sectionsDataURL).then((response) => {
        let form_id_config = context.state.sections_config.find(
          (config) => config.col_name === "form_id"
        ).id;
        sections = response.data.content.data.filter(
          (section) => section[form_id_config] === form_id
        );
        parseJSONValues(sections);
      }),
      // Fields
      axios.get(context.getters.fieldsDataURL).then((response) => {
        let form_id_config = context.state.fields_config.find(
          (config) => config.col_name === "form_id"
        ).id;
        fields = response.data.content.data.filter(
          (field) => field[form_id_config] === form_id
        );
        parseJSONValues(fields);
      }),
      axios.get(context.getters.actionsDataURL).then((response) => {
        let form_id_config = context.state.actions_config.find(
          (config) => config.col_name === "form_id"
        ).id;
        actions = response.data.content.data.filter(
          (action) => action[form_id_config] === form_id
        );
      }),
    ];

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
  postForm(context) {
    /**
     * Checks that all required configurations are valid.
     * Then starts sending in cascade the form configuration, the rows, the sections and the fields
     */
    let state = context.state;

    let autofill_order = (elements, order_id) => {
      // fills the config_values
      elements.forEach((element, index) => {
        element.config_values[order_id] = index;
      });
    };
    let form = context.rootState.form.form;

    // Parse form rows while checking for unfilled required values
    let rows = form.rows; // form.name existe también, pero no es la idea que exista eso, pues eso debería estar en config_values
    autofill_order(
      rows,
      state.rows_config.find((config) => config.name === "Orden").id
    );
    rows.forEach((row) => {
      autofill_order(
        row.sections,
        state.sections_config.find((config) => config.name === "Orden").id
      );
      row.sections.forEach((section) => {
        autofill_order(
          section.fields,
          state.fields_config.find((config) => config.name === "Orden").id
        );
      });
    });

    context.dispatch("form/fillLocalEntityData", null, { root: true });

    let unfilled_required_count = form.unfilled_required_values.length;
    form.rows.forEach((row) => {
      unfilled_required_count += row.unfilled_required_values.length;
      row.sections.forEach((section) => {
        unfilled_required_count += section.unfilled_required_values.length;
        section.fields.forEach((field) => {
          unfilled_required_count += field.unfilled_required_values.length;
        });
      });
    });
    form.actions.forEach((action) => {
      unfilled_required_count += action.unfilled_required_values.length;
    });

    // TODO: It should show a modal letting the user know that there're required configurations that are not filled
    if (unfilled_required_count)
      throw Error("There are " + unfilled_required_count + " unfilled values");

    state.status_msg = "Guardando";

    let config_id,
      actions_config_id,
      rows_config_id,
      sections_config_id,
      fields_config_id;

    Promise.all([
      axios
        .get(context.getters.formConfigURL)
        .then((response) => (config_id = response.data.content.entity_type.id)),
      axios
        .get(context.getters.actionsConfigURL)
        .then(
          (response) =>
            (actions_config_id = response.data.content.entity_type.id)
        ),
      axios
        .get(context.getters.rowsConfigURL)
        .then(
          (response) => (rows_config_id = response.data.content.entity_type.id)
        ),
      axios
        .get(context.getters.sectionsConfigURL)
        .then(
          (response) =>
            (sections_config_id = response.data.content.entity_type.id)
        ),
      axios
        .get(context.getters.fieldsConfigURL)
        .then(
          (response) =>
            (fields_config_id = response.data.content.entity_type.id)
        ),
    ])
      .then(() => {
        /**
         * POST request using the config_id with the values in a JSON that the API supports.
         */
        let content = {};

        let actions_config_id = state.form_config.find(
          (config) => config.name === "Acciones"
        ).id;
        if (form.local_entity_data[actions_config_id]) {
          delete form.local_entity_data[actions_config_id];
        }
        content[config_id] = [form.local_entity_data];
        return axios.post(
          state.url.base +
            (form.local_entity_data["id"] ? "entity/update" : "entity"),
          content
        );
      })
      .then((response) => {
        /**
         * Add the inserted_id in the form_config_values, and add it to form.cloud_entity_data.
         *
         * Then, add the inserted_id in all the actions and rows and post it
         */
        let form_id = response.data.content.inserted_id;
        form.config_values[
          state.form_config.find((config) => config.name === "id").id
        ] =
          form.local_entity_data[
            state.form_config.find((config) => config.name === "id").id
          ] =
          form.local_entity_data["id"] =
            form_id;
        console.log("inserted form_id " + form_id);

        // find the 'Formulario' configuration

        let action_form_config = state.actions_config.find(
          (config) => config.name === "Formulario"
        ).id;
        form.actions.forEach((action) => {
          // Associate the action with the created form
          action.config_values[action_form_config] = form_id;
          action.local_entity_data[action_form_config] = form_id;
        });

        let row_form_config = state.rows_config.find(
          (config) => config.name === "Formulario"
        ).id;
        form.rows.forEach((row) => {
          // Associate the row with the created form
          row.config_values[row_form_config] = form_id;
          row.local_entity_data[row_form_config] = form_id;
        });

        // The API doesn't return the inserted_id of all elements, so while we can send all the rows,
        // we shouldn't because we need all of the inserted_id
        /*
      let content = {};
      content[rows_config_id] = rows_data;
      */
        let action_requests = [];
        form.actions.forEach((action) => {
          let content = {};

          if (action.local_entity_data["id"])
            delete action.local_entity_data[
              state.actions_config.find((config) => config.name === "id").id
            ];
          content[actions_config_id] = [action.local_entity_data];

          action_requests.push(
            axios
              .post(
                state.url.base +
                  (action.local_entity_data["id"] ? "entity/update" : "entity"),
                content
              )
              .then((response) => {
                let action_id = response.data.content.inserted_id;
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
                console.log("inserted action_id " + action_id);
              })
              .catch((error) => {
                console.log("Error en el post de una acción:");
                console.log(error);
              })
          );
        });
        let row_requests = [];
        form.rows.forEach((row) => {
          let content = {};
          content[rows_config_id] = [row.local_entity_data];

          row_requests.push(
            axios
              .post(
                state.url.base +
                  (row.local_entity_data["id"] ? "entity/update" : "entity"),
                content
              )
              .then((response) => {
                let row_id = response.data.content.inserted_id;
                row.config_values[
                  state.rows_config.find((config) => config.name === "id").id
                ] =
                  row.local_entity_data[
                    state.rows_config.find((config) => config.name === "id").id
                  ] =
                  row.local_entity_data["id"] =
                    row_id;
                console.log("inserted row_id " + row_id);

                row.sections.forEach((section) => {
                  // Associate the section with the created row and form
                  section.local_entity_data[
                    state.sections_config.find(
                      (config) => config.name == "Fila del formulario"
                    ).id
                  ] = section.config_values[
                    state.sections_config.find(
                      (config) => config.name == "Fila del formulario"
                    ).id
                  ] = row_id;

                  section.local_entity_data[
                    state.sections_config.find(
                      (config) => config.name == "Formulario"
                    ).id
                  ] = section.config_values[
                    state.sections_config.find(
                      (config) => config.name == "Formulario"
                    ).id
                  ] = form_id;
                });

                let section_requests = [];
                row.sections.forEach((section) => {
                  let content = {};
                  content[sections_config_id] = [section.local_entity_data];

                  section_requests.push(
                    axios
                      .post(
                        state.url.base +
                          (section.local_entity_data["id"]
                            ? "entity/update"
                            : "entity"),
                        content
                      )
                      .then((response) => {
                        let section_id = response.data.content.inserted_id;
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
                        console.log("inserted section_id " + section_id);

                        section.fields.forEach((field) => {
                          field.local_entity_data[
                            state.fields_config.find(
                              (config) => config.name == "Sección formulario"
                            ).id
                          ] = field.config_values[
                            state.fields_config.find(
                              (config) => config.name == "Sección formulario"
                            ).id
                          ] = section_id;

                          field.local_entity_data[
                            state.fields_config.find(
                              (config) => config.name == "Formulario"
                            ).id
                          ] = field.config_values[
                            state.fields_config.find(
                              (config) => config.name == "Formulario"
                            ).id
                          ] = form_id;
                        });

                        let fields_requests = [];
                        section.fields.forEach((field) => {
                          let content = {};
                          content[fields_config_id] = [field.local_entity_data];

                          fields_requests.push(
                            axios
                              .post(
                                state.url.base +
                                  (field.local_entity_data["id"]
                                    ? "entity/update"
                                    : "entity"),
                                content
                              )
                              .then((response) => {
                                let field_id =
                                  response.data.content.inserted_id;
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
                                console.log("inserted field_id " + field_id);
                              })
                          );
                        });
                        return Promise.all(fields_requests);
                      })
                  );
                });
                return Promise.all(section_requests);
              })
          );
        });
        return Promise.all(row_requests);
      })
      .then((response) => {
        console.log(response);
        console.log("Finished");
        state.status_msg = "";
      })
      .catch((e) => console.log(e));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
