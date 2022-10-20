<template>
<div class="campo col-6">
  <div class="card text-center h-100">
    <div class="card-body" style="padding:0.25em 0.5em;">
      <v-icon dense name="file"></v-icon>
      <div class="card-title">{{ text }}</div>
    </div>
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
  color: #000000;

  padding: 5px 10px;
  cursor: pointer;

  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto; 
}
</style>