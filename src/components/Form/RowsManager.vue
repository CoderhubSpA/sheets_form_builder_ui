<template>
  <div id="row" class="container">
    <div class="form-row">
      <div class="row row-cols-1 row-cols">
        <div class="col">
          <draggable :list="rows" :animation="200" ghost-class="moving-element">
            <transition-group>
              <div
                v-for="(row, index) in rows"
                :key="index"
                :id="`row-${index}`"
                class="cursor-move"
                @click.self="openRowConfig(row)"
              >
                <div
                  class="selected-element rounded p-1"
                  :class="
                    $store.state.tools.current_config.obj === row
                      ? ''
                      : 'transparent-border'
                  "
                >
                  <RowComponent
                    :name_config_id="rowNameConfigId"
                    :index="index"
                    @delete-row-event="deleteRow"
                  />
                </div>
                <hr />
              </div>
            </transition-group>
          </draggable>
          <div class="pt-3 border-dotted bg-light rounded">
            <div class="container text-center">
              <button
                type="button"
                @click="addRow"
                class="btn btn-primary btn-circle"
                :class="addButtonClass[view]"
              >
                <v-icon name="plus" :scale="addButtonIconScale[view]" />
              </button>
              <p :class="addButtonTextClass[view]">Añadir Fila</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import RowComponent from "./RowComponent.vue";

export default {
  name: "RowsManager",
  components: {
    draggable,
    RowComponent,
  },
  props: {
    idForm: {
      type: String,
      required: false, //por ahora es false, pero la idea es que una row sepa a que formulario pertenece
    },
  },
  computed: {
    rows() {
      return this.$store.state.form.form.rows;
    },
    view() {
      return this.$store.getters["tools/currentView"];
    },
    rowNameConfigId() {
      return this.$store.state.api?.rows_config?.find(
        (config) => config.name === "Nombre"
      )?.id;
    },
  },
  data: () => ({
    addButtonClass: {
      xl: "btn-xl",
      md: "btn-lg",
      sm: "btn-md",
    },
    addButtonIconScale: {
      xl: "1.75",
      md: "1.45",
      sm: "1.25",
    },
    addButtonTextClass: {
      xl: "row-normal-text-size",
      md: "row-medium-text-size",
      sm: "row-small-text-size",
    },
  }),

  created() {
    if (this.rows.length === 0) {
      let newRow = this.newRow();
      this.rows.push(newRow);
    }
  },

  mounted() {},

  methods: {
    addRow() {
      let newRow = this.newRow();
      this.rows.push(newRow);
      this.openRowConfig(newRow);
    },
    newRow() {
      let config_values = {};
      this.$store.state.api.rows_config.forEach((config) => {
        config_values[config.id] =
          this.$store.getters["tools/selectFormat"](config);
      });

      return {
        sections: [],
        config_values: config_values,
        form_id: "",
        index: this.rows.length,
        local_entity_data: {},
        unfilled_required_values: 0,
      };
    },
    deleteRow(idx) {
      if (
        this.$store.state.tools.current_config.obj?.index ===
        this.rows[idx].index
      )
        this.$store.commit("tools/SET_CURRENT_CONFIG", {});
      this.updateFields(idx);
      let row_id =
        this.rows[idx].config_values[
          this.$store.state.api.rows_config.find(
            (config) => config.col_name === "id"
          ).id
        ];
      if (row_id) {
        this.$store.state.form.deleted.rows.push(
          this.rows[idx].local_entity_data
        );
      }
      this.rows.splice(idx, 1);
    },
    updateFields(index) {
      this.rows[index].sections.forEach((section) => {
        section.fields.forEach((field) => {
          this.$store.state.api.fields.push(field);
        });
      });
    },
    openRowConfig(row) {
      this.$store.dispatch("tools/openRowConfig", row);
      this.$store.commit("tools/switchConfigSlide", true);
    },
  },
};
</script>
