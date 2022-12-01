<template>
  <div
    class="flex field-component"
    @mouseover="field.show = true"
    @mouseleave="field.show = false"
    :class="
      $store.state.tools.current_config.obj === field ? 'selected-field' : ''
    "
    @click="openFieldConfig"
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
              <font-awesome-icon
                icon="fa-solid fa-circle-xmark"
                class="close"
                size="lg"
              />
              <!-- <font-awesome-icon icon="fa-solid fa-xmark" size="xs" /> -->
            </button>
          </div>
        </div>
      </div>
      <div class="text-left" style="margin-bottom: 5px">
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
      <div class="form-group flex">
        <b-input
          v-model="field.config_values[name_config_id]"
          type="text"
          v-b-tooltip.hover.bottom
          title="Cambiar nombre campo"
          class="field-name-input"
          :placeholder="field.name"
          v-on:keyup.enter="$event.target.blur()"
        />

        <div class="required" v-if="field.config_values[required_config_id]">
          *
        </div>

        <font-awesome-icon
          v-if="field.config_values[description_config_id]"
          v-model="field.config_values[description_config_id]"
          icon="fa-solid fa-circle-info"
          size="lg"
          class="info-icon-field"
          :title="field.config_values[description_config_id]"
        />

        <a
          v-if="
            field.config_values[url_info_config_id] &&
            field.config_values[text_info_config_id]
          "
          :href="field.config_values[url_info_config_id]"
          target="_blank"
          class="url-style"
        >
          {{ field.config_values[text_info_config_id] }}
        </a>
      </div>

      <input v-if="!(typesInput.includes('selector') || typesInput == 'checkbox')"
        class="form-control inputs-fields"
        :type="typesInput"
      />

      <input v-else-if="typesInput === 'checkbox'"
        class="inputs-fields"
        :type="typesInput"
      />

      <select v-else-if="typesInput.includes('selector')"
        class="form-select inputs-fields"
      >
        <option></option>
      </select>

    </div>
  </div>
</template>

<style scoped lang="scss">
$input-border-color: transparent;
@import "bootstrap";
</style>

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
    name_config_id: {
      type: String,
      required: true,
    },
    description_config_id: {
      type: String,
      required: true,
    },
    text_info_config_id: {
      type: String,
      required: true,
    },
    url_info_config_id: {
      type: String,
      required: true,
    },
    format_config_id: {
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
    required_config_id() {
      return this.$store.state.api.fields_config.find(
        (config) => config.col_name === "required"
      ).id;
    },
    typesInput() {
      const fieldFormat = this.field.config_values[this.format_config_id]['id'];
      var c = this.$store.getters["tools/selectInputType"](fieldFormat);
      return c;
    },
  },
  methods: {
    openFieldConfig() {
      this.$store.dispatch("tools/openFieldConfig", this.field);
      this.$store.commit("tools/switchConfigSlide", true);
    },
  },
};
</script>
