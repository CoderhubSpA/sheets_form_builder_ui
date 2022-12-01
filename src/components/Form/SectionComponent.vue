<template>
  <div
    class="rounded section-component selected-element mb-2"
    :class="
      $store.state.tools.current_config.obj === section
        ? ''
        : 'transparent-border'
    "
    @click.self="openSectionConfig"
  >
    <div
      class="p-2 border rounded"
      :class="
        $store.state.tools.current_config.obj === section
          ? ''
          : 'transparent-border'
      "
      @click.self="openSectionConfig"
    >
      <b-form-row>
        <div class="column">
          <div class="area">
            <button
              class="close-button-section"
              type="button"
              v-b-modal="`modal-borrar-seccion-${idxRow}-${index}`"
              @click="openSectionConfig"
              v-on:keyup.enter="$event.target.blur()"
            >
              <font-awesome-icon
                icon="fa-solid fa-xmark"
                class="xmark-delete-section"
                size="xs"
              />
            </button>
          </div>
        </div>
        <div class="form-group flex">
          <b-input
            v-model="section.config_values[name_config_id]"
            type="text"
            placeholder="Nombre Sección"
            v-b-tooltip.hover.bottom
            title="Cambiar nombre sección"
            class="section-name-input"
            v-on:keyup.enter="$event.target.blur()"
            @click="openSectionConfig"
          />
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
      <Fields
        :idxSection="index"
        :idxRow="idxRow"
        @open-section-config="openSectionConfig"
      />
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
    view() {
      return this.$store.getters["tools/currentView"];
    },
    img_url() {
      let img = this.section.config_values[this.image_config_id].file;
      return img instanceof Blob
        ? window.URL.createObjectURL(img)
        : img instanceof Array || img === null
        ? ""
        : img;
    },
  },
  methods: {
    openSectionConfig() {
      this.$store.dispatch("tools/openSectionConfig", this.section);
      this.$store.commit("tools/switchConfigSlide", true);
    },
  },
};
</script>
