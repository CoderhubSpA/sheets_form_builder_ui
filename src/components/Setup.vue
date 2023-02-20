<template>
  <div id="app-form-builder-ui" style="min-height: 600px; height: 95vh" class="d-flex flex-row">
    <SetupModalComponent
      v-on:entity-and-mode="entityAndMode"
    />
  </div>
</template>

<script>
import SetupModalComponent from "./Setup/SetupModalComponent.vue";

export default {
  name: "Setup",
  props: {
    baseUrl: {
      type: String
    }
  },
  components: {
    SetupModalComponent,
  },
  data() {
    return {
      create: false,
    };
  },
  mounted: function () {
    this.$bvModal.show("setup-modal");
    this.$store.dispatch("api/setUrlBase", this.baseUrl);
    this.$store.dispatch("api/fetchFormConfig").then(() => {
      this.$store.dispatch("api/fetchFormList");
    });
  },
  methods: {
    entityAndMode(entityAndMode) {
      this.$emit('entity-and-mode', entityAndMode);
    }
  },
};
</script>
