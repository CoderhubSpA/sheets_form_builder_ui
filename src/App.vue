<template>
  <div class="container-fluid">
    <NavbarComponent/>
    <div id="app" style="min-height: 600px; height: 100vh;" class="d-flex flex-row">
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
    components: { FormComponent, ToolboxComponent, NavbarComponent }
}

</script>

