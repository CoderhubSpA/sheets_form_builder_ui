<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <h5>O elige un formulario existente</h5>
        <div class="form-group flex" style="margin-bottom: 5px">
          <b-input
            v-model="search"
            id="section-config-name"
            type="text"
            placeholder="Busque un formulario existente..."
          />
          <button type="button" class="close-button" @click="clearSearchBar">
            <font-awesome-icon icon="fa-solid fa-xmark" class="delete-search" />
          </button>
        </div>
        <div class="card" v-if="options.length <= 0">
          <b-skeleton v-for="n in 15" :key="n" class="m-1"></b-skeleton>
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
    </div>
    <div class="row select-form-edit-button">
      <b-button
        variant="secondary"
        size="lg"
        @click="entityAndMode"
        style="color: white"
        :disabled="!selectedFormId"
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
  methods: {
    editForm() {
      if (this.selectedFormId) {
        this.$store
          .dispatch("api/fetchForm", this.selectedFormId)
          .then(this.$bvModal.hide("setup-modal"));
      }
    },
    removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
    clearSearchBar() {
      this.search = "";
    },
    entityAndMode() {
      this.$emit("entity-and-mode", {
        formId: this.selectedFormId,
        mode: "edit"
      })
    }
  }
};
</script>
