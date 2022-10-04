<template>
<div class="campo col-6">
  <div class="card">
    <div class="card-body" style="padding:0.25em 0.5em;">
      <div class="card-text">{{ text }}</div>
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
}
</style>