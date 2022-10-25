<template>
  <div>
    <h5>{{ title }}:</h5>
    <h6>"{{ name }}"</h6>
    <div
      v-for="element in $store.state.api.sections_config.filter(
        (element) =>
          element.show_in_create_form == 2 &&
          !hidden_config.includes(element.name)
      )"
      :key="element.id"
      style="padding: 0.5em"
    >
      <label :for="'menu-' + menu_id + '-element-' + element.id">
        <div v-if="element.required_in_create_form === 1">
          {{ element.name }} <span class="text-danger">*</span>
        </div>
        <div v-else>
          {{ element.name }}
        </div>
      </label>

      <b-form-checkbox
        v-if="element.format == 'SiNo'"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      ></b-form-checkbox>

      <b-input
        v-else-if="element.col_name == 'name'"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
        type="text"
        placeholder="Nombre Sección"
      />

      <b-form-textarea
        v-else-if="element.col_name == 'description'"
        size="lg"
        v-model="current_obj.config_values[element.id]"
        :id="'menu-' + menu_id + '-element-' + element.id"
      />

      <custom-slider
        v-else-if="element.col_name == 'col_sm'"
        min="1"
        max="12"
        step="1"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      />

      <custom-slider
        v-else-if="element.col_name == 'col_md'"
        min="1"
        max="12"
        step="1"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      />

      <custom-slider
        v-else-if="element.col_name == 'col_xl'"
        min="1"
        max="12"
        step="1"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      />

      <b-form-input
        v-else-if="element.format == 'TEXT'"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      ></b-form-input>

      <b-form-input
        v-else-if="element.format == 'NUMBER'"
        type="number"
        min="0"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      ></b-form-input>

      <select
        v-else-if="element.format == 'SELECTOR'"
        class="form-select"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      >
        <option
          v-for="option in $store.state.api.sections_config_select[
            element.id
          ].options.filter((op) => op.show_in_create_form == 2)"
          :value="option"
          :key="option.id"
        >
          {{ element.col_name_fk ? option[element.col_name_fk] : option.name }}
        </option>
      </select>

      <b-form-row
        class="py-1 w-100"
        v-else-if="element.format == 'DOCUMENT[IMAGE]'"
        :id="'menu-' + menu_id + '-element-' + element.id"
      >
        <b-form-file
          v-model="current_obj.image"
          :id="'section-config-image' + element.id"
          @input="handleImage(current_obj)"
          accept="image/jpeg, image/png, image/gif"
          plain
        ></b-form-file>

        <b-modal
          class="modal-img"
          id="modal-1"
          title="BootstrapVue"
          hide-footer
          hide-header
          centered
        >
          <b-img
            :src="current_obj.image_url"
            alt="image-section"
            width="320px"
          />
        </b-modal>
        <b-button v-b-modal.modal-1 variant="primary">Ver imagen</b-button>
      </b-form-row>
      <b-list-group-item v-else>
        {{ element }}
      </b-list-group-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "SectionConfigMenu",
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    menu_id: {
      type: String,
      required: false,
    },
    current_obj: {
      type: Object,
      required: true,
    },
    hidden_config: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
};
</script>
