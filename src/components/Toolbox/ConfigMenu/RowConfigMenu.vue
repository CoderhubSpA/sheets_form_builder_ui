<template>
  <div>
    <h5>{{ title }}:</h5>
    <h6>"{{ name }}"</h6>
    <br />
    <div
      v-for="element in $store.state.api.rows_config.filter(
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

      <b-form-input
        v-else-if="element.col_name == 'name'"
        :id="'menu-' + menu_id + '-element-' + element.name"
        :placeholder="current_obj.config_values[element.id]"
        v-model="current_obj.config_values[element.id]"
        @change="updateRowName(current_obj.config_values[element.id])"
      >
      </b-form-input>

      <b-form-input
        v-else-if="element.format == 'TEXT'"
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
          v-for="option in $store.state.api.rows_config_select[element.id]
            .options"
          :value="option"
          :key="option.id"
        >
          {{ element.col_name_fk ? option[element.col_name_fk] : option.name }}
        </option>
      </select>

      <b-form-input
        v-else-if="element.format == 'NUMBER'"
        type="number"
        min="0"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="current_obj.config_values[element.id]"
      ></b-form-input>
      <b-list-group-item v-else>
        {{ element }}
      </b-list-group-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "RowConfigMenu",
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
