<template>
  <div>
    <b-button v-b-toggle="menu_id" class="btn btn-toggle align-items-center rounded collapsed">{{ menu_name }}</b-button>
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

<style>

.btn-toggle {
  display: inline-flex;
  align-items: center;
  padding: .25rem .5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, .65);
  background-color: transparent;
  border: 0;
}
.btn-toggle:hover,
.btn-toggle:focus {
  color: rgba(0, 0, 0, .85);
}

.btn-toggle::before {
  width: 1.25em;
  line-height: 0;
  content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
  transition: transform .35s ease;
  transform-origin: .5em 50%;
}

.btn-toggle[aria-expanded="true"] {
  color: rgba(0, 0, 0, .85);
}
.btn-toggle[aria-expanded="true"]::before {
  transform: rotate(90deg);
}
</style>