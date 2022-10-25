<template>
  <div>
    <h5>{{ title }}:</h5>
    <h6>"{{ name }}"</h6>
    <div
      v-for="element in $store.state.api.fields_config.filter(
        (element) =>
          element.show_in_create_form == 2 &&
          !hidden_config.includes(element.name)
      )"
      :key="element.id"
      style="padding: 0.5em"
    >
      <label
        :for="
          'menu-' +
          menu_id +
          '-field-' +
          current_obj.id +
          '-element-' +
          element.id
        "
      >
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
      >
      </b-form-checkbox>

      <select
        v-else-if="element.col_name == 'form_id'"
        class="form-select"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      >
        <option
          v-for="option in $store.state.api.fields_config_select[element.id]
            .options"
          :value="option"
          :key="option.id"
        >
          {{ element.col_name_fk ? option[element.col_name_fk] : option.name }}
        </option>
      </select>

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

      <textarea
        v-else-if="element.col_name == 'description'"
        :id="'menu-' + menu_id + '-element-' + element.id"
        class="col-12"
        placeholder="Ingrese descripción del campo"
        v-model="current_obj.config_values[element.id]"
      ></textarea>

      <b-form-input
        v-else-if="element.format == 'TEXT'"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
        :placeholder="'Ingresa ' + element.name"
      >
      </b-form-input>

      <b-form-input
        v-else-if="element.format == 'NUMBER'"
        type="number"
        min="0"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      ></b-form-input>

      <b-form-input
        v-else-if="element.format == 'URL'"
        type="url"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      ></b-form-input>

      <div
        v-else-if="element.name == 'Columna'"
        :id="'menu-' + menu_id + '-element-' + element.id"
      >
        {{ current_obj.config_values[element.id].name }}
      </div>

      <select
        v-else-if="element.format == 'SELECTOR'"
        class="form-select"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      >
        <option
          v-for="option in $store.state.api.fields_config_select[element.id]
            .options"
          :value="option"
          :key="'option-' + option.id"
        >
          {{ element.col_name_fk ? option[element.col_name_fk] : option.name }}
        </option>
      </select>

      <b-list-group-item v-else>
        {{ element }}
      </b-list-group-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "FieldConfigMenu",
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
