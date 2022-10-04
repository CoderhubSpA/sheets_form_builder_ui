<template>
  <div class="container-fluid">
    <NavbarComponent/>
    <div id="app" style="min-height: 600px; height: 90vh;" class="d-flex flex-row">
      <ToolboxComponent></ToolboxComponent>
      <FormComponent/>
    </div>
  </div>
</template>

<script>

// import Row from './components/Row.vue';
import FormComponent from './components/FormComponent.vue'
import ToolboxComponent from './components/Toolbox/ToolboxComponent.vue'
import NavbarComponent from './components/Navbar.vue';
import axios from 'axios';

export default {
    name: "App",
    components: { FormComponent, ToolboxComponent, NavbarComponent },
    data: () => ({
      base_url: 'http://127.0.0.1:8081/',
      info_url: 'entity/info/',
      records_url: 'sheets/getrecord/form/',
      form_id: '8106ddcc-21d3-40f6-94fa-c2fe85ac638f',
      configuration_id: '41045a45-3ba9-11eb-877b-f23c911d2162',
    }),
    mounted: function() {
        axios.get(
          this.base_url + this.info_url + this.configuration_id
        )
        .then(response => {
          console.log(response.data.content);
          let columns = response.data.content.columns;

          for (let i_col = 0; i_col < columns.length; i_col++) {
            let column = columns[i_col];
            this.$store.state.api.config.push(column)

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
              
              this.$store.state.api.config_select[column.id] = {
                "options": options,
                "values": [],
              }
            }
          }
          
        })
      
    },
}

</script>

