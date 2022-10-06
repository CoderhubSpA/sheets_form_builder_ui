const state = {
    form:{
        name:"Nombre Formulario",
        rows:[]
    },
    current_form_config: null,
    current_row_config: null,
    current_section_config: null,
    current_field_config: null,
    current_view: "xl"
}
const mutations = {
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
	
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};