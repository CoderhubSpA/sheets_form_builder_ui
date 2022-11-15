<template>
  <div visible :id="menu_id" style="padding: 1em">
    <ConfigMenuComponent
      v-if="this.$store.state.tools.current_config.obj"
      :menu_id="menu_id"
    />
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
      return this.$store.state.tools.current_config.config_type;
    },
    currentConfig() {
      return this.$store.state.tools.current_config;
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
    return {};
  },
  methods: {},
};
</script>
