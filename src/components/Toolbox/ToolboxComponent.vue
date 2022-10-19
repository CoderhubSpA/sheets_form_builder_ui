<template>
<div class="flex-shrink-0 p-3 bg-light" id="tool-box" >
  <b-nav card-header tabs style="padding-bottom: 10px;">
    <b-nav-item class="col-6 center" @click="tabFields" :active = "tab =='fields'">
      <h5>Campos</h5>
    </b-nav-item>
    <b-nav-item class="col-6 center" @click="tabConfig" :active = "tab =='config'">
      <h5>Configuración</h5>
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
</div>
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
  width: 25%;
  max-width: 25%;
  flex-wrap: wrap;
}


#tab {
  max-height: 90%;
  overflow-y: auto;
}

.nav-link {
  color: var(--bs-body-color);
}

.nav-tabs .nav-item .nav-link.active {
    color:#4b85bf !important
}

ul {
  width: 100%;
}


</style>