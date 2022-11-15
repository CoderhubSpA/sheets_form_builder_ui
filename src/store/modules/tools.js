const state = {
  format_types: [
    { name: "TEXT", value: "" },
    { name: "NUMBER", value: null },
    { name: "SELECTOR", value: [] },
    { name: "SELECTOR[1XN][ONLYNEW]", value: [] },
    { name: "SiNo", value: false },
    { name: "DOCUMENT[IMAGE]", value: [] },
    { name: "URL", value: "" },
  ],
  hover_fields: false,
  actual_tab: "config",
  current_config: {},
  show_config: false,
};
const getters = {
  selectFormat:
    (state) =>
    ({ format, name }) => {
      if (name === "col_sm" || name === "col_md" || name === "col_xl") {
        return "12";
      }
      let type = state.format_types.find((element) => element.name === format);
      if (type) return type.value;
      console.log("No se encontró el formato" + format);
      return "";
    },
};
const mutations = {
  change_hover(state, activated) {
    state.hover_fields = activated;
  },
  setActivatedTab(state, tab) {
    state.actual_tab = tab;
  },
  switchConfigSlide(state, val) {
    state.show_config = val;
  },
  SET_CURRENT_CONFIG(state, config) {
    state.current_config = config;
  },
};

const actions = {
  openFormConfig(context, form) {
    context.commit("SET_CURRENT_CONFIG", {
      obj: form,
      title: "Configuración del formulario",
      config_type: "form_config",
      name_id: "Nombre",
    });
  },
  openActionConfig(context, action) {
    context.commit("SET_CURRENT_CONFIG", {
      obj: action,
      title: "Configuración de la acción",
      config_type: "actions_config",
      name_id: "Acción",
    });
  },
  openRowConfig(context, row) {
    context.commit("SET_CURRENT_CONFIG", {
      obj: row,
      title: "Configuración de la fila",
      config_type: "rows_config",
      name_id: "Nombre",
    });
  },
  openSectionConfig(context, section) {
    context.commit("SET_CURRENT_CONFIG", {
      obj: section,
      title: "Configuración de la sección",
      config_type: "sections_config",
      name_id: "Título de la sección",
    });
  },
  openFieldConfig(context, field) {
    context.commit("SET_CURRENT_CONFIG", {
      obj: field,
      title: "Configuración del campo",
      config_type: "fields_config",
      name_id: "Columna",
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
