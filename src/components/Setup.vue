<template>
  <div
    id="app"
    style="min-height: 600px; height: 95vh"
    class="d-flex flex-row"
  >
    <SetupModalComponent></SetupModalComponent>
  </div>
</template>

<script>
import SetupModalComponent from "./Setup/SetupModalComponent.vue"

export default {
  name: "Setup",
  components: {
    SetupModalComponent
  },
  data() {
    return {
      create: false,
    };
  },
  methods: {},
  mounted: function () {
    this.$bvModal.show("setup-modal");
    this.$store.dispatch("api/fetchFormConfig").then(() => {
      this.$store.dispatch("api/fetchFormList");
    });
  }
}

</script>