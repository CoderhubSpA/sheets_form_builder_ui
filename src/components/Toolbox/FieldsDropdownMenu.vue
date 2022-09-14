<template>
  <div>
    <b-button v-b-toggle="menu_id" class="accordion-button">{{ menu_name }}</b-button>
    <b-collapse visible :id="menu_id">
      <div>
        <draggable class="card-deck" style="display:flex; justify-content: flex-start;" group="Campos1">
          <Campo v-for="(element, index) in $store.state.fields" :key="element.name" :text="element.name">
          </Campo>
        </draggable>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import multiselect from 'vue-multiselect';
import Campo from './CampoComponent.vue';

export default {
  name: 'DropdownMenu',
  components: {
    Campo,
    draggable,
    multiselect,
  },
  props: {
    menu_name: {
      type: String,
      required: false,
    },
    menu_id: {
      type: String,
      required: false,
    },
    draggable_elements: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
    }
  },
}
</script>