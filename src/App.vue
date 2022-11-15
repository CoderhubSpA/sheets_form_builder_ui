<template>
  <div>
    <NavbarComponent />
    <div
      id="app"
      style="min-height: 600px; height: 91vh"
      class="d-flex flex-row"
    >
      <SetupModalComponent />
      <FieldsMenu/>
      <!-- <ToolboxComponent /> -->
      <FormComponent/>
      <ConfigMenu/>
    </div>
  </div>
</template>

<style lang="scss">
$primary: #344a5f;
$secondary: #6b849c;
$success: #47617b;
$info: #4b85bf;
$warning: #eeee6c;
$danger: #ef5f5f;
$dark: #21394f;
$light: #eeeef5;
$body-bg: #ffffff;

@import "bootstrap";

*::-webkit-scrollbar {
  width: 1vh;
  height: 1vh;
}

*::-webkit-scrollbar-thumb {
  background-color: #03676e;
  border-radius: 20px;
}
</style>
<script>
import FormComponent from "./components/Form/FormComponent.vue";
// import ToolboxComponent from "./components/Toolbox/ToolboxComponent.vue";
import NavbarComponent from "./components/NavbarComponent.vue";
import SetupModalComponent from "./components/Setup/SetupModalComponent.vue";
import ConfigMenu from "./components/Toolbox/ConfigMenu/ConfigMenu.vue"; 
import FieldsMenu from "./components/Toolbox/FieldsMenu/FieldsMenu.vue"; 

export default {
  name: "App",
  components: {
    FormComponent,
    // ToolboxComponent,
    NavbarComponent,
    SetupModalComponent,
    ConfigMenu,
    FieldsMenu
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
  },
  methods: {},
};
</script>
