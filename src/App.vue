<template>
  <div style="max-height: 100vh">
    <NavbarComponent />
    <div
      id="app"
      style="min-height: 600px; height: 95vh"
      class="d-flex flex-row"
    >
      <SetupModalComponent />
      <FieldsMenu />
      <FormComponent />
      <ConfigMenu />
    </div>
  </div>
</template>

<script>
import FormComponent from "./components/Form/FormComponent.vue";
import NavbarComponent from "./components/NavbarComponent.vue";
import SetupModalComponent from "./components/Setup/SetupModalComponent.vue";
import ConfigMenu from "./components/Toolbox/ConfigMenu/ConfigMenu.vue";
import FieldsMenu from "./components/Toolbox/FieldsMenu/FieldsMenu.vue";

export default {
  name: "App",
  components: {
    FormComponent,
    NavbarComponent,
    SetupModalComponent,
    ConfigMenu,
    FieldsMenu,
  },
  data: () => ({}),
  created: function () {},
  mounted: function () {
    this.$bvModal.show("setup-modal");
    this.$store.dispatch("api/fetchFormConfig").then(() => {
      this.$store.dispatch("api/fetchFormList");
    });

    this.$store.dispatch("api/fetchRowsConfig");
    this.$store.dispatch("api/fetchSectionConfig");
    this.$store.dispatch("api/fetchFieldsConfig");
    this.$store.dispatch("api/fetchActionsConfig");
    this.$store.dispatch("api/fetchDocumentsConfig");
  },
  methods: {},
};
</script>
