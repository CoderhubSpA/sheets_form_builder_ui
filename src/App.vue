<template>
  <div id="app" style="min-height: 600px;" class="d-flex flex-row">
    <ToolboxComponent></ToolboxComponent>
    <FormComponent/>
  </div>
</template>

<script>

// import Row from './components/Row.vue';
import FormComponent from './components/FormComponent.vue'
import ToolboxComponent from './components/Toolbox/ToolboxComponent.vue'

export default {
    name: "App",
    components: { FormComponent, ToolboxComponent }
}

</script>

