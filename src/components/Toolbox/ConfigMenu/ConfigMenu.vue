<template>
  <div visible :id="menu_id" style="padding: 1em">
    <FormConfigMenu
      v-if="currentForm"
      :name="currentFormName"
      :menu_id="menu_id"
      :current_obj="currentForm"
      :hidden_config="columns_hidden"
      :title="'Formulario'"
    />
    <RowConfigMenu
      v-else-if="currentRow"
      :name="currentRowName"
      :menu_id="menu_id"
      :current_obj="currentRow"
      :hidden_config="columns_hidden"
      :title="'Fila'"
    />
    <SectionConfigMenu
      v-else-if="currentSection"
      :name="currentSectionName"
      :menu_id="menu_id"
      :current_obj="currentSection"
      :hidden_config="columns_hidden"
      :title="'Sección'"
    />
    <FieldConfigMenu
      v-else-if="currentField"
      :name="currentFieldName"
      :menu_id="menu_id"
      :current_obj="currentField"
      :hidden_config="columns_hidden"
      :title="'Campo'"
    />
  </div>
</template>

<script>
import FormConfigMenu from "./FormConfigMenu.vue";
import RowConfigMenu from "./RowConfigMenu.vue";
import SectionConfigMenu from "./SectionConfigMenu.vue";
import FieldConfigMenu from "./FieldConfigMenu.vue";

export default {
  name: "ConfigMenu",
  components: {
    FormConfigMenu,
    RowConfigMenu,
    SectionConfigMenu,
    FieldConfigMenu,
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
    currentForm() {
      return this.$store.state.form.current_form_config;
    },
    currentRow() {
      return this.$store.state.form.current_row_config;
    },
    currentField() {
      return this.$store.state.form.current_field_config;
    },
    currentSection() {
      return this.$store.state.form.current_section_config;
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
      return this.currentRow.config_values[
        this.$store.state.api.rows_config.find(
          (config) => config.name === "Nombre"
        ).id
      ];
    },
    currentFormName() {
      return this.currentForm.config_values[
        this.$store.state.api.form_config.find(
          (config) => config.name === "Nombre"
        ).id
      ];
    },
  },
  data() {
    return {
      columns_hidden: [
        "Formulario",
        "Fila del formulario",
        "Sección formulario",
        "Alternativas",
        "Entidad del form",
        "Sección siguiente default",
        "Mostrar solo por el campo",
        "Mostrar solo si el campo posee valor",
        "Columna",
      ],
    };
  },
  methods: {
    handleImage(obj) {
      obj.image_url = window.URL.createObjectURL(obj.image);
    },
    updateFormId(entity) {
      this.$store.state.form.form.rows[this.currentRow.index].form_id = entity;
      this.$store.state.form.form.rows[this.currentRow.index].sections.forEach(
        (section) => {
          section.form_id = entity;
        }
      );
    },
    updateRowName(element) {
      this.$store.state.form.form.rows[this.currentRow.index].sections.forEach(
        (section) => (section.form_row_id = element)
      );
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
.slider {
  margin-top: 1em !important;
  margin-bottom: 0 !important;
}
</style>
