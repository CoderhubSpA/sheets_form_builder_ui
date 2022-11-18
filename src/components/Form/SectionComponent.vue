<template>
  <div
    class="p-3 rounded panel-resizable"
    :style="
      $store.state.tools.current_config.obj === section
        ? 'border-style: solid; border-radius: 5%; border-width: medium; border-color: #008A94;'
        : 'border-style: solid; border-radius: 5%;border-width: thin; border-color:#BDBBBB'
    "
    @click.self="$emit('open-section-config-event', section)"
  >
    <b-form-row>
      <div class="form-group flex">
        <b-input
          v-model="section.config_values[name_config_id]"
          type="text"
          class="border-0"
          placeholder="Nombre Sección"
          v-b-tooltip.hover.bottom
          title="Cambiar nombre sección"
          style="color: #757575; font-size: 1.125rem"
        />
        <!-- <button
          type="button"
          class="close"
          aria-label="Close"
          v-b-modal="`modal-borrar-seccion-${idxRow}-${index}`"
          @click="$emit('open-section-config-event', section)"
        >
          ×
        </button> -->
        <button
          class="close-button"
          type="button"
          v-b-modal="`modal-borrar-seccion-${idxRow}-${index}`"
          @click="$emit('open-section-config-event', section)"
        >
          <font-awesome-icon icon="fa-solid fa-xmark" class="close" />
        </button>
        <div v-if="img_url" class="px-1 mx-1">
          <img :src="img_url" alt="section image" width="50" height="50" />
        </div>
        <font-awesome-icon
          v-if="section.config_values[description_config_id]"
          v-model="section.config_values[description_config_id]"
          icon="fa-solid fa-circle-info"
          size="lg"
          class="info-icon"
          :title="section.config_values[description_config_id]"
        />

        <b-modal
          :id="`modal-borrar-seccion-${idxRow}-${index}`"
          centered
          hide-header
          @ok="$emit('delete-section-event', index)"
          ok-variant="danger"
          ok-title="Sí, estoy seguro"
          cancel-title="Cancelar"
        >
          <template #default="{ close }">
            <div class="container row justify-content-end">
              <b-button class="btn btn-close" @click="close()"> </b-button>
              <h5 class="text-center">
                ¿Está seguro que desea eliminar esta sección?
              </h5>
            </div>
          </template>
        </b-modal>
      </div>
    </b-form-row>
    <br />
    <Fields :idxSection="index" :idxRow="idxRow" />
  </div>
</template>

<script>
import Fields from "./FieldsManager.vue";

export default {
  name: "SectionComponent",
  components: {
    Fields,
  },
  props: {
    view: {
      type: String,
      required: true,
    },
    name_config_id: {
      type: String,
      required: true,
    },
    description_config_id: {
      type: String,
      required: true,
    },
    image_config_id: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    idxRow: {
      type: Number,
      required: true,
    },
  },
  computed: {
    section() {
      return this.$store.state.form.form.rows[this.idxRow].sections[this.index];
    },
    img_url() {
      console.log();
      let file =
        this.$store.state.form.form.rows[this.idxRow].sections[this.index]
          .config_values[this.image_config_id];
      return file instanceof Blob ? window.URL.createObjectURL(file) : "";
    },
  },
};
</script>

<style>
.border-0 {
  background: transparent !important;
}
.border-0:hover {
  border: solid !important;
  border-width: 0.1px !important;
}
</style>
