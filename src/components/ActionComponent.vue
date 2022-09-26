<template>
  <div class="p-2 flex-fill center">
    <button class="btn btn-block btn-success" disabled>{{text}}</button>
  </div>
    
</template>
    
<script>
    export default {
      name: 'ActionComponent',
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
  .center{
    text-align: center;
  }
</style>