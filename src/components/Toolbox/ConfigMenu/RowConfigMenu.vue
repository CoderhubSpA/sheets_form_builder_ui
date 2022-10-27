<template>
  <div>
    <h5>{{ currentConfig.title }}:</h5>
    <h6>"{{ name }}"</h6>
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
        v-model="configValues[element.id]"
      ></b-form-checkbox>

      <b-form-input
        v-else-if="element.col_name == 'name'"
        :id="'menu-' + menu_id + '-element-' + element.name"
        :placeholder="configValues[element.id]"
        v-model="configValues[element.id]"
      >
      </b-form-input>

      <b-form-input
        v-else-if="element.format == 'TEXT'"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="configValues[element.id]"
      ></b-form-input>

      <select
        v-else-if="element.format == 'SELECTOR'"
        class="form-select"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="configValues[element.id]"
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
        v-model="configValues[element.id]"
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
    menu_id: {
      type: String,
      required: false,
    },
    hidden_config: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  computed: {
    currentConfig() {
      return this.$store.state.form.current_config;
    },
    configValues() {
      return this.currentConfig.obj.config_values;
    },
    name() {
      return this.configValues[
        this.$store.state.api[this.currentConfig.config_type].find(
          (config) => config.name === "Nombre"
        ).id
      ];
    },
  },
};
</script>
