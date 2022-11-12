<template>
  <div :id="menu_id" :class="showMenu ? 'show-menu':'hide-menu'" class="flex-shrink-0 float-end custom-side-menu bg-light">

        <b-row class="m-0">
          <b-col class="p-2">
            <v-icon @click="switchMenu" class="float-start" role="button" :name="showMenu? 'angle-right': 'angle-left'" scale="1.5"  />
          </b-col>
        </b-row>
        <b-row class="m-0 p-0 py-3" :class="showMenu? 'd-none':'d-block'" style="color:#008a94;writing-mode: vertical-rl; font-size: 16pt;">
            Configuración
        </b-row> 
        <b-row class="m-0" :class="showMenu? 'd-block':'d-none'">
          <b-col class="px-3 m-0">
            <ConfigMenuComponent :menu_id="menu_id"/>
          </b-col>
        </b-row>
  
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
    switchMenu(){
      this.showMenu = !this.showMenu;
    },
  },
};
</script>

<style lang="scss">

.custom-side-menu{
  // width: 3%;
  // max-width: 25%;
  // height: 100%;
  // max-height: 1to;00%;
  overflow-y: auto;
  transition:width  0.3s ease;
  // transition: opacity 1s ease-out;
}
.show-menu{
  width: 20%;
  max-width: 25%;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  transition:width .3s ease;
}
.hide-menu{
  width: 3%;
  max-width: 25%;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}


</style>
