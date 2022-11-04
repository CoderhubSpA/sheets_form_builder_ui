<template>
  <div>
    <b-modal
      id="setup-modal"
      title="¿Qué desea hacer?"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      :hide-header-close="true"
      :hide-footer="true"
      size="xl"
    >
      <SelectEntityComponent
        v-if="create"
        @cancel-create-form-event="create = false"
      />
      <div v-else>
        <div class="container">
          <div class="row">
            <b-button variant="primary" size="lg" @click="create = true">
              Crear un nuevo formulario
            </b-button>
          </div>
        </div>
        <br />
        <SelectFormComponent v-if="$store.state.api.form_config" />
        <p v-else>Cargando configuración</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import SelectFormComponent from "./SelectFormComponent.vue";
import SelectEntityComponent from "./SelectEntityComponent.vue";

export default {
  name: "SetupModalComponent",
  components: {
    SelectFormComponent,
    SelectEntityComponent,
  },
  data() {
    return {
      create: false,
    };
  },
  methods: {},
};
</script>
