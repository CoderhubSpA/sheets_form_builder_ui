<template>
  <div class="container-fluid">
    <NavbarComponent/>
    <div id="app" style="min-height: 600px; height: 90vh;" class="d-flex flex-row">
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
        // the form HAS TO BE SET, or the amount of cols and configs will be too much.
        // We'll have to figure it out later a way to create a form, but we need a form already created with an entity 
        //this.$store.state.api.form_id = this.form_id;
        
        this.$store.dispatch('api/api_config');
        this.$store.dispatch('api/fetch_fields');
    },
    methods: {
    },
}

</script>

