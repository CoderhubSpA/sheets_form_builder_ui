<template>
  <div>
    <NavbarComponent/>
    <div id="app" style="min-height: 600px; height: 89vh; margin-top: 1vh;" class="d-flex flex-row container-fluid">
      <ToolboxComponent></ToolboxComponent>
      <FormComponent/>
    </div>
  </div>
</template>

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
    mounted: function() {
      this.$store.dispatch('api/api_config');
      this.$store.dispatch('api/fetch_rows_config');
      this.$store.dispatch('api/fetch_section_config');
      this.$store.dispatch('api/fetch_fields_config');
    },
    methods: {
    },
}

</script>

