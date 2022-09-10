<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// import HelloWorld from './components/HelloWorld.vue'
// import TheWelcome from './components/TheWelcome.vue'
import ToolboxComponent from './components/Toolbox/ToolboxComponent.vue'

</script>

<template>
  <div id="app" style="min-height: 600px;" class="d-flex flex-row">
    <ToolboxComponent></ToolboxComponent>
    <div style="width: 80%; margin: 10px; border-radius: 5px; border-color: darkgreen; border-width: 2px; border-style:solid;"></div>
  </div>
</template>

<style scoped>

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
