<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h5>O elige un formulario existente</h5>
        <b-input
          v-model="search"
          style="margin-bottom: 5px"
          :placeholder="'Busque un formulario existente...'"
        ></b-input>
        <div class="card"
        v-if="options.length <= 0">
          <b-skeleton
          v-for="n in 15"
          class="m-1"></b-skeleton>
      </div>
        <b-form-select
          v-if="this.options.length > 0"
          class="form-select"
          :select-size="15"
          :data-live-search="true"
          v-model="selectedFormId"
        >
          <option
            v-for="option in filteredFormList"
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
      search: "",
    };
  },
  methods: {
    editForm() {
      if (this.selectedFormId)
        this.$store
          .dispatch("api/fetchForm", this.selectedFormId)
          .then(this.$bvModal.hide("setup-modal"));
    },
    removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
  },
  computed: {
    options() {
      return this.$store.state.api.form_list_options.filter(
        (option) => option.state === 1
      );
    },
    filteredFormList() {
      if (this.search) {
        let search = this.removeAccents(this.search).toUpperCase();
        return this.options.filter(
          (form) =>
            form.name &&
            (this.removeAccents(form.name.toUpperCase()).includes(search) ||
              form.value.toUpperCase() === search)
        );
      }
      return this.options;
    },
  },
};
</script>

<style>
.edit-button {
  position: relative;
  top: 6px;
}

.loader-size{
  width: auto !important;
  height: 0.9em !important;
}
</style>
