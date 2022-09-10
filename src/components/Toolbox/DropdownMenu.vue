<template>
  <div>
    <b-button v-b-toggle="menu_id" class="accordion-button">{{ menu_name }}</b-button>
    <b-collapse visible :id="menu_id">
      <div v-if="true">
        <div class="card-deck" style="display:flex; justify-content: flex-start;" group="Campos1">
          <Campo v-for="element in elements" :key="element.name" :text="element.name">
          </Campo>
        </div>
      </div>
      <div v-else>
        <b-list-group style="padding: 1em">
          <div v-for="element of elements" :key="element.name" style="padding: 0.5em">
            <b-list-group-item>
              {{ element }}
            </b-list-group-item>
          </div>
        </b-list-group>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import Campo from './CampoComponent.vue';

export default {
  name: 'DropdownMenu',
  components: {
    Campo,
  },
  props: {
    menu_name: {
      type: String,
      required: true,
    },
    menu_id: {
      type: String,
      required: true,
    },
    elements: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
    }
  },
}
</script>