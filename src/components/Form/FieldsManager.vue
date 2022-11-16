<template>
  <div class="form-group">
    <draggable
      class="card-deck"
      draggable=".field-item"
      :list="fields"
      group="Fields"
      @change="onChange"
      @dragend.native="draggingField = false"
      @dragover.prevent
      @drop="draggingField = false"
      :ghost-class="draggingField ? 'ghost' : ''"
    >
      <transition-group tag="b-row" class="sections">
        <b-col
          :cols="
            view === 'xl'
              ? getColXl(field)
                ? getColXl(field)
                : 12
              : view === 'md'
              ? getColMd(field)
                ? getColMd(field)
                : 12
              : getColSm(field)
              ? getColSm(field)
              : 12
          "
          v-for="(field, index) in sections[idxSection].fields"
          :key="index"
          :id="`section-${idxSection}-field-${index}`"
          class="field-item"
        >
          <FieldComponent
            :field="field"
            :view="view"
            :name_config_id="fieldNameConfigId"
            :description_config_id="fieldDescriptionConfigId"
            :index="index"
            :idxRow="idxRow"
            :idxSection="idxSection"
            @delete-field-event="deleteField"
            @open-field-config-event="openFieldConfig"
          />
        </b-col>
        <b-col
          v-if="draggingField"
          key="drop"
          cols="12"
          @dragover="dragoverDropZone"
          @dragleave="dragleaveDropZone"
        >
          <div
            class="p-3 my-2 border-dotted rounded text-center text-secondary"
            :class="{ 'drop-zone': overDropZone }"
          >
            Suelta el campo acá
          </div>
        </b-col>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import FieldComponent from "./FieldComponent.vue";

export default {
  name: "FieldsManager",
  components: {
    draggable,
    FieldComponent,
  },
  props: {
    name: {
      type: String,
      required: false,
    },
    idxRow: {
      type: Number,
      required: true,
    },
    idxSection: {
      type: Number,
      required: true,
    },
  },
  computed: {
    sections() {
      return this.$store.state.form.form.rows[this.idxRow].sections;
    },
    fields() {
      return this.$store.state.form.form.rows[this.idxRow].sections[
        this.idxSection
      ].fields;
    },
    view() {
      return this.$store.state.form.current_view;
    },
    fieldNameConfigId() {
      return this.$store.state.api.fields_config.find(
        (config) => config.name === "Título del campo"
      ).id;
    },
    fieldDescriptionConfigId() {
      return this.$store.state.api.fields_config.find(
        (config) => config.name === "Descripción del campo"
      ).id;
    },
    draggingField: {
      get() {
        return this.$store.state.tools.hover_fields;
      },
      set(value) {
        this.$store.commit("tools/change_hover", value);
      },
    },
  },

  data: () => ({
    overDropZone: false,
  }),
  methods: {
    getColXl(field) {
      return field.config_values[
        this.$store.state.api.fields_config.find(
          (config) => config.name === "col_xl"
        ).id
      ];
    },
    getColMd(field) {
      return field.config_values[
        this.$store.state.api.fields_config.find(
          (config) => config.name === "col_md"
        ).id
      ];
    },
    getColSm(field) {
      return field.config_values[
        this.$store.state.api.fields_config.find(
          (config) => config.name === "col_sm"
        ).id
      ];
    },
    deleteField(index) {
      if (
        this.$store.state.tools.current_config.obj?.index ===
        this.fields[index].index
      ) {
        this.$store.commit("tools/SET_CURRENT_CONFIG", {});
      }
      this.updateFields(index);
      let field_id =
        this.fields[index].config_values[
          this.$store.state.api.fields_config.find(
            (config) => config.col_name === "id"
          ).id
        ];
      if (field_id) {
        this.$store.state.form.deleted.fields.push(
          this.fields[index].local_entity_data
        );
      }
      this.fields.splice(index, 1);
    },
    updateFields(index) {
      this.$store.state.api.fields.push(this.fields[index]);
    },
    onChange(event) {
      if (event.added) {
        this.draggingField = false;
        this.overDropZone = false;
        event.added.element.idxRow = this.idxRow;
        event.added.element.idxSection = this.idxSection;
        this.openFieldConfig(event.added.element);
        for (var i = 0; i < this.$store.state.api.fields.length; i++) {
          if (this.$store.state.api.fields[i] === event.added.element) {
            this.$store.state.api.fields.splice(i, 1);
            break;
          }
        }
      }
    },
    openFieldConfig(newField) {
      this.$store.dispatch("tools/openFieldConfig", newField);
      this.$store.commit("tools/setActivatedTab", "config");
    },
    dragleave() {
      this.$store.commit("tools/change_hover", false);
    },
    dragleaveDropZone() {
      this.overDropZone = false;
    },
    dragoverDropZone() {
      this.overDropZone = true;
    },
  },
};
</script>

<style>
.btn-circle.btn-lg {
  width: 55px;
  height: 55px;
  padding: 10px 16px;
  border-radius: 35px;
  font-size: 12px;
  text-align: center;
  background: #008a94;
}

.btn-primary,
.btn-primary:hover,
.btn-primary:active,
.btn-primary:visited {
  background-color: #008a94 !important;
}

.h1-button {
  color: black;
}

.border-dotted {
  border-style: dotted;
  border-color: #bdbbbb;
}

.flex {
  display: flex;
  justify-content: space-between;
  text-align: right;
}

.close-rounded {
  width: 2rem;
  height: 2rem;
}

.ghost {
  display: none;
}
.area {
  position: relative;
}
.remove {
  display: none;
  position: absolute;
  top: -26px;
  right: -18px;
  border-radius: 10em;
  padding: 0px 8px 0px;
  text-decoration: none;
  /* font: 700 18px/16px sans-serif; */
  background: rgb(250, 10, 10);
  border: 2px solid rgb(255, 255, 255);
  color: #fff;
}

.drop-zone {
  background-color: #85dbe1;
}

.config {
  display: none;
  position: absolute;
  top: -26px;
  right: 14px;
  border-radius: 10em;
  padding: 0px 6px 0px;
  background: #079a90;
  border: 2px solid rgb(255, 255, 255);
  color: #fff;
}

.info-icon-field {
  margin-top: 0.8%;
  margin-left: 0.3%;
  color: #9e9e9e;
}
</style>
