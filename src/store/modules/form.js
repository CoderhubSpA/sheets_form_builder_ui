const state = {
    form:{
        name:"Nombre Formulario",
        rows:[]
    }
}
const mutations = {
    addSection(state, payload){
        state.form.rows[payload.row_idx].sections.push(payload.section)
    },
    addRow(state, payload){
        state.form.rows.push(payload.row)
    },
    addField(state, payload){
        state.form[payload.row_idx][payload.section_idx].push(payload.section)
    },
 }

const actions = {
	
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
};