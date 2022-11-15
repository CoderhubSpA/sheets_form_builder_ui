<template>
  <div
    :class="
      $store.state.form.current_config.obj === form
        ? 'onclick-form rounded'
        : 'border rounded'
    "
    style="overflow-y: auto; width: 100%"
  >
    <b-form-row  v-if="$store.state.form.form.is_loaded" class="row justify-content-center mx-auto">
      <b-col
        :xl="view == 'xl' ? 12 : view == 'md' ? 8 : 5"
        :md="view == 'xl' || view == 'md' ? 12 : 8"
        :sm="12"
        class="border rounded p-3"
        @click.self="openFormConfig(form)"
      >
        <!--<b-input v-model="currentFormName" v-if="editingName" class="text-left w-50 d-inline-block"
                    @keyup.enter="editingName = false"/>-->
        <div class="h4 d-inline-block">{{ currentFormName }}</div>
        <!--<v-icon class="d-inline-block ml-2 mb-1"
                    :name="editingName? 'check': 'pencil-alt'"
                    @click="editingName=!editingName"
                    style="cursor: pointer"   
                />-->
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
      this.$store.state.form.current_config = {
        obj: form,
        title: "Configuración del formulario",
        config_type: "form_config",
        name_id: "Nombre",
      };
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

<style>
.onclick-form {
  border-style: solid;
  border-width: medium;
  border-color: #008a94;
}
</style>
