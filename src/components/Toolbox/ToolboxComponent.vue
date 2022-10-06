<template>
<b-container class="flex-shrink-0 p-3" id="tool-box">
  <div class="container">
    <div class="row justify-content-md-around">
      <b-button class="btn col-3" @click="viewXl" :variant = "view =='xl' ? 'success' : 'dark'">
        <v-icon class="custom-icon" name="laptop"></v-icon>
      </b-button>
      <b-button class="btn col-3" @click="viewMd" :variant = "view =='md' ? 'success' : 'dark'">
        <v-icon class="custom-icon" name="tablet"></v-icon>
      </b-button>
      <b-button class="btn col-3" @click="viewSm" :variant = "view =='sm' ? 'success' : 'dark'">
        <v-icon class="custom-icon" name="mobile"></v-icon>
      </b-button>
    </div>
  </div>
  <ul class="list-unstyled ps-0">
    <fields
      :menu_name="'Campos'"
      :menu_id="'panelsStayOpen-collapseOne'"></fields>
    <config
      :menu_name="'Configuración'"
      :menu_id="'panelsStayOpen-collapseTwo'"></config>
  </ul>
  <b-button variant="primary" class="button-save-form" style="position: relative; margin: 0 25% 5% 25%;">
    Guardar Formulario
  </b-button>
</b-container>
</template>

<script>
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import fields from './FieldsDropdownMenu.vue';
import config from './ConfigDropdownMenu.vue';

export default {
  name: 'ToolboxComponent',
  components: {
    fields,
    config,
  }, 
  computed:{
      view(){
          return this.$store.state.form.current_view
      }
  },
  methods: {
    viewXl(){
      this.$store.state.form.current_view = "xl";
    },
    viewMd(){
      this.$store.state.form.current_view = "md";
    },
    viewSm(){
      this.$store.state.form.current_view = "sm";
    }
  }
}

</script>

<style>
#tool-box {

  background-color: #DEE6F1;
  border-color: #008A94;
  border-width: 2px;
  border-radius: 5px;
  border-style: solid;

  padding: 10px;
  margin-right: 5px;

  width: 25%;
  max-width: 25%;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;

  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
}

.button-save-form {
  --bs-btn-bg: #008A94;
  --bs-btn-border-color: #008A94;
  --bs-btn-hover-bg: #06737a;
  --bs-btn-hover-border-color: #06737a;
  --bs-btn-active-bg: #17474b;
  --bs-btn-active-border-color: #17474b;
}

ul {
  width: 100%;
}
</style>