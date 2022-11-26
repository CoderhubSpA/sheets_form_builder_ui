<template>
  <div
    id="sidebarfields"
    :class="showMenu ? 'show-fields-menu' : 'hide-fields-menu'"
    class="flex-shrink-0 custom-side-menu bg-light"
  >
    <b-row class="m-0">
      <b-col class="p-2">
        <v-icon
          @click="switchMenu"
          class="float-end"
          role="button"
          :name="showMenu ? 'angle-left' : 'angle-right'"
          scale="1.5"
        />
      </b-col>
    </b-row>
    <b-row
      class="m-0 p-0 py-3 float-end"
      :class="showMenu ? 'd-none' : 'd-block'"
      style="color: #008a94; writing-mode: vertical-rl; font-size: 16pt"
    >
      Campos
    </b-row>
    <b-row class="mx-2" :class="showMenu ? 'd-block' : 'd-none'">
      <div class="form-group flex">
        <b-input
          v-model="search"
          id="section-config-name"
          type="text"
          placeholder="Busca un campo aquí..."
        />
        <button
          type="button"
          class="btn btn-danger btn-sm delete"
          @click="clearSearchBar"
        >
          <v-icon class="custom-icon" name="trash"></v-icon>
        </button>
      </div>
      <p class="drag-message">Arrastra los campos al formulario</p>
      <draggable
        @dragstart.native="hover_fields = true"
        @dragend.native="hover_fields = false"
        class="card-deck row"
        style="display: flex; margin: 5px 0 5px 0"
        :group="{ name: 'Fields', pull: true, put: false }"
        :list="fields"
      >
        <FieldMenuComponent
          v-for="element in fields"
          :key="element.name"
          :text="element.name"
          :format_config_id="element.format_config_id"
          :config="element.config_values"
        />
      </draggable>
    </b-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import FieldMenuComponent from "./FieldMenuComponent.vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default {
  name: "FieldsMenu",
  components: {
    FieldMenuComponent,
    draggable,
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
    hover_fields: {
      get() {
        return this.$store.state.tools.hover_fields;
      },
      set(value) {
        this.$store.commit("tools/change_hover", value);
      },
    },
    fields() {
      let on_edit =
        this.$store.state.form.form.local_entity_data?.id?.length > 0;

      return this.$store.state.api.fields.filter(
        (field) =>
          ((!on_edit && field.show_in_create_form === 2) ||
            (on_edit && field.show_in_edit_form === 2)) &&
          this.checkName(field.name)
      );
    },
    showMenu() {
      return this.$store.state.tools.show_fields;
    },
  },
  data() {
    return {
      field_n: 0,
      search: "",
    };
  },
  methods: {
    hoverCallback() {
      this.hover_fields = !this.hover_fields;
    },
    removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
    checkName(name) {
      let search = this.removeAccents(this.search).toUpperCase();
      return this.removeAccents(name.toUpperCase()).includes(search);
    },
    switchMenu() {
      this.$store.commit("tools/switchFieldsSlide", !this.showMenu);
    },
    clearSearchBar() {
      this.search = "";
    },
  },
};
</script>
