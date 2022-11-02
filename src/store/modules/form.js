function fillObjLocalEntityData(configurations, obj) {
  // parses and generates a json with all valid values
  let values = obj.config_values;

  let data_values = {};
  configurations.forEach((config) => {
    let value = values[config.id];
    if (value || value === 0) {
      // check it has a truthy value, but counting 0 as valid
      if (config.name === "id") {
        // The id configuration is stored twice, one with key 'id' and the other as usual with config.id
        data_values["id"] = values[config.id];
        // DO NOT RETURN HERE, it's stored twice in the database so we need to do it here
      }
      if (!Array.isArray(value)) {
        // If it's not an array, we store that id
        data_values[config.id] = values[config.id].id
          ? values[config.id].id
          : values[config.id];
        return;
      } else if (value.length > 0) {
        // If it's a filled array, we store the array but with the ids
        data_values[config.id] = [];
        values[config.id].forEach((value) =>
          data_values[config.id].push(value.id)
        );
        return;
      }
    }
  });
  return data_values;
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
  current_config: {},
  current_view: "xl",
};
const mutations = {
  LOAD_FORM(state, payload) {
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
  newForm(context) {
    let api_state = context.rootState.api;
    let config_values = {};

    api_state.form_config.forEach((config) => {
      config_values[config.id] =
        config.name === "Nombre"
          ? "Nuevo Formulario"
          : config.format === "TEXT"
          ? ""
          : [];
    });

    context.commit("LOAD_FORM", {
      rows: [],
      actions: [],
      config_values: config_values,
      local_entity_data: {},
      unfilled_required_values: 0,
    });
  },
  updateActions({ state, rootState }) {
    /**
     * Updates form.actions using the actions selected in form.config_values
     */
    let form_selected_actions =
      state.form.config_values[
        rootState.api.form_config.find((config) => config.name === "Acciones")
          .id
      ];
    let action_id_config = rootState.api.actions_config.find(
      (config) => config.col_name === "action_id"
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
        // This selected action was ever configured , so we move it back to form.actions
        state.form.actions.push(form_action);
        let to_remove_idx = state.form.actions_unlisted.indexOf(form_action);
        state.form.actions_unlisted.splice(to_remove_idx, 1);
        return;
      }
      // This selected action was never configured, so we have to create the form action
      let config_values = {};
      let selectFormat = (format, name) => {
        if (name === "col_sm" || name === "col_md" || name === "col_xl") {
          return "12";
        }
        let type = rootState.tools.format_types.find(
          (element) => element.name === format
        );
        if (type) return type.value;
        console.log("No se encontró el formato" + format);
        return "";
      };
      rootState.api.actions_config.forEach((config) => {
        config_values[config.id] =
          config.id === action_id_config
            ? selected_action // Associate the button to the action
            : config.col_name === "name"
            ? selected_action.name // Default button's name is the action name
            : selectFormat(config.format, config.name);
      });

      state.form.actions.push({
        index: actionIdx,
        config_values: config_values,
        local_entity_data: {},
        unfilled_required_values: 0,
      });
    });
  },
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
