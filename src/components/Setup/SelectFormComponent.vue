<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h5>O elige un formulario existente</h5>
        <b-form-select
          class="form-select"
          :select-size="15"
          :data-live-search="true"
          v-model="selectedFormId"
        >
          <option
            v-for="option in $store.state.api.form_list_options"
            :value="option.value"
            :key="'form-' + option.value"
          >
            {{ option.name }}
          </option>
        </b-form-select>
      </div>

      <br />
      <!-- <b-button variant="secondary" size="lg" @click="editForm">
        Editar formulario
      </b-button> -->
    </div>
    <div class="row edit-button">
      <b-button
        variant="secondary"
        size="lg"
        @click="editForm"
        style="color: white"
      >
        Editar formulario
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectFormComponent",
  data() {
    return {
      selectedFormId: null,
    };
  },
  methods: {
    editForm() {
      if (this.selectedFormId)
        this.$store
          .dispatch("api/fetchForm", this.selectedFormId)
          .then(this.$bvModal.hide("setup-modal"));
    },
  },
};
</script>

<style>
.edit-button {
  position: relative;
  top: 6px;
}
</style>
