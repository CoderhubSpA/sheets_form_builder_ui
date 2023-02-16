const state = {
  format_types: [
    { name: "TEXT", value: "" },
    { name: "NUMBER", value: null },
    { name: "SELECTOR", value: [] },
    { name: "SELECTOR[MULTIPLE]", value: [] },
    { name: "SELECTOR[1XN][ONLYNEW]", value: [] },
    { name: "SiNo", value: false },
    { name: "DOCUMENT[IMAGE]", value: { id: "", file: "" } },
    { name: "URL", value: "" },
  ],
  format_inputs: [
    { name: "TEXT", value: "text" },
    { name: "DATE", value: "date" },
    { name: "NUMBER", value: "number" },
    { name: "PASSWORD", value: "password" },
    { name: "RADIO", value: "radio" },
    { name: "DATETIME", value: "datetime-local" },
    { name: "DOCUMENT", value: "file" },
    { name: "URL", value: "url" },
    { name: "SELECTOR", value: "selector" },
    { name: "SiNo", value: "checkbox" },
  ],
  format_v_icon: [
    { format: "CLP", name: "dollar-sign" },
    { format: "DATE", name: "calendar" },
    { format: "DATETIME", name: "clock" },
    { format: "DOCUMENT", name: "file" },
    { format: "DOCUMENT[EXCEL]", name: "file-excel" },
    { format: "DOCUMENT[IMAGE]", name: "file-image" },
    { format: "INFO", name: "circle-info" },
    { format: "LATITUDE", name: "location-dot" },
    { format: "LONGITUDE", name: "location-dot" },
    { format: "MAPA", name: "map" },
    { format: "PASSWORD", name: "key" },
    { format: "PERCENTAGE", name: "percent" },
    { format: "PERCENTAGE[X100]", name: "percent" },
    { format: "QUESTION", name: "question" },
    { format: "RADIO", name: "radio-button-checked" },
    { format: "RUT", name: "user" },
    { format: "SELECTOR", name: "list" },
    { format: "SELECTOR[1XN][ALL]", name: "check-square" },
    { format: "SELECTOR[1XN][AVAILABLES]", name: "check-square" },
    { format: "SELECTOR[1XN][ONLYNEW]", name: "check-square" },
    { format: "SELECTOR[IMAGELIST]", name: "check-square" },
    { format: "SELECTOR[MULTIPLE]", name: "list" },
    { format: "SELECTOR[MULTIPLE][ADVANCED]", name: "check-square" },
    { format: "SELECTOR[REMOTE]", name: "check-square" },
    { format: "SELECTOR[REMOTE][MULTIPLE]", name: "check-square" },
    { format: "SELECTOR[REMOTE][MULTIPLE][ALL]", name: "check-square" },
    { format: "SiNo", name: "check-square" },
    { format: "TEXT", name: "edit" },
    { format: "TEXT[AREA]", name: "edit" },
    { format: "URL", name: "link" },
  ],
  hidden_config: [
    "Formulario",
    "Fila del formulario",
    "Sección formulario",
    "Alternativas",
    "Entidad del form",
    "Sección siguiente default",
    "Mostrar solo por el campo",
    "Mostrar solo si el campo posee valor",
    "Columna",
    "Id",
    "Acción",
    "Orden",
  ],
  hover_fields: false,
  actual_tab: "config",
  current_config: {},
  show_config: false,
  show_fields: false,
  current_view: "xl",
};
const getters = {
  selectFormat:
    (state) =>
    ({ format, default_value, options, col_name }) => {
      if (default_value) {
        if (format === "SELECTOR") {
          if (options)
            return {
              id: default_value,
              name: JSON.parse(options)[default_value],
            };
        } else if (format === "SiNo") return default_value === 1;
        else if (col_name !== "id") return String(default_value);
      }
      let type = state.format_types.find((element) => element.name === format);
      if (type) return type.value;
      return "";
    },
  selectInputType: (state) => (format) => {
    let type = state.format_inputs.find(
      (element) => element.name === format || format.includes(element.name)
    );
    if (type) return type.value;
    else return "text";
  },
  selectVIconName: (state) => (format) => {
    let type = state.format_v_icon.find((element) => element.format === format);
    if (type) return type.name;
    return "file";
  },
  currentView(state) {
    return state.current_view;
  },
  hiddenConfig(state) {
    return state.hidden_config;
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
  switchFieldsSlide(state, val) {
    state.show_fields = val;
  },
  SET_CURRENT_CONFIG(state, config) {
    state.current_config = config;
  },
  SET_CURRENT_VIEW(state, current_view) {
    state.current_view = current_view;
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
