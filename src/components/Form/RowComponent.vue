<template>
  <div @click.self="openRowConfig(row)">
    <div
      :class="
        view == 'xl'
          ? 'form-group col-md-4 flex'
          : view == 'md'
          ? 'form-group col-md-6 flex'
          : 'form-group col-md-8 flex'
      "
    >
      <b-input
        v-model="row.config_values[name_config_id]"
        type="text"
        class="form-control"
        placeholder="Nombre Fila"
      />
      <button
        type="button"
        class="btn btn-danger btn-sm delete"
        v-b-modal="`modal-borrar-fila-${index}`"
      >
        <v-icon class="custom-icon" name="trash"></v-icon>
      </button>
      <b-modal
        :id="`modal-borrar-fila-${index}`"
        centered
        hide-header
        @ok="$emit('delete-row-event', index)"
        ok-variant="danger"
        ok-title="Sí, estoy seguro"
        cancel-title="Cancelar"
      >
        <template #default="{ close }">
          <div class="container row justify-content-end">
            <b-button class="btn btn-close" @click="close()"> </b-button>
            <h5 class="text-center">
              ¿Está seguro que desea eliminar esta fila?
            </h5>
          </div>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  name: "RowComponent",
  props: {
    row: {
      type: Object,
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
  methods: {
    openRowConfig(row) {
      this.$store.state.form.current_form_config = null;
      this.$store.state.form.current_row_config = row;
      this.$store.state.form.current_field_config = null;
      this.$store.state.form.current_section_config = null;
      this.$store.commit('tools/setActivatedTab', 'config');
    },
  },
};
</script>
