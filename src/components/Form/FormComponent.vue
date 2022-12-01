<template>
  <div
    :class="[
      $store.state.tools.current_config.obj === form
        ? 'selected-element rounded'
        : 'selected-element rounded transparent-border',
      menuState === 'config' ? 'show-config-form-component' : '',
      menuState === 'fields' ? 'show-fields-form-component' : '',
      menuState === 'both' ? 'show-both-menus-form-component' : '',
      menuState === 'hidden' ? 'hide-both-menus-form-component' : '',
    ]"
    class="custom-form-component"
    style="overflow-y: scroll; color: #424242"
  >
    <b-form-row
      v-if="$store.state.form.form.is_loaded"
      class="row justify-content-center mx-auto"
    >
      <b-col
        :xl="view === 'xl' ? 12 : view === 'md' ? 8 : 5"
        :md="view === 'xl' || view === 'md' ? 12 : 8"
        :sm="12"
        class="border rounded p-3"
        @click.self="openFormConfig(form)"
      >
        <div class="h3">
          <b-input
            v-model="form.config_values[formNameId]"
            type="text"
            placeholder="Nombre Formulario"
            v-b-tooltip.hover.bottom
            title="Cambiar nombre formulario"
            class="form-name-input"
            v-on:keyup.enter="$event.target.blur()"
            @click="openFormConfig(form)"
          />
        </div>
        <div class="m-2 y-2">
          <Rows />
        </div>
        <Actions />
      </b-col>
    </b-form-row>
    <div
      v-if="!$store.state.form.form.is_loaded"
      class="d-flex justify-content-center"
    >
      <div
        class="spinner-border d-flex justify-content-center"
        style="width: 10vh; height: 10vh; margin-top: 40vh; color: #008a94"
        role="status"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$input-border-color: transparent;
@import "bootstrap";
</style>

<script>
import Rows from "./RowsManager.vue";
import Actions from "./ActionsManager.vue";
export default {
  name: "FormComponent",
  components: {
    Rows,
    Actions,
  },
  computed: {
    form() {
      return this.$store.state.form.form;
    },
    view() {
      return this.$store.getters["tools/currentView"];
    },
    formNameId() {
      return this.$store.state.api.form_config.find(
        (config) => config.name === "Nombre"
      ).id;
    },
    isLoaded() {
      return this.$store.state.form.form.is_loaded;
    },
    menuState() {
      return this.$store.state.tools.show_config
        ? this.$store.state.tools.show_fields
          ? "both"
          : "config"
        : this.$store.state.tools.show_fields
        ? "fields"
        : "hidden";
    },
  },
  data() {
    return {
      name: "Nombre formulario",
      editingName: false,
    };
  },
  methods: {
    openFormConfig(form) {
      this.$store.dispatch("tools/openFormConfig", form);
      this.$store.commit("tools/switchConfigSlide", true);
    },
  },
  watch: {
    isLoaded() {
      this.openFormConfig(this.form);
    },
  },
};
</script>
