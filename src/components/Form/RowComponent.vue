<template>
  <div @click.self="openRowConfig">
    <div class="form-group flex" :class="colClass[view]">
      <b-input
        v-model="row.config_values[name_config_id]"
        type="text"
        placeholder="Nombre Fila"
        v-b-tooltip.hover.bottom
        title="Cambiar nombre fila"
        style="color: #007672; font-size: 1.2rem"
        v-on:keyup.enter="$event.target.blur()"
      />
      <button
        type="button"
        class="close-button"
        v-b-modal="`modal-borrar-fila-${index}`"
        @click="$emit('open-row-config-event', row)"
      >
        <font-awesome-icon
          icon="fa-solid fa-circle-xmark"
          class="close"
          size="xl"
        />
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
    <br />
    <div
      class="p-3 border-solid bg-white container shadow-section"
      v-bind="row"
      @click.self="openRowConfig"
    >
      <SectionsManager @open-row-config="openRowConfig" :idxRow="index" />
      <br />
    </div>
  </div>
</template>

<style scoped lang="scss">
$input-border-color: transparent;
@import "bootstrap";
</style>

<script>
import SectionsManager from "./SectionsManager.vue";

export default {
  name: "RowComponent",
  components: {
    SectionsManager,
  },
  props: {
    name_config_id: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    colClass: {
      xl: "col-md-4",
      md: "col-md-6",
      sm: "col-md-8",
    },
  }),
  computed: {
    row() {
      return this.$store.state.form.form.rows[this.index];
    },
    view() {
      return this.$store.getters["tools/currentView"];
    },
  },
  methods: {
    openRowConfig() {
      this.$store.dispatch("tools/openRowConfig", this.row);
      this.$store.commit("tools/switchConfigSlide", true);
    },
  },
};
</script>
