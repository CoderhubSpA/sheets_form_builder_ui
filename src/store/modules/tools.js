const state = {
  format_types: [
    { name: "TEXT", value: "" },
    { name: "NUMBER", value: null },
    { name: "SELECTOR", value: [] },
    { name: "SELECTOR[1XN][ONLYNEW]", value: [] },
    { name: "SiNo", value: null },
    { name: "DOCUMENT[IMAGE]", value: [] },
    { name: "URL", value: "" },
  ],
  hover_fields: false,
  actual_tab: "config",
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
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
