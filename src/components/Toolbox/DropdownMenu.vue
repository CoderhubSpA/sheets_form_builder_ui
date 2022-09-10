<template>
  <div>
    <b-button v-b-toggle="menu_id" class="accordion-button">{{ menu_name }}</b-button>
    <b-collapse visible :id="menu_id">
      <div v-if="draggable_elements">
        <draggable class="card-deck" style="display:flex; justify-content: flex-start;" group="Campos1">
          <Campo v-for="element in elements" :key="element.name" :text="element.name">
          </Campo>
        </draggable>
      </div>
      <div v-else>
        <b-list-group style="padding: 1em">
          <div v-for="element of elements" :key="element.name" style="padding: 0.5em">
            <label :for="'menu-'+menu_id+'-element-'+element.name">{{ element.name }}</label>

            <!-- v-if else depending on element.type -->
            <b-form-checkbox v-if="element.type=='checkbox'"
              :id="'menu-'+menu_id+'-element-'+element.name">
            </b-form-checkbox>
            <b-form-input v-else-if="element.type=='text-input'"
              :id="'menu-'+menu_id+'-element-'+element.name"
              :type="element.type"
              :placeholder="'Ingresa '+element.name">
            </b-form-input>
            <b-list-group-item v-else>
              {{ element }}
            </b-list-group-item>
          </div>
        </b-list-group>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import Campo from './CampoComponent.vue';

export default {
  name: 'DropdownMenu',
  components: {
    Campo,
    draggable,
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