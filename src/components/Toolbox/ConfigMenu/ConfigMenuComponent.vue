<template>
  <div>
    <h5>{{ currentConfig.title }}:</h5>
    <h6>"{{ name }}"</h6>
    <div
      v-for="element in filterConfig"
      :key="element.id"
      style="padding: 0.5em"
    >
      <label :for="'menu-' + menu_id + '-element-' + element.id">
        <div>
          {{ element.name }}
          <span v-if="element.required_in_create_form === 1" class="text-danger"
            >*</span
          >
        </div>
      </label>

      <!--Entity Type-->

      <div v-if="element.name === 'Tipo de Entidad'">
        <select
          class="form-select"
          :id="'menu-' + menu_id + '-element-' + element.name"
          v-model="configValues[element.id]"
          disabled
          @change="showFields(configValues[element.id].id)"
        >
          <option
            v-for="option in $store.state.api[configType + '_select'][
              element.id
            ].options"
            :value="option"
            :key="option.id"
          >
            {{
              element.col_name_fk ? option[element.col_name_fk] : option.name
            }}
          </option>
        </select>
      </div>

      <!--Actions-->
      <multiselect
        v-else-if="element.name === 'Acciones'"
        :type="element.format"
        v-model="configActions"
        :options="$store.state.api[configType + '_select'][element.id].options"
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

      <!--Name-->

      <b-input
        v-else-if="element.col_name === 'name'"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="configValues[element.id]"
        type="text"
        placeholder="Ingrese el nombre"
      />

      <!--Description-->

      <b-form-textarea
        v-else-if="element.col_name === 'description'"
        v-model="configValues[element.id]"
        :id="'menu-' + menu_id + '-element-' + element.id"
      />

      <!--Customs Sliders-->

      <custom-slider
        v-else-if="element.col_name === 'col_sm'"
        v-show="view === 'sm'"
        min="1"
        max="12"
        step="1"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="configValues[element.id]"
      />

      <custom-slider
        v-else-if="element.col_name === 'col_md'"
        v-show="view === 'md'"
        min="1"
        max="12"
        step="1"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="configValues[element.id]"
      />

      <custom-slider
        v-else-if="element.col_name === 'col_xl'"
        v-show="view === 'xl'"
        min="1"
        max="12"
        step="1"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="configValues[element.id]"
      />

      <div v-else-if="element.col_name === 'format'">
        <!-- {{element.id}}<br>
        {{configValues[element.id]}} -->
        <select
          class="form-select"
          :id="'menu-' + menu_id + '-element-' + element.name"
          v-model="configValues[element.id]"
          disabled
        >
          <option
            v-for="option in $store.state.api[configType + '_select'][
              element.id
            ].options"
            :value="option"
            :key="option.id"
          >
            {{
              element.col_name_fk ? option[element.col_name_fk] : option.name
            }}
          </option>
        </select>
      </div>

      <!--Types from the api-->

      <b-form-checkbox
        v-else-if="element.format === 'SiNo'"
        :id="'menu-' + menu_id + '-element-' + element.name"
        v-model="configValues[element.id]"
      >
      </b-form-checkbox>

      <b-form-input
        v-else-if="element.format === 'TEXT'"
        :id="'menu-' + menu_id + '-element-' + element.name"
        :placeholder="'Ingresa ' + element.name"
        v-model="configValues[element.id]"
      >
      </b-form-input>

      <b-form-input
        v-else-if="element.format === 'NUMBER'"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="configValues[element.id]"
      ></b-form-input>

      <b-form-input
        v-else-if="element.format === 'URL'"
        type="url"
        :id="'menu-' + menu_id + '-element-' + element.id"
        v-model="configValues[element.id]"
      ></b-form-input>

      <div v-else-if="element.format === 'SELECTOR'">
        <select
          class="form-select"
          :id="'menu-' + menu_id + '-element-' + element.name"
          v-model="configValues[element.id]"
        >
          <option
            v-for="option in $store.state.api[configType + '_select'][
              element.id
            ].options"
            :value="option"
            :key="option.id"
          >
            {{
              element.col_name_fk ? option[element.col_name_fk] : option.name
            }}
          </option>
        </select>
      </div>

      <div v-else-if="element.format === 'SELECTOR[MULTIPLE]'">
        <multiselect
          :type="element.format"
          v-model="configValues[element.id]"
          :options="
            $store.state.api[configType + '_select'][element.id].options
          "
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

      <b-form-row
        class="py-1 w-100"
        v-else-if="element.format === 'DOCUMENT[IMAGE]'"
        :id="'menu-' + menu_id + '-element-' + element.id"
      >
        <label class="btn btn-success text-white" :for="element.id"
          >Selecciona Imagen
          <input
            class="form-control"
            type="file"
            :id="element.id"
            :ref="'input-file-' + element.id"
            @change="handleImage"
            accept="image/jpeg, image/png, image/gif"
            :key="fileInputKey"
            hidden
          />
        </label>
      </b-form-row>

      <b-list-group-item v-else>
        {{ element }}
      </b-list-group-item>
    </div>
  </div>
</template>

<script>
import multiselect from "vue-multiselect";

export default {
  name: "ConfigMenuComponent",
  components: {
    multiselect,
  },
  data() {
    return {
      fileInputKey: 0,
    };
  },
  props: {
    menu_id: {
      type: String,
      required: false,
    },
  },
  methods: {
    showFields(entity_id) {
      this.$store.dispatch("api/fetchFields", entity_id);
    },
    handleImage(event) {
      const config_image_id = event.target.id;
      this.configValues[config_image_id] = {
        id: "",
        file: event.target.files[0],
      };
      this.fileInputKey++;
    },
  },
  computed: {
    currentConfig() {
      return this.$store.state.tools.current_config;
    },
    configType() {
      return this.currentConfig.config_type;
    },
    configObject() {
      return this.currentConfig.obj;
    },
    configValues() {
      return this.configObject.config_values;
    },
    view() {
      return this.$store.getters["tools/currentView"];
    },
    hiddenConfig() {
      return this.$store.getters["tools/hiddenConfig"];
    },
    configActions: {
      get() {
        return this.configObject.config_values[
          this.$store.state.api.form_config.find(
            (config) => config.name === "Acciones"
          ).id
        ];
      },
      set(val) {
        this.configObject.config_values[
          this.$store.state.api.form_config.find(
            (config) => config.name === "Acciones"
          ).id
        ] = val;
        this.$store.dispatch("form/updateActions");
      },
    },
    configurations() {
      let on_edit =
        this.$store.state.form.form.local_entity_data?.id?.length > 0;

      return this.$store.state.api[this.configType].filter(
        (element) =>
          !this.hiddenConfig.includes(element.name) &&
          ((!on_edit && element.show_in_create_form === 2) ||
            (on_edit && element.show_in_edit_form === 2))
      );
    },
    name() {
      let name =
        this.configValues[
          this.$store.state.api[this.configType].find(
            (config) => config.name === this.currentConfig.name_id
          ).id
        ];
      return name.name ? name.name : name;
    },
    filterConfig() {
      const config = this.configurations;
      const list = [];
      const col = ["col_xl", "col_md", "col_sm"];
      config.forEach((element) => {
        if (element.name.includes(this.view) || !col.includes(element.name)) {
          list.push(element);
        }
      });
      return list;
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
