function fillObjLocalEntityData(configurations, obj) {
  // parses and generates a json with all valid values
  let values = obj.config_values;

  let data_values = {};

  // Store the id as 'id' in data_values, if it exists.
  // The id configuration is stored twice in the database, one with key 'id' and the other as usual with config.id
  let id_val =
    values[configurations.find((config) => config.col_name === "id").id];
  if (id_val) data_values["id"] = id_val;

  configurations.forEach((config) => {
    if (config.col_name === "image_id")
      // Skip image
      return;
    let value = values[config.id];
    // Skip undefined and null values (other falsy values like false or "" are considered and not skipped)
    if (value === undefined || value === null) return;

    if (!Array.isArray(value)) {
      // If it's not an array, we store that id
      data_values[config.id] = values[config.id].id
        ? values[config.id].id // store the id if it's an object
        : values[config.id]; // otherwise store the whole value
    } else if (value.length > 0) {
      // If it's a filled array (or maybe empty but of Acciones), we store the array but of ids
      data_values[config.id] = [];
      values[config.id].forEach((value) =>
        data_values[config.id].push(value.id)
      );
    }
  });
  return data_values;
}

function getValuesFromRemoteEntityData(
  configurations,
  configurations_select,
  entity_data,
  selectFormat
) {
  let config_values = {};
  configurations.forEach((config) => {
    config_values[config.id] = Array.isArray(entity_data[config.id])
      ? [...entity_data[config.id]]
      : entity_data[config.id]
      ? entity_data[config.id]
      : selectFormat(config);

    // Additional parsing to data
    if (Array.isArray(config_values[config.id]))
      config_values[config.id].forEach((id_val, index) => {
        config_values[config.id][index] = configurations_select[
          config.id
        ].options.find((option) => option.id === id_val);
      });
    else if (config.format === "SELECTOR") {
      config_values[config.id] = config_values[config.id].toString();
      config_values[config.id] = configurations_select[config.id].options.find(
        (option) => option.id === config_values[config.id]
      );
    } else if (["col_sm", "col_md", "col_xl"].includes(config.col_name))
      config_values[config.id] = config_values[config.id].toString();
    else if (["valid"].includes(config.col_name))
      config_values[config.id] = !!config_values[config.id]; // to boolean
  });

  return config_values;
}

function lookForUnfilledRequiredValues(
  configurations,
  obj,
  ignore_configs_array
) {
  let unfilled_required = [];
  configurations.forEach((config) => {
    if (obj.local_entity_data[config.id])
      // in local_entity_data => is valid config
      return;

    if (
      config.required_in_create_form &&
      !ignore_configs_array.includes(config.id)
    )
      unfilled_required.push(config.id);
  });
  return unfilled_required;
}

const state = {
  form: {
    is_loaded: false,
    rows: [],
    actions: [],
    actions_unlisted: [], // The deselected actions, stored here to avoid losing their config_values
    config_values: {},
    local_entity_data: {},
    unfilled_required_values: 0,
  },
  deleted: {
    rows: [],
    sections: [],
    fields: [],
    actions: [],
  },
};
const mutations = {
  SET_FORM(state, payload) {
    state.form.rows = payload.rows;
    state.form.actions = payload.actions;
    state.form.config_values = payload.config_values;
    state.form.local_entity_data = payload.local_entity_data;
    state.form.unfilled_required_values = payload.unfilled_required_values;
    state.form.is_loaded = true;
  },
  SET_FORM_LOCAL_ENTITY_DATA(state, payload) {
    state.form.local_entity_data = payload;
  },
  SET_ACTION_LOCAL_ENTITY_DATA(state, payload) {
    state.form.actions[payload.actionIdx].local_entity_data = payload.data;
  },
  SET_ROW_LOCAL_ENTITY_DATA(state, payload) {
    state.form.rows[payload.rowIdx].local_entity_data = payload.data;
  },
  SET_SECTION_LOCAL_ENTITY_DATA(state, payload) {
    state.form.rows[payload.rowIdx].sections[
      payload.sectionIdx
    ].local_entity_data = payload.data;
  },
  SET_FIELD_LOCAL_ENTITY_DATA(state, payload) {
    state.form.rows[payload.rowIdx].sections[payload.sectionIdx].fields[
      payload.fieldIdx
    ].local_entity_data = payload.data;
  },
  SET_FORM_UNFILLED_REQUIRED_VALUES(state, payload) {
    state.form.unfilled_required_values = payload;
  },
  SET_ACTION_UNFILLED_REQUIRED_VALUES(state, payload) {
    state.form.actions[payload.actionIdx].unfilled_required_values =
      payload.data;
  },
  SET_ROW_UNFILLED_REQUIRED_VALUES(state, payload) {
    state.form.rows[payload.rowIdx].unfilled_required_values = payload.data;
  },
  SET_SECTION_UNFILLED_REQUIRED_VALUES(state, payload) {
    state.form.rows[payload.rowIdx].sections[
      payload.sectionIdx
    ].unfilled_required_values = payload.data;
  },
  SET_FIELD_UNFILLED_REQUIRED_VALUES(state, payload) {
    state.form.rows[payload.rowIdx].sections[payload.sectionIdx].fields[
      payload.fieldIdx
    ].unfilled_required_values = payload.data;
  },
};

const actions = {
  /**
   * Creates a new form
   * @param context
   */
  newForm(context) {
    let api_state = context.rootState.api;
    let config_values = {};

    api_state.form_config.forEach((config) => {
      config_values[config.id] =
        config.name === "Nombre"
          ? "Nuevo Formulario"
          : config.format === "TEXT"
          ? ""
          : config.name === "Tipo"
          ? {
              id: config.default_value,
              name: JSON.parse(config.options)[config.default_value],
            }
          : [];
    });

    context.commit("SET_FORM", {
      rows: [],
      actions: [],
      config_values: config_values,
      local_entity_data: {},
      unfilled_required_values: 0,
    });
  },
  /**
   * Loads a form, instead of creating a new one.
   *
   * Uses JSON and list of JSON entity-data structures
   * @param context
   * @param form form
   * @param rows rows of the form
   * @param sections sections of the form
   * @param fields fields of the form
   * @param actions actions of the form
   */
  loadForm(context, { form, rows, sections, fields, actions }) {
    let api_state = context.rootState.api;
    let form_config_values = getValuesFromRemoteEntityData(
      api_state.form_config,
      api_state.form_config_select,
      form,
      context.rootGetters["tools/selectFormat"]
    );

    let form_actions = [];
    actions.forEach((action) => {
      // Skip inactive/deleted (not valid) actions
      if (
        !action[
          api_state.actions_config.find((config) => config.col_name === "valid")
            .id
        ]
      )
        return;
      let action_config_values = getValuesFromRemoteEntityData(
        api_state.actions_config,
        api_state.actions_config_select,
        action,
        context.rootGetters["tools/selectFormat"]
      );
      form_actions.push({
        config_values: action_config_values,
        index: -1,
        local_entity_data: action,
        unfilled_required_values: 0,
      });
    });

    let form_rows = [];
    rows.forEach((row) => {
      // Skip inactive/deleted (not valid) rows
      if (
        !row[
          api_state.rows_config.find((config) => config.col_name === "valid").id
        ]
      )
        return;
      let row_config_values = getValuesFromRemoteEntityData(
        api_state.rows_config,
        api_state.rows_config_select,
        row,
        context.rootGetters["tools/selectFormat"]
      );
      let row_sections = [];
      let row_id_config = api_state.sections_config.find(
        (config) => config.col_name === "form_row_id"
      ).id;
      sections
        .filter((section) => section[row_id_config] === row.id)
        .forEach((section) => {
          // Skip inactive/deleted (not valid) sections
          if (
            !section[
              api_state.sections_config.find(
                (config) => config.col_name === "valid"
              ).id
            ]
          )
            return;
          let section_config_values = getValuesFromRemoteEntityData(
            api_state.sections_config,
            api_state.sections_config_select,
            section,
            context.rootGetters["tools/selectFormat"]
          );
          let section_fields = [];
          let section_id_config = api_state.fields_config.find(
            (config) => config.col_name === "form_section_id"
          ).id;
          fields
            .filter((field) => field[section_id_config] === section.id)
            .forEach((field) => {
              if (
                !field[
                  api_state.fields_config.find(
                    (config) => config.col_name === "valid"
                  ).id
                ]
              )
                return;
              let field_config_values = getValuesFromRemoteEntityData(
                api_state.fields_config,
                api_state.fields_config_select,
                field,
                context.rootGetters["tools/selectFormat"]
              );

              let api_field = api_state.fields.find(
                (api_field) =>
                  api_field.name ===
                  field_config_values[
                    api_state.fields_config.find(
                      (config) => config.name === "Columna"
                    ).id
                  ].name
              );
              delete field["form_id"];
              if (!api_field) {
                console.warn(
                  "Possible duplicated field in the form. Column: " +
                    field_config_values[
                      api_state.fields_config.find(
                        (config) => config.name === "Columna"
                      ).id
                    ].name
                );
                section_fields.push({
                  index: -1,
                  idxRow: -1,
                  idxSection: -1,
                  show: false,
                  show_in_create_form: false,
                  show_in_edit_form: false,
                  name: null,
                  format: null,
                  config_values: field_config_values,
                  local_entity_data: field,
                  unfilled_required_values: 0,
                });
                return;
              }
              context.commit("api/REMOVE_FIELD", api_field, { root: true });
              api_field["config_values"] = field_config_values;
              api_field["local_entity_data"] = field;
              section_fields.push(api_field);
            });

          delete section["form_id"];
          row_sections.push({
            fields: section_fields,
            index: -1,
            idxRow: -1,
            config_values: section_config_values,
            local_entity_data: section,
            unfilled_required_values: 0,
          });
        });

      delete row["form_id"];
      form_rows.push({
        sections: row_sections,
        config_values: row_config_values,
        index: -1,
        local_entity_data: row,
        unfilled_required_values: 0,
      });
    });
    // Order index
    let order_conf_id = api_state.rows_config.find(
      (config) => config.name === "Orden"
    ).id;
    form_rows.sort(
      (row1, row2) =>
        row1.config_values[order_conf_id] - row2.config_values[order_conf_id]
    );
    form_rows.forEach((row, idxRow) => {
      row.index = idxRow;

      let order_conf_id = api_state.sections_config.find(
        (config) => config.name === "Orden"
      ).id;
      row.sections.sort(
        (section1, section2) =>
          section1.config_values[order_conf_id] -
          section2.config_values[order_conf_id]
      );
      row.sections.forEach((section, idxSection) => {
        section.idxRow = idxRow;
        section.index = idxSection;

        let order_conf_id = api_state.fields_config.find(
          (config) => config.name === "Orden"
        ).id;
        section.fields.sort(
          (field1, field2) =>
            field1.config_values[order_conf_id] -
            field2.config_values[order_conf_id]
        );
        section.fields.forEach((field, idxField) => {
          field.idxRow = idxRow;
          field.idxSection = idxSection;
          field.index = idxField;
        });
      });
    });

    context.commit("SET_FORM", {
      rows: form_rows,
      actions: form_actions,
      config_values: form_config_values,
      local_entity_data: form,
      unfilled_required_values: 0,
    });
  },
  /**
   * Updates `form.actions` using the actions selected in `form.config_values`
   * @param state
   * @param rootState
   * @param rootGetters
   */
  updateActions({ state, rootState, rootGetters }) {
    let form_selected_actions =
      state.form.config_values[
        rootState.api.form_config.find((config) => config.name === "Acciones")
          .id
      ];
    let action_id_config = rootState.api.actions_config.find(
      (config) => config.col_name === "action_id"
    ).id;
    let action_active_config = rootState.api.actions_config.find(
      (config) => config.col_name === "valid"
    ).id;

    // Move all form.actions to form.unlisted_actions, then move back only the selected ones.
    state.form.actions.forEach((action) =>
      state.form.actions_unlisted.push(action)
    );
    state.form.actions = [];

    form_selected_actions.forEach((selected_action, actionIdx) => {
      let form_action = state.form.actions_unlisted.find(
        (action) =>
          action.config_values[action_id_config].id === selected_action.id
      );
      if (form_action) {
        // This selected action was ever configured, so we move it back to form.actions and put it active
        form_action.config_values[action_active_config] = true;
        state.form.actions.push(form_action);
        let to_remove_idx = state.form.actions_unlisted.indexOf(form_action);
        state.form.actions_unlisted.splice(to_remove_idx, 1);
        return;
      }
      // This selected action was never configured, so we have to create the form action
      let config_values = {};
      rootState.api.actions_config.forEach((config) => {
        config_values[config.id] =
          config.id === action_id_config
            ? selected_action // Associate the button to the action
            : config.col_name === "name"
            ? selected_action.name // Default button's name is the action name
            : rootGetters["tools/selectFormat"](config);
      });

      state.form.actions.push({
        index: actionIdx,
        config_values: config_values,
        local_entity_data: {},
        unfilled_required_values: 0,
      });
    });
  },
  /**
   * Fills `local_entity_data` and `unfilled_required_values` of all the elements in the form
   *
   * Uses the `config_values` of the objects to generate the `local_entity data`
   * @param commit
   * @param state
   * @param rootState
   */
  fillLocalEntityData({ commit, state, rootState }) {
    let state_api = rootState.api;
    let form = state.form;
    commit(
      "SET_FORM_LOCAL_ENTITY_DATA",
      fillObjLocalEntityData(state_api.form_config, form)
    );
    commit(
      "SET_FORM_UNFILLED_REQUIRED_VALUES",
      lookForUnfilledRequiredValues(state_api.form_config, form, [])
    );
    form.actions.forEach((action, actionIdx) => {
      commit("SET_ACTION_LOCAL_ENTITY_DATA", {
        actionIdx: actionIdx,
        data: fillObjLocalEntityData(state_api.actions_config, action),
      });
      commit("SET_ACTION_UNFILLED_REQUIRED_VALUES", {
        actionIdx,
        data: lookForUnfilledRequiredValues(
          state_api.actions_config,
          action,
          []
        ),
      });
    });

    form.rows.forEach((row, rowIdx) => {
      commit("SET_ROW_LOCAL_ENTITY_DATA", {
        rowIdx: rowIdx,
        data: fillObjLocalEntityData(state_api.rows_config, row),
      });
      commit("SET_ROW_UNFILLED_REQUIRED_VALUES", {
        rowIdx: rowIdx,
        data: lookForUnfilledRequiredValues(state_api.rows_config, row, [
          state_api.rows_config.find((config) => config.name === "Formulario")
            .id,
        ]),
      });

      row.sections.forEach((section, sectionIdx) => {
        commit("SET_SECTION_LOCAL_ENTITY_DATA", {
          rowIdx: rowIdx,
          sectionIdx: sectionIdx,
          data: fillObjLocalEntityData(state_api.sections_config, section),
        });
        commit("SET_SECTION_UNFILLED_REQUIRED_VALUES", {
          rowIdx: rowIdx,
          sectionIdx: sectionIdx,
          data: lookForUnfilledRequiredValues(
            state_api.sections_config,
            section,
            [
              state_api.sections_config.find(
                (config) => config.name === "Formulario"
              ).id,
              state_api.sections_config.find(
                (config) => config.name === "Fila del formulario"
              ).id,
            ]
          ),
        });

        section.fields.forEach((field, fieldIdx) => {
          commit("SET_FIELD_LOCAL_ENTITY_DATA", {
            rowIdx: rowIdx,
            sectionIdx: sectionIdx,
            fieldIdx: fieldIdx,
            data: fillObjLocalEntityData(state_api.fields_config, field),
          });
          commit("SET_FIELD_UNFILLED_REQUIRED_VALUES", {
            rowIdx: rowIdx,
            sectionIdx: sectionIdx,
            fieldIdx: fieldIdx,
            data: lookForUnfilledRequiredValues(
              state_api.fields_config,
              field,
              [
                state_api.fields_config.find(
                  (config) => config.name === "Formulario"
                ).id,
                state_api.fields_config.find(
                  (config) => config.name === "Sección formulario"
                ).id,
              ]
            ),
          });
        });
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
