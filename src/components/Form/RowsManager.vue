<template>
  <div id="row" class="container">
    <div class="form-row">
      <div class="row row-cols-1 row-cols">
        <div class="col">
          <draggable :list="rows" :animation="200" ghost-class="moving-section">
            <transition-group>
              <div
                v-for="(row, index) in rows"
                :key="index"
                :id="`row-${index}`"
                class="cursor-move"
                @click.self="openRowConfig(row)"
              >
                <div
                  :style="
                    $store.state.form.current_config.obj === row
                      ? 'border-style: solid; border-radius: 1%; border-width: medium; border-color: #008A94;'
                      : ''
                  "
                >
                  <RowComponent
                    :view="view"
                    :name_config_id="rowNameConfigId"
                    :index="index"
                    @delete-row-event="deleteRow"
                    @open-row-config-event="openRowConfig"
                  />
                  <br />
                  <div
                    class="p-3 border-solid bg-light rounded container"
                    v-bind="row"
                  >
                    <Sections :idxRow="index" />
                    <br />
                  </div>
                </div>
                <hr />
              </div>
            </transition-group>
          </draggable>
          <div class="pt-3 border-dotted bg-light rounded">
            <div class="container text-center">
              <button
                type="button"
                class="btn btn-primary btn-circle btn-xl"
                @click="addRow"
                v-if="view == 'xl'"
              >
                <v-icon name="plus" scale="1.75" />
              </button>
              <button
                type="button"
                class="btn btn-primary btn-circle btn-lg"
                @click="addRow"
                v-if="view == 'md'"
              >
                <v-icon name="plus" scale="1.45" />
              </button>
              <button
                type="button"
                class="btn btn-primary btn-circle btn-md"
                @click="addRow"
                v-if="view == 'sm'"
              >
                <v-icon name="plus" scale="1.25" />
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
                Añadir Fila
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Sections from "./SectionsManager.vue";
import RowComponent from "./RowComponent.vue";

export default {
  name: "RowsManager",
  components: {
    Sections,
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
      return this.$store.state.form.current_view;
    },
    rowNameConfigId() {
      return this.$store.state.api.rows_config.find(
        (config) => config.name === "Nombre"
      ).id;
    },
  },
  data: () => ({}),

  created() {
    let newRow = this.newRow();
    this.rows.push(newRow);
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
        if (config.col_name === "valid") config_values[config.id] = true;
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
      this.$store.state.form.current_config = {
        obj: row,
        title: "Configuración de la fila",
        config_type: "rows_config",
        name_id: "Nombre",
      };
      this.$store.commit("tools/setActivatedTab", "config");
    },
  },
};
</script>

<style>
.btn-circle.btn-xl {
  width: 70px;
  height: 70px;
  padding: 10px 16px;
  border-radius: 35px;
  font-size: 12px;
  text-align: center;
}

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

.normalText {
  font-size: 16px;
}

.mediumText {
  font-size: 14px;
}

.smallText {
  font-size: 12px;
}

.btn-primary,
.btn-primary:hover,
.btn-primary:active,
.btn-primary:visited {
  background-color: #008a94 !important;
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

.custom-icon {
  fill: white;
}

.moving-section {
  opacity: 0.5;
  background: #f7fafc;
  border: 2px solid #008a94;
  border-radius: 5px;
}

.cursor-move:hover {
  cursor: move;
}
</style>
