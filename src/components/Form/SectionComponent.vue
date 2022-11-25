<template>
  <div
    class="rounded section-component"
    :class="
      $store.state.tools.current_config.obj === section
        ? 'selected-element rounded'
        : 'selected-element rounded transparent-border'
    "
    @click.self="$emit('open-section-config-event', section)"
  >
    <div
      class="p-3 border rounded"
      :class="
        $store.state.tools.current_config.obj === section
          ? ''
          : 'transparent-border'
      "
      @click.self="$emit('open-section-config-event', section)"
    >
      <b-form-row>
        <div class="form-group flex">
          <b-input
            v-model="section.config_values[name_config_id]"
            type="text"
            placeholder="Nombre Sección"
            v-b-tooltip.hover.bottom
            title="Cambiar nombre sección"
            style="color: #757575; font-size: 1.125rem"
          />
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
            class="info-icon-section"
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
  </div>
</template>

<style scoped lang="scss">
$input-border-color: transparent;
@import "bootstrap";
</style>

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
