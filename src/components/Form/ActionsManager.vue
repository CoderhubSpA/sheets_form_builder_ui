<template>
  <div id="actions-buttons" class="row justify-content-md-center">
    <ActionComponent
      v-for="(button, index) in getAction"
      :index="index"
      :key="index"
    />
  </div>
</template>

<script>
import ActionComponent from "./ActionComponent.vue";
export default {
  name: "ActionsManager",
  components: {
    ActionComponent,
  },
  data() {
    return {
      actions: [],
    };
  },
  computed: {
    getAction() {
      return this.$store.state.form.form.actions;
    },
  },
  methods: {},
};
</script>
