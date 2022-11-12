<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h5>Primero elige una entidad: {{ entitySelected.name }}</h5>
        <b-form-select
          class="form-select"
          :select-size="15"
          :data-live-search="true"
          v-model="entitySelected"
        >
          <option
            v-for="option in entityOptions"
            :value="option"
            :key="option.id"
          >
            {{ option.name }}
          </option>
        </b-form-select>
      </div>
    </div>
    <div class="row pt-2">
      <div class="col-6">
        <b-button
          variant="danger"
          size="lg"
          @click="$emit('cancel-create-form-event')"
        >
          Atrás
        </b-button>
      </div>
      <div class="col-6 d-flex justify-content-end">
        <b-button variant="primary" size="lg" @click="createForm">
          Crear formulario
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectEntityComponent",
  data() {
    return {
      entitySelected: [],
    };
  },
  computed: {
    entityConfigId() {
      return this.$store.state.api.form_config.find(
        (config) => config.col_name === "entity_type_id"
      ).id;
    },
    entityOptions() {
      return this.$store.state.api.form_config_select[this.entityConfigId]
        .options;
    },
  },
  methods: {
    createForm() {
      if (this.entitySelected)
        this.$store.dispatch("form/newForm").then(() => {
          this.$store.state.form.form.config_values[this.entityConfigId] =
            this.entitySelected;

          this.$store.dispatch("api/fetchFields", this.entitySelected.id);
          this.$bvModal.hide("setup-modal");
        });
    },
  },
};
</script>
