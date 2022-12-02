<template>
  <div style="max-height: 100vh" v-if="ready">
    <NavbarComponent @saveForm="save"/>
    <div
      id="app"
      style="min-height: 600px; height: 95vh"
      class="d-flex flex-row"
    >
      <FieldsMenu />
      <FormComponent />
      <ConfigMenu />
    </div>
  </div>
</template>

<script>
import FormComponent from "./Form/FormComponent.vue";
import NavbarComponent from "./NavbarComponent.vue";
import ConfigMenu from "./Toolbox/ConfigMenu/ConfigMenu.vue";
import FieldsMenu from "./Toolbox/FieldsMenu/FieldsMenu.vue";

export default {
  name: "FormBuilder",
  components: {
    FormComponent,
    NavbarComponent,
    ConfigMenu,
    FieldsMenu,
  },
  data: () => ({
    entitySelected: [],
    id: "",
    ready: false,
    editMode: false
  }),
  created: function () {},
  mounted: async function () {
    this.id = this.$route.params.id;
    this.editMode = this.mode === "edit";

    if (!this.entityOptions) {
      await this.$store.dispatch("api/fetchFormConfig");
      await this.$store.dispatch("api/fetchFormList");
    }

    this.entitySelected = this.entityOptions.find(
      (option) => option.id === this.id
    );

    await this.$store.dispatch("api/fetchRowsConfig");
    await this.$store.dispatch("api/fetchSectionConfig");
    await this.$store.dispatch("api/fetchFieldsConfig");
    await this.$store.dispatch("api/fetchDocuments");
    await this.$store.dispatch("api/fetchActionsConfig");

    if (this.editMode) {
      await this.editForm();
    } else {
      await this.createForm();
    }

    this.ready = true;
  },
  computed: {
    entityConfigId() {
      return this.$store.state.api.form_config.find(
        (config) => config.col_name === "entity_type_id"
      )?.id;
    },
    entityOptions() {
      return this.$store.state.api.form_config_select[this.entityConfigId]
        ?.options;
    },
  },
  methods: {
    openFormConfig() {
      this.$store.dispatch("tools/openFormConfig", this.$store.state.form.form);
      this.$store.commit("tools/switchConfigSlide", true);
    },
    createForm() {
      this.$store
        .dispatch("form/newForm")
        .then(() => {
          this.$store.state.form.form.config_values[this.entityConfigId] =
            this.entitySelected;
          this.$store.dispatch("api/fetchFields", this.id);
        })
        .then(this.openFormConfig());
    },
    editForm() {
      if (this.id) {
        this.$store.dispatch("api/fetchForm", this.id);
      }
    },
    // esto se puede borrar si el modal funciona
    async save() {
      await this.$store.dispatch('api/postForm');
      if (!this.editMode) {
        this.editMode = true;
        this.id = this.$store.state.form.form.local_entity_data["id"];
        this.$router.push({ name: "edit", params: { id: this.id } });
      }
    }
  },
  props: {
    mode: {
      type: String,
      required: true,
    },
  },
};
</script>
