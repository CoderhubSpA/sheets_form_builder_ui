<template>
  <div
    class="flex"
    @mouseover="field.show = true"
    @mouseleave="field.show = false"
    style="
      margin-bottom: 15px;
      background-color: gainsboro;
      border-radius: 5px;
      padding: 8px;
    "
  >
    <div class="form-group col-12">
      <div v-if="field.show">
        <div class="column">
          <div class="area">
            <button
              type="button"
              class="remove"
              style="display: inline"
              v-b-modal="`modal-borrar-campo-${idxRow}-${idxSection}-${index}`"
            >
              ×
            </button>
          </div>
          <div class="area">
            <button
              type="button"
              class="config"
              style="display: inline"
              @click="$emit('open-field-config-event', field)"
            >
              <v-icon class="d-inline-block mb-1" name="cog" />
            </button>
          </div>
        </div>
      </div>
      <div style="text-align: left !important; margin-bottom: 5px">
        <b-modal
          :id="`modal-borrar-campo-${idxRow}-${idxSection}-${index}`"
          centered
          hide-header
          @ok="$emit('delete-field-event', index)"
          ok-variant="danger"
          ok-title="Sí, estoy seguro"
          cancel-title="Cancelar"
        >
          <template #default="{ close }">
            <div class="container row justify-content-end">
              <b-button class="btn btn-close" @click="close()"> </b-button>
              <h5 class="text-center">
                ¿Está seguro que desea eliminar este campo?
              </h5>
            </div>
          </template>
        </b-modal>
      </div>
      <b-input
        v-model="field.config_values[name_config_id]"
        type="text"
        class="form-control"
        placeholder="Nombre de campo"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "FieldComponent",
  props: {
    idxRow: {
      type: Number,
      required: true,
    },
    idxSection: {
      type: Number,
      required: true,
    },
    view: {
      type: String,
      required: true,
    },
    name_config_id: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    field() {
      return this.$store.state.form.form.rows[this.idxRow].sections[
        this.idxSection
      ].fields[this.index];
    },
  },
};
</script>
