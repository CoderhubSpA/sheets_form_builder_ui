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
      : selectFormat(config.format, config.name);

    if (Array.isArray(config_values[config.id]))
      config_values[config.id].forEach((id_val, index) => {
        config_values[config.id][index] = configurations_select[
          config.id
        ].options.find((option) => option.id === id_val);
      });
    else if (config.format === "SELECTOR")
      config_values[config.id] = configurations_select[config.id].options.find(
        (option) => option.id === config_values[config.id]
      );
    else if (["col_sm", "col_md", "col_xl"].includes(config.col_name))
      config_values[config.id] = config_values[config.id].toString();
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
    config_values: {},
    local_entity_data: {},
    unfilled_required_values: 0,
  },
  current_config: {},
  current_view: "xl",
};
const mutations = {
  SET_FORM(state, payload) {
    state.form.rows = payload.rows;
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

    context.commit("SET_FORM", {
      rows: [],
      config_values: config_values,
      local_entity_data: {},
      unfilled_required_values: 0,
    });
  },
  loadForm(context, { form, rows, sections, fields }) {
    let selectFormat = (format, name) => {
      if (name === "col_sm" || name === "col_md" || name === "col_xl") {
        return "12";
      }
      let type = context.rootState.tools.format_types.find(
        (element) => element.name === format
      );
      if (type) return type.value;
      console.log("No se encontró el formato" + format);
      return "";
    };

    let api_state = context.rootState.api;
    console.log("Loading the following form");
    console.log(form);
    let form_config_values = getValuesFromRemoteEntityData(
      api_state.form_config,
      api_state.form_config_select,
      form,
      selectFormat
    );

    console.log(form_config_values);

    console.log("Loading the following " + rows.length + " rows");
    console.log(rows);
    console.log("and " + sections.length + " sections");
    console.log(sections);

    let form_rows = [];
    rows.forEach((row) => {
      let row_config_values = getValuesFromRemoteEntityData(
        api_state.rows_config,
        api_state.rows_config_select,
        row,
        selectFormat
      );
      let row_sections = [];
      let row_id_config = api_state.sections_config.find(
        (config) => config.col_name === "form_row_id"
      ).id;
      sections
        .filter((section) => section[row_id_config] === row.id)
        .forEach((section) => {
          let section_config_values = getValuesFromRemoteEntityData(
            api_state.sections_config,
            api_state.sections_config_select,
            section,
            selectFormat
          );
          row_sections.push({
            fields: [],
            index: -1,
            idxRow: -1,
            config_values: section_config_values,
            local_entity_data: section,
            unfilled_required_values: 0,
          });
        });
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
      });
    });

    context.commit("SET_FORM", {
      rows: form_rows,
      config_values: form_config_values,
      local_entity_data: form,
      unfilled_required_values: 0,
    });
    console.log("Loading the following " + fields.length + " fields");
    console.log(fields);
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
