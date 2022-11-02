<template>
  <div id="actions-buttons" class="row justify-content-md-center">
    <ActionComponent
      v-for="(button, index) in getAction"
      :index="index"
      :key="index"
      @open-action-config-event="openActionConfig"
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
  methods: {
    openActionConfig(action) {
      this.$store.state.form.current_config = {
        obj: action,
        title: "Configuración de la acción",
        config_type: "actions_config",
        name_id: "Acción",
      };
    },
  },
};
</script>

<style>
.justify {
  justify-content: space-between;
}
</style>
