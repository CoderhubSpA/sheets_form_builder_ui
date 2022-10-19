<template>
  <div>
    <NavbarComponent/>
    <div id="app" style="min-height: 600px; height: 91vh;" class="d-flex flex-row">
      <ToolboxComponent></ToolboxComponent>
      <FormComponent/>
    </div>
  </div>
</template>

<style lang="scss">
  $primary: #00bac7;
  $secondary: #008a94;
  $success: #13b2be;
  $info: #00d1e1;
  $warning: #f9f962;
  $danger: #fd4040;
  $dark: #03676e;
  $light: #e1f3f3;
  $body-bg: #ffffff;
  
  @import "bootstrap";

*::-webkit-scrollbar {
  width: 1vh;
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
      this.$store.dispatch('api/fetch_form_config').then(this.$store.dispatch('form/new_form'));
    },
    mounted: function() {
      this.$store.dispatch('api/fetch_rows_config');
      this.$store.dispatch('api/fetch_section_config');
      this.$store.dispatch('api/fetch_fields_config');
    },
    methods: {
    },
}

</script>

