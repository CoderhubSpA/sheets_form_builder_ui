const state = {
    form:{
        name:"Cargando configuraciones...",
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
        state.form.name = payload.name;
        state.form.rows = payload.rows;
        state.form.config_values = payload.config_values;
    },
    addSection(state, payload){
        state.form.rows[payload.row_idx].sections.push(payload.section)
    },
    addRow(state, payload){
        state.form.rows.push(payload.row)
    },
    addField(state, payload){
        state.form.rows[payload.row_idx].sections[payload.section_idx].push(payload.field)
    }
 }

const actions = {
	new_form(context) {
        let api_state = context.rootState.api;
        let config_values = {};
        
        api_state.config.forEach(config => {
            config_values[config.id] = 
                config.format === "TEXT" ? "" :
                [];
        })

        context.commit('loadForm', {
            'name': "Nombre Formulario",
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