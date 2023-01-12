<template>
  <div>
    <Setup
      v-if="!id"
      base-url="http://sheets.local/api/"
      v-on:entity-and-mode="entityAndMode"
    />
    <FormBuilderUi
      v-if="id"
      :id="id"
      :mode="mode"
      base-url="http://sheets.local/api/"
      v-on:go-setup-page="id = ''"
    />
  </div>
</template>

<script>
import Setup from "./components/Setup.vue";
import FormBuilderUi from './components/FormBuilderUi.vue';

export default {
  name: "form-builder-ui",
  components: {
    Setup: Setup,
    FormBuilderUi: FormBuilderUi
  },
  data: () => ({
    id: '',
    mode: ''
  }),
  methods: {
    entityAndMode(entityAndMode) {
      this.id = entityAndMode.entityId || entityAndMode.formId;
      this.mode = entityAndMode.mode;
    }
  }
};
</script>
