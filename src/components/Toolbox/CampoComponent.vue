<template>
<div class="card campo" style="display:inline-flex">
  <div class="card-body" style="padding:0.25em 0.5em;">
    <div class="card-text">{{ text }}</div>
  </div>
</div>
</template>

<script>

export default {
  name: 'CampoComponent',
  props: {
    text: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
    }
  },
}
</script>

<style>
.campo {
  background-color: #008A94;
  color: #000000;
  border-radius: 13px;

  margin: 5px 10px;
  cursor: pointer;
}
</style>