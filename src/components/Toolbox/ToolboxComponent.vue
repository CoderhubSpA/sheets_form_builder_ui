<template>
<b-container class="flex-shrink-0 p-3" id="tool-box">
  <b-nav pills style="padding-bottom: 10px;">
    <b-nav-item class="col-6 center" @click="tabFields" :active = "tab =='fields'">
      <h3>Campos</h3>
    </b-nav-item>
    <b-nav-item class="col-6 center" @click="tabConfig" :active = "tab =='config'">
      <h3>Configuración</h3>
    </b-nav-item>
  </b-nav>
  <div class="ps-0" id="tab">
    <div v-if="tab == 'fields'">
      <fields
      :menu_name="'Campos'"
      :menu_id="'panelsStayOpen-collapseOne'"/>
    </div>
    <div v-else-if="tab == 'config'">
      <config
      :menu_name="'Configuración'"
      :menu_id="'panelsStayOpen-collapseTwo'"/>
    </div>
  </div>
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
      tab(){
          return this.$store.state.tools.actual_tab
      }
  },
  methods: {
    tabFields(){
      this.$store.state.tools.actual_tab = "fields";
    },
    tabConfig(){
      this.$store.state.tools.actual_tab = "config";
    },
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

  flex-wrap: wrap;
}

#tab {
  max-height: 90%;
  overflow-y: auto;
}

.nav-pills .nav-link.active, .nav-pills .show>.nav-link {
  color: var(--bs-nav-pills-link-active-color);
  background-color: #008A94;
}

.nav-link {
  color: var(--bs-body-color);
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