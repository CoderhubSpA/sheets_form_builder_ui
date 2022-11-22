<template>
  <div
    :class="
      $store.state.tools.current_config.obj === form
        ? 'onclick-form rounded'
        : 'border rounded'
    "
    style="overflow-y: auto; width: 100%; color: #424242"
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
        <div class="h3 d-inline-block">{{ currentFormName }}</div>
        <div class="m-2 y-2">
          <Rows />
        </div>
        <Actions />
      </b-col>
    </b-form-row>
  </div>
</template>

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
      return this.$store.state.form.current_view;
    },
    currentFormName() {
      return this.$store.state.form.form.config_values[
        this.$store.state.api.form_config.find(
          (config) => config.name === "Nombre"
        ).id
      ];
    },
    isLoaded() {
      return this.$store.state.form.form.is_loaded;
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