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
  show_config:false,
};
const mutations = {
  change_hover(state, activated) {
    state.hover_fields = activated;
  },
  setActivatedTab(state, tab) {
    state.actual_tab = tab;
  },
  switchConfigSlide(state, val){
    state.show_config = val;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
