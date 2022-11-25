<template>
  <div>
    <b-row class="d-flex justify-content-center">
      <b-row class="row-cols-1">
        <draggable
          :list="sections"
          @change="onChange"
          :animation="200"
          ghost-class="moving-element"
        >
          <transition-group name="fade" tag="b-row" class="sections">
            <b-col
              v-for="(section, index) in sections"
              :key="section.index"
              :id="`section-${section.index}`"
              :cols="
                view === 'xl'
                  ? getColXl(section)
                    ? getColXl(section)
                    : 12
                  : view === 'md'
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
                :name_config_id="sectionNameConfigId"
                :description_config_id="sectionDescriptionConfigId"
                :image_config_id="sectionImageConfigId"
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
              class="btn-primary btn btn-circle"
              :class="addButtonClass[view]"
              @click="addSection"
            >
              <v-icon name="plus" :scale="addButtonIconScale[view]" />
            </button>
            <p :class="addButtonTextClass[view]">Añadir Sección</p>
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
      return this.$store.getters["tools/currentView"];
    },
    sectionNameConfigId() {
      return this.$store.state.api.sections_config.find(
        (config) => config.name === "Título de la sección"
      ).id;
    },
    sectionDescriptionConfigId() {
      return this.$store.state.api.sections_config.find(
        (config) => config.name === "Descripción de la sección"
      ).id;
    },
    sectionImageConfigId() {
      return this.$store.state.api.sections_config.find(
        (config) => config.name === "Imagen de la sección"
      ).id;
    },
  },
  data: () => ({
    addButtonClass: {
      xl: "btn-lg",
      md: "btn-md",
      sm: "btn-sm",
    },
    addButtonIconScale: {
      xl: "1.45",
      md: "1.25",
      sm: "1",
    },
    addButtonTextClass: {
      xl: "normalText",
      md: "mediumText",
      sm: "smallText",
    },
  }),

  created() {
    if (this.sections.length === 0) {
      let section = this.newSection();
      section.idxRow = this.idxRow;
      this.sections.push(section);
    }
  },

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
    addSection() {
      let section = this.newSection();
      section.idxRow = this.idxRow;
      this.sections.push(section);
      this.openSectionConfig(section);
    },
    newSection() {
      let config_values = {};
      this.$store.state.api.sections_config.forEach((config) => {
        config_values[config.id] =
          this.$store.getters["tools/selectFormat"](config);
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
        this.$store.state.tools.current_config.obj?.index ===
        this.sections[idx].index
      )
        this.$store.commit("tools/SET_CURRENT_CONFIG", {});

      this.updateFields(idx);
      let section_id =
        this.sections[idx].config_values[
          this.$store.state.api.sections_config.find(
            (config) => config.col_name === "id"
          ).id
        ];
      if (section_id) {
        this.$store.state.form.deleted.sections.push(
          this.sections[idx].local_entity_data
        );
      }
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
      this.$store.dispatch("tools/openSectionConfig", section);
      this.$store.commit("tools/switchConfigSlide", true);
    },
    setForm(section, id) {
      section.form_id = id;
    },
  },
};
</script>
