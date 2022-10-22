const state = {
    form:{
        is_loaded: false,
        rows:[],
        config_values: {},
    },
    current_form_config: null,
    current_row_config: null,
    current_section_config: null,
    current_field_config: null,
    current_view: "xl"
}
const mutations = {
    loadForm(state, payload) {
        state.form.rows = payload.rows;
        state.form.config_values = payload.config_values;
        state.form.is_loaded = true;
    },
 }

const actions = {
	new_form(context) {
        let api_state = context.rootState.api;
        let config_values = {};
        
        api_state.form_config.forEach(config => {
            config_values[config.id] = 
                config.name === "Nombre" ? "Nuevo Formulario" :
                config.format === "TEXT" ? "" :
                [];
        })

        context.commit('loadForm', {
            'rows': [],
            'config_values': config_values,
        });
    },
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};