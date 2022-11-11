<template>
  <div :id="menu_id" class="flex-shrink-0 custom-side-menu float-end">
    
    
    <div :class="showMenu ? 'hide-fold':'show-fold'" class="float-end">
      <b-row class="m-0">
        <b-col class="p-2">
          <v-icon @click="openMenu" class="float-end" role="button" name="angle-left" scale="1.5"  />
        </b-col>
      </b-row> 

      <b-row class="m-0 p-0 py-3" style="writing-mode: vertical-rl; font-size: 16pt;">
        Configuración
      </b-row> 
    </div>
    <div :class="showMenu ? 'show-menu':'hide-menu'" class="bg-light">
      <b-row class="m-0">
        <b-col class="p-2">
          <v-icon @click="closeMenu" class="float-end" role="button" name="angle-right" scale="1.5"  />
        </b-col>
      </b-row>
      <b-row class="m-0">
        
        <b-col cols="2" class="text-center d-none" >
          
          <!-- <p class="m-0" style="writing-mode: vertical-rl; text-orientation: mixed;font-size: 16pt;">Configuración</p> -->
        </b-col>
      <b-col class="px-3 m-0">
        <ConfigMenuComponent :menu_id="menu_id"/>
      </b-col>
      </b-row>
    </div>
 
    <!--
    <FormConfigMenu
      v-if="currentConfigType === 'form_config'"
      :menu_id="menu_id"
      :hidden_config="columns_hidden"
    />
    <RowConfigMenu
      v-else-if="currentConfigType === 'rows_config'"
      :menu_id="menu_id"
      :hidden_config="columns_hidden"
    />
    <SectionConfigMenu
      v-else-if="currentConfigType === 'sections_config'"
      :menu_id="menu_id"
      :hidden_config="columns_hidden"
    />
    <FieldConfigMenu
      v-else-if="currentConfigType === 'fields_config'"
      :menu_id="menu_id"
      :hidden_config="columns_hidden"
    />
      -->
  </div>
</template>

<script>
import ConfigMenuComponent from "./ConfigMenuComponent.vue";

export default {
  name: "ConfigMenu",
  components: {
    ConfigMenuComponent,
  },
  props: {
    menu_name: {
      type: String,
      required: false,
    },
    menu_id: {
      type: String,
      required: false,
    },
    draggable_elements: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    form() {
      return this.$store.state.form.form;
    },
    currentConfigType() {
      return this.$store.state.form.current_config.config_type;
    },
    currentConfig() {
      return this.$store.state.form.current_config;
    },

    currentFieldName() {
      return this.currentField.config_values[
        this.$store.state.api.fields_config.find(
          (config) => config.name === "Columna"
        ).id
      ].name;
    },
    currentSectionName() {
      return this.currentSection.config_values[
        this.$store.state.api.sections_config.find(
          (config) => config.name === "Título de la sección"
        ).id
      ];
    },
    currentRowName() {
      return this.currentRow.obj.config_values[
        this.$store.state.api.rows_config.find(
          (config) => config.name === "Nombre"
        ).id
      ];
    },
  },
  data() {
    return {
      collapse:true,
      showMenu:false,
    };
  },
  methods: {
    openMenu(){
      this.showMenu = !this.showMenu;
      var elements = document.getElementsByClassName("custom-side-menu");
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.width=("25%");
      }
      console.log("open")
    },
    closeMenu(){
      this.showMenu = !this.showMenu;
      var elements = document.getElementsByClassName("custom-side-menu");
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.width=("3%");
      }
      console.log("close")
    }
  },
};
</script>

<style lang="scss">

.custom-side-menu{
  width: 3%;
  max-width: 25%;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
}
.show-menu{
  display:block;
  height: 100%;
  overflow-x: hidden;
}
.hide-menu{
  display:none;
}
.show-fold{
  display:block;
  width: 35px;
  height: 100%;
  max-height: 100%;
  background-color: #eeeef5;
  color:#008a94;
}
.hide-fold{
  display:none;
}

</style>
