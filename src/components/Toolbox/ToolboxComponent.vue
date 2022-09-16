<template>
<b-container class="flex-shrink-0 p-3" id="tool-box">
  <ul class="list-unstyled ps-0">
    <DropdownMenu
      :menu_name="'Campos'"
      :menu_id="'panelsStayOpen-collapseOne'"
      :elements="[{name: 'Campo 1'}, {name: 'Campo 2'}]"
      :draggable_elements="true"></DropdownMenu>
    <DropdownMenu
      :menu_name="'Configuración'"
      :menu_id="'panelsStayOpen-collapseTwo'"
      :elements="[{name: 'Nombre de campo', type: 'text-input'}, {name: 'required', type: 'checkbox'}, {name: 'Unknown', type: 'Unknown'}]"
    ></DropdownMenu>
  </ul>
  <b-button variant="primary" class="button-save-form" style="position: relative; left: 50%; -transform: translate(-50%, 0%);">
    Guardar Formulario
  </b-button>
  
</b-container>
</template>

<script>
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import DropdownMenu from './DropdownMenu.vue';

export default {
  name: 'ToolboxComponent',
  components: {
    DropdownMenu,
  },
  data() {
    
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
</style>