<template>
  <div id="sidebarfields" :class="showMenu ? 'show-menu':'hide-menu'" class="flex-shrink-0 custom-side-menu bg-light">


      <b-row class="m-0">
        <b-col class="p-2">
          <v-icon @click="switchMenu" class="float-end" role="button" :name="showMenu? 'angle-left': 'angle-right'" scale="1.5"  />
        </b-col>
      </b-row>
      <b-row class="m-0 p-0 py-3" :class="showMenu? 'd-none':'d-block'" style="color:#008a94;writing-mode: vertical-rl; font-size: 16pt;">
            Campos
      </b-row> 
      <b-row class="mx-2" :class="showMenu? 'd-block':'d-none'">
        <b-input
          v-model="search"
          id="section-config-name"
          type="text"
          placeholder="Busca un campo aquí..."
        />
        <draggable
          @dragstart.native="hover_fields = true"
          @dragend.native="hover_fields = false"
          class="card-deck row"
          style="display: flex; margin: 5px 0 5px 0"
          :group="{ name: 'Fields', pull: true, put: true }"
          :list="fields"
        >
          <FieldMenuComponent
            v-for="element in fields"
            :key="element.name"
            :text="element.name"
            :format="element.format"
          />
        </draggable>
      </b-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import FieldMenuComponent from "./FieldMenuComponent.vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default {
  name: "FieldsMenu",
  components: {
    FieldMenuComponent,
    draggable,
  },

  props: {
    menu_name: {
      type: String,
      required: false,
    },
    menu_id: {
      type: String,
      required: false,
    },
    draggable_elements: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hover_fields: {
      get() {
        return this.$store.state.tools.hover_fields;
      },
      set(value) {
        this.$store.commit("tools/change_hover", value);
      },
    },
    fields() {
      return this.$store.state.api.fields.filter(
        (field) => field.show_in_create_form == 2 && this.checkName(field.name)
      );
    },
    formatTypes() {
      return this.$store.state.tools.format_types;
    },
  },
  data() {
    return {
      field_n: 0,
      search: "",
      showMenu:false,
    };
  },
  methods: {
    hoverCallback() {
      this.hover_fields = !this.hover_fields;
    },
    removeAccents(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },
    checkName(name) {
      let search = this.removeAccents(this.search).toUpperCase();
      return this.removeAccents(name.toUpperCase()).includes(search);
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
    switchMenu(){
      this.showMenu = !this.showMenu;
    },

  },
};
</script>

<style scoped>
.btn-toggle {
  width: 100%;
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
  background-color: transparent;
  border: 0;
}
.btn-toggle:hover,
.btn-toggle:focus {
  color: rgba(0, 0, 0, 0.85);
}

.btn-toggle::before {
  width: 1.25em;
  line-height: 0;
  content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
  transition: transform 0.35s ease;
  transform-origin: 0.5em 50%;
}

.btn-toggle[aria-expanded="true"] {
  color: rgba(0, 0, 0, 0.85);
}
.btn-toggle[aria-expanded="true"]::before {
  transform: rotate(90deg);
}

.menu-button {
  font-size: 20pt !important;
}
.drop-zone {
  background-color: #eee;
  margin-bottom: 10px;
  padding: 10px;
}
.drag-el {
  background-color: #fff;
  margin-bottom: 10px;

  padding: 5px;
}

.custom-side-menu{
  /* width: 3%;
  max-width: 20%;
  height: 100%;
  max-height: 100%; */
  overflow-y: auto;
  transition:width 0.3s ease;
}
.show-menu{
  width: 20%;
  max-width: 25%;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  transition:width .3s ease;
}
.hide-menu{
  width: 3%;
  max-width: 25%;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

</style>
