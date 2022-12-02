<template>
  <div class="field-menu-component col-12">
    <div class="text-center h-100">
      <div class="" style="padding: 0.25em 0.5em">
        <!-- commented fields have a fontawesome icon that doesn't display correctly right now, 
        uncommented fields have a placeholder icon -->
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item d-flex align-items-center">
            <v-icon dense :name="selectVIconName(format)"></v-icon>
          </li>
          <li class="list-group-item w-100">
            <div class="card-title">{{ text }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FieldMenuComponent",
  props: {
    text: {
      type: String,
      required: true,
    },
    format_config_id: {
      type: String,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    format() {
      return this.config[this.format_config_id].id;
    },
  },
  methods: {
    selectVIconName(fieldFormat) {
      return this.$store.getters["tools/selectVIconName"](fieldFormat);
    },
  },
  data() {
    return {};
  },
};
</script>
