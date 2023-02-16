<template>
  <div>
    <b-modal
      id="setup-modal"
      title="¿Qué desea hacer?"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      :hide-header-close="true"
      :hide-footer="true"
      size="lg"
    >
      <SelectEntityComponent
        v-if="create"
        @cancel-create-form-event="create = false"
        v-on:entity-and-mode="entityAndMode"
      />
      <div v-else>
        <div class="container">
          <div class="row">
            <b-button
              class="create-form-button"
              variant="primary"
              size="lg"
              @click="create = true"
            >
              Crear un nuevo formulario
            </b-button>
          </div>
        </div>
        <br />
        <SelectFormComponent
          v-if="$store.state.api.form_config"
          v-on:entity-and-mode="entityAndMode"
        />
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
  methods: {
    entityAndMode(entityAndMode) {
      this.$emit('entity-and-mode', entityAndMode);
    }
  },
};
</script>
