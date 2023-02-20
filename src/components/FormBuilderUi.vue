<template>
  <div style="max-height: 100vh" v-if="ready">
    <NavbarComponent @saveForm="save" v-on:go-setup-page="goSetupPage"/>
    <div
      id="form-builder-ui-wrapper"
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
  name: "FormBuilderUi",
  props: {
    baseUrl: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
  },
  components: {
    FormComponent,
    NavbarComponent,
    ConfigMenu,
    FieldsMenu,
  },
  data: () => ({
    entitySelected: [],
    ready: false,
    editMode: false
  }),
  created: function () {},
  mounted: async function () {
    this.editMode = this.mode === "edit";

    this.$store.dispatch("api/setUrlBase", this.baseUrl);

    const previewUrl = `${window.location.origin}/internal_form/`

    this.$store.dispatch("api/setPreviewUrl", previewUrl);

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
    await this.$store.dispatch("api/fetchDocumentsConfig");
    await this.$store.dispatch("api/fetchActionsConfig");

    if (this.editMode) {
      await this.editForm();
    } else {
      await this.createForm();
    }
    if (this.editMode) {
      this.$store.state.api.status.form_url = this.$store.state.api.url.preview_base + this.id;
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
      }
    },
    goSetupPage() {
      this.$emit('go-setup-page');
    }
  },
};
</script>
<style lang="sass" scoped>
  @import 'bootstrap/scss/bootstrap.scss'
  @import "vue-custom-range-slider/dist/vue-custom-range-slider.css"
  @import '../assets/base.scss'
  @import '../assets/main.scss'
  @import '../assets/multiselect.scss'
  @import 'bootstrap-vue/dist/bootstrap-vue.css'
</style>
