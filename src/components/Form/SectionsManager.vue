<template>
  <div>
    <b-row class="d-flex justify-content-center">
      <b-row class="row-cols-1">
        <draggable
          :list="sections"
          @change="onChange"
          :animation="200"
          ghost-class="moving-section"
        >
          <transition-group name="fade" tag="b-row" class="sections">
            <b-col
              v-for="(section, index) in sections"
              :key="section.index"
              :id="`section-${section.index}`"
              :cols="
                view == 'xl'
                  ? getColXl(section)
                    ? getColXl(section)
                    : 12
                  : view == 'md'
                  ? getColMd(section)
                    ? getColMd(section)
                    : 12
                  : getColSm(section)
                  ? getColSm(section)
                  : 12
              "
              class="cursor-move my-1"
            >
              <SectionComponent
                :section="section"
                :view="view"
                :name_config_id="sectionNameConfigId"
                :index="index"
                :idxRow="idxRow"
                @delete-section-event="deleteSection"
                @open-section-config-event="openSectionConfig"
              />
            </b-col>
          </transition-group>
        </draggable>
        <!-- pa debuguear -->
        <!-- {{sections}} -->
        <div class="pt-3 border-dotted bg-light rounded">
          <!-- Hacer el for aquí para que solo se haga ciclo por la fila con el boton -->
          <div class="container text-center">
            <button
              type="button"
              class="btn-primary btn btn-circle btn-lg"
              @click="addSection"
              v-if="view == 'xl'"
            >
              <v-icon name="plus" scale="1.45" />
            </button>
            <button
              type="button"
              class="btn-primary btn btn-circle btn-md"
              @click="addSection"
              v-if="view == 'md'"
            >
              <v-icon name="plus" scale="1.25" />
            </button>
            <button
              type="button"
              class="btn-primary btn btn-circle btn-sm"
              @click="addSection"
              v-if="view == 'sm'"
            >
              <v-icon name="plus" scale="1" />
            </button>
            <p
              :class="
                view == 'xl'
                  ? 'normalText'
                  : view == 'md'
                  ? 'mediumText'
                  : 'smallText'
              "
            >
              Añadir Sección
            </p>
          </div>
        </div>
      </b-row>
    </b-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import SectionComponent from "./SectionComponent.vue";

export default {
  name: "SectionsManager",
  components: {
    draggable,
    SectionComponent,
  },
  props: {
    idRow: {
      type: String,
      required: false, //por ahora es false, cada seccion debe saber a que fila pertenece
    },
    idxRow: {
      type: Number,
      required: true, //por ahora es false, cada seccion debe saber a que fila pertenece
    },
  },
  computed: {
    sections() {
      return this.$store.state.form.form.rows[this.idxRow].sections;
    },
    view() {
      return this.$store.state.form.current_view;
    },
    sectionNameConfigId() {
      return this.$store.state.api.sections_config.find(
        (config) => config.name === "Título de la sección"
      ).id;
    },
    formatTypes() {
      return this.$store.state.tools.format_types;
    },
  },
  data: () => ({}),

  methods: {
    getColXl(section) {
      return section.config_values[
        this.$store.state.api.sections_config.find(
          (config) => config.name === "col_xl"
        ).id
      ];
    },
    getColMd(section) {
      return section.config_values[
        this.$store.state.api.sections_config.find(
          (config) => config.name === "col_md"
        ).id
      ];
    },
    getColSm(section) {
      return section.config_values[
        this.$store.state.api.sections_config.find(
          (config) => config.name === "col_sm"
        ).id
      ];
    },
    selectFormat(format, name) {
      if (name === "col_sm" || name === "col_md" || name === "col_xl") {
        return "12";
      }
      let type = this.formatTypes.find((element) => element.name === format);
      if (type) return type.value;
      console.log("No se encontró el formato" + format);
      return "";
    },
    addSection() {
      let section = this.newSection();
      section.idxRow = this.idxRow;
      this.sections.push(section);
      this.openSectionConfig(section);
    },
    newSection() {
      let config_values = {};
      this.$store.state.api.sections_config.forEach((config) => {
        config_values[config.id] = this.selectFormat(
          config.format,
          config.name
        );
      });

      return {
        index: this.sections.length,
        image: [],
        fields: [],
        idxRow: -1,
        form_id: this.$store.state.form.form.rows[this.idxRow].form_id,
        config_values: config_values, // here we store the values for the sections_config
        local_entity_data: {},
        unfilled_required_values: 0,
      };
    },
    deleteSection(idx) {
      if (
        this.$store.state.form.current_section_config?.index ==
        this.sections[idx].index
      ) {
        this.$store.state.form.current_section_config = null;
      }
      this.updateFields(idx);
      this.sections.splice(idx, 1);
      this.sections.forEach((s, sidx) => (s.index = sidx));
    },
    updateFields(index) {
      this.sections[index].fields.forEach((field) => {
        this.$store.state.api.fields.push(field);
      });
    },
    onChange(event) {
      if (event.added) {
        event.added.element.idxRow = this.idxRow;
      } else if (event.moved) {
        this.sections.forEach((s, sidx) => (s.index = sidx));
      }
    },
    openSectionConfig(section) {
      this.$store.state.form.current_config = {
        obj: section,
        title: "Configuración de la sección",
        config_type: "sections_config",
      };
      this.$store.commit("tools/setActivatedTab", "config");
    },
    setForm(section, id) {
      section.form_id = id;
    },
  },
};
</script>

<style>
.btn-circle.btn-lg {
  width: 58px;
  height: 58px;
  padding: 7px 13px;
  border-radius: 30px;
  font-size: 11px;
  text-align: center;
}

.btn-circle.btn-md {
  width: 50px;
  height: 50px;
  padding: 7px 10px;
  border-radius: 25px;
  font-size: 10px;
  text-align: center;
}

.btn-circle.btn-sm {
  width: 40px;
  height: 40px;
  padding: 6px 0px;
  border-radius: 20px;
  font-size: 8px;
  text-align: center;
}

.normalText {
  font-size: 15px;
}

.mediumText {
  font-size: 13px;
}

.smallText {
  font-size: 11px;
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

.moving-section {
  opacity: 0.5;
  background: #f7fafc;
  border: 2px solid #008a94;
  border-radius: 5px;
}
.cursor-move {
  cursor: move;
}

.close {
  cursor: pointer;
  right: 0%;
  width: 32px;
  height: 32px;
  font-size: 21px;
  font-weight: 700;
  color: #ff4949;
  border: none;
  background: none;
  opacity: 0.8;
}

.close:hover {
  color: red;
  opacity: 1;
}

.panel-resizable {
  resize: horizontal;
  max-width: 100%;
  min-width: 25%;
  overflow: hidden;
}
</style>
