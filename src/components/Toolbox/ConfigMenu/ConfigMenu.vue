<template>
  <div
    :id="menu_id"
    :class="showMenu ? 'show-config-menu' : 'hide-config-menu'"
    class="flex-shrink-0 float-end custom-side-menu bg-light"
  >
    <div style="max-height: 92%; overflow-x: hidden; overflow-y: auto">
      <b-row class="m-0">
        <b-col class="p-2">
          <v-icon
            @click="switchMenu"
            class="float-start"
            role="button"
            :name="showMenu ? 'angle-right' : 'angle-left'"
            scale="1.5"
          />
        </b-col>
      </b-row>
      <b-row
        class="m-0 p-0 py-3 label-menus"
        :class="showMenu ? 'd-none' : 'd-block'"
      >
        Configuración
      </b-row>
      <b-row class="m-0" :class="showMenu ? 'd-block' : 'd-none'">
        <b-col class="px-3 m-0">
          <ConfigMenuComponent
            v-if="this.$store.state.tools.current_config.obj"
            :menu_id="menu_id"
          />
        </b-col>
      </b-row>
    </div>
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
    showMenu() {
      return this.$store.state.tools.show_config;
    },
  },

  data() {
    return {
      collapse: true,
    };
  },
  methods: {
    switchMenu() {
      this.$store.commit("tools/switchConfigSlide", !this.showMenu);
      // this.showMenu = !this.showMenu;
    },
  },
};
</script>
