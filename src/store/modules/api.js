import axios from "axios"

const state = {
  base_url: 'http://127.0.0.1:8081/',
  info_url: 'entity/info/',
  records_url: 'sheets/getrecord/form/',
  form_id: '8106ddcc-21d3-40f6-94fa-c2fe85ac638f',
  configuration_id: '41045a45-3ba9-11eb-877b-f23c911d2162',
  fields_id: '41045aca-3ba9-11eb-877b-f23c911d2162',
  config: [
    
  ],
  config_select: {
    "id-example": {
      "options": [],
      "values": [],
    },
  },
  fields: [
    // each field will have its config and config_select
  ],
}

const mutations = {
  API_CONFIG(state) {
    axios.get(
      state.base_url + state.info_url + state.configuration_id
    )
    .then(response => {
      console.log(response.data.content);
      let columns = response.data.content.columns;

      for (let i_col = 0; i_col < columns.length; i_col++) {
        let column = columns[i_col];
        state.config.push(column)

        if (["SELECTOR", "SELECTOR[MULTIPLE]"].includes(column.format))
        {
          let options = [];
          
          let options_fk = column.entity_type_fk;
          if (!options_fk)
          {
            let json_options = JSON.parse(column.options);
            for (let key in json_options)
            {
              options.push({
                "id": key,
                "name":json_options[key]
              });
            }
          } else {
            options = response.data.content.entities_fk[options_fk];
          }
          
          state.config_select[column.id] = {
            "options": options,
            "values": [],
          }
        }
      }
    })
  },
  FETCH_FIELDS(state) {
    axios.get(
      state.base_url + state.info_url + state.fields_id
    )
    .then(response => {
      console.log(response.data.content);

      let columns = response.data.content.columns;

      // First, we need to get the possible fields, so we search for the column "Columna"
      let field_columna = columns.find(col => col.name == "Columna");
      let all_possible_fields = response.data.content.entities_fk[field_columna.entity_type_fk];
      // Filter the fields that are from other forms
      all_possible_fields = all_possible_fields.filter(
        field => (field.form_id == state.form_id) && (field.form_id != null)
      );
      state.fields = all_possible_fields;
      console.log(all_possible_fields);

      // Each field will have their own configuration, so all of them must have these columns as their own's
      /*
      for (let i_col = 0; i_col < columns.length; i_col++)
      {
        let column = columns[i_col];
      }*/
    })
  }
}

const actions = {
  api_config(context) {
    context.commit('API_CONFIG');
  },
  fetch_fields(context) {
    context.commit('FETCH_FIELDS');
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};