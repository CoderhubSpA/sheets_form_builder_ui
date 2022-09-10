<template>
  <div class="panel accordion align-self-stretch" id="tool-box" style="position: relative">
  </div>
</template>

<script>
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
  name: 'ToolboxComponent',
  data() {
    
  }
}

</script>

<style>
#tool-box {
  max-width: 20%;
  width: 20%;
  min-width: fit-content;

  background-color: #DEE6F1;
  border-color: #008A94;
  border-width: 2px;
  border-radius: 5px;
  border-style: solid;

  margin: 10px;
  padding: 10px;
}

.button-save-form {
  --bs-btn-bg: #008A94;
  --bs-btn-border-color: #008A94;
  --bs-btn-hover-bg: #06737a;
  --bs-btn-hover-border-color: #06737a;
  --bs-btn-active-bg: #17474b;
  --bs-btn-active-border-color: #17474b;
}
</style>