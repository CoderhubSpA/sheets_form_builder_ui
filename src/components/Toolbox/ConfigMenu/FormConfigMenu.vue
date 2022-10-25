<template>
  <div>
    <h5>{{ title }}:</h5>
    <h6>"{{ name }}"</h6>
    <div
      v-for="element in $store.state.api.form_config.filter(
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
      <!-- v-if else depending on element.format -->
      <b-form-checkbox
        v-if="element.format == 'SiNo'"
        :id="'menu-' + menu_id + '-element-' + element.name"
        v-model="$store.state.form.form.config_values[element.id]"
      >
      </b-form-checkbox>

      <b-form-input
        v-else-if="element.format == 'TEXT'"
        :id="'menu-' + menu_id + '-element-' + element.name"
        :placeholder="'Ingresa ' + element.name"
        v-model="$store.state.form.form.config_values[element.id]"
      >
      </b-form-input>

      <div v-else-if="element.name == 'Tipo de Entidad'">
        <select
          class="form-select"
          :id="'menu-' + menu_id + '-element-' + element.name"
          v-model="$store.state.form.form.config_values[element.id]"
          @change="
            showFields($store.state.form.form.config_values[element.id].id)
          "
        >
          <option
            v-for="option in $store.state.api.form_config_select[element.id]
              .options"
            :value="option"
            :key="option.id"
          >
            {{
              element.col_name_fk ? option[element.col_name_fk] : option.name
            }}
          </option>
        </select>
      </div>

      <div v-else-if="element.format == 'SELECTOR'">
        <select
          class="form-select"
          :id="'menu-' + menu_id + '-element-' + element.name"
          v-model="$store.state.form.form.config_values[element.id]"
        >
          <option
            v-for="option in $store.state.api.form_config_select[element.id]
              .options"
            :value="option"
            :key="option.id"
          >
            {{
              element.col_name_fk ? option[element.col_name_fk] : option.name
            }}
          </option>
        </select>
      </div>
      <div v-else-if="element.format == 'SELECTOR[MULTIPLE]'">
        <multiselect
          :type="element.format"
          v-model="$store.state.form.form.config_values[element.id]"
          :options="$store.state.api.form_config_select[element.id].options"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          :preserve-search="true"
          :placeholder="'Elige ' + element.name"
          label="name"
          track-by="id"
          :select-label="''"
          :selected-label="''"
          :deselect-label="''"
        >
        </multiselect>
      </div>

      <b-form-input
        v-else-if="element.format == 'NUMBER'"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="currentForm.config_values[element.id]"
      ></b-form-input>
      <b-list-group-item v-else>
        {{ element }}
      </b-list-group-item>
    </div>
  </div>
</template>

<script>
import multiselect from "vue-multiselect";

export default {
  name: "FormConfigMenu",
  components: {
    multiselect,
  },
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
  methods: {
    showFields(entity_id) {
      this.$store.dispatch("api/fetchFields", entity_id);
    },
  },
};
</script>
