<template>
  <div class="p-2 col-3 text-center" @click.self="openActionConfig">
    <button class="btn btn-block btn-success" disabled>{{ text }}</button>
  </div>
</template>

<script>
export default {
  name: "ActionComponent",
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    action() {
      return this.$store.state.form.form.actions[this.index];
    },
    text() {
      /*
      // Retrieve the name of the action instead of the button's name      
      this.$store.state.form.form.actions[this.index].config_values[
        this.$store.state.api.actions_config.find(
          (config) => config.col_name === "action_id"
        ).id
      ].name;
      */

      // Retrieve the configurable name of the button associated to the action.
      return this.$store.state.form.form.actions[this.index].config_values[
        this.$store.state.api.actions_config.find(
          (config) => config.col_name === "name" // "action_id" for the constant name
        ).id
      ];
    },
  },
  data() {
    return {};
  },
  methods: {
    openActionConfig() {
      this.$store.dispatch("tools/openActionConfig", this.action);
      this.$store.commit("tools/switchConfigSlide", true);
    },
  },
};
</script>
