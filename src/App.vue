<template>
  <div>
    <NavbarComponent/>
    <div id="app" style="min-height: 600px; height: 91vh;" class="d-flex flex-row">
      <ToolboxComponent/>
      <FormComponent/>
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
  $light:#eeeef5;
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

// import Row from './components/Row.vue';
import FormComponent from './components/FormComponent.vue'
import ToolboxComponent from './components/Toolbox/ToolboxComponent.vue'
import NavbarComponent from './components/Navbar.vue';

export default {
    name: "App",
    components: { FormComponent, ToolboxComponent, NavbarComponent },
    data: () => ({
    }),
    created: function() {
      this.$store.dispatch('api/fetch_form_config');
    },
    mounted: function() {
      this.$store.dispatch('form/new_form')  // This needs the execution of fetch_form_config to be completed
      this.$store.dispatch('api/fetch_rows_config');
      this.$store.dispatch('api/fetch_section_config');
      this.$store.dispatch('api/fetch_fields_config');
    },
    methods: {
    },
}

</script>

