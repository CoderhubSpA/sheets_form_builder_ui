<template>
  <div>
    <b-button v-b-toggle="menu_id" class="btn btn-toggle align-items-center rounded collapsed">{{ menu_name }}</b-button>
    <b-collapse visible :id="menu_id">
      <div>
        <b-list-group style="padding: 1em">
          <div v-for="(element, index) in $store.state.config" :key="element.name" style="padding: 0.5em">
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
            <div v-else-if="element.type=='acciones'" >
              <multiselect 
              :type="element.type"
              v-model="$store.state.acciones_value" 
              :options="$store.state.acciones_options" 
              :multiple="true" :close-on-select="false" 
              :clear-on-select="false" 
              :preserve-search="true" 
              placeholder="Seleccione acciones" 
              label="name" 
              track-by="name"
              :select-label="''"
              :selected-label="''"
              :deselect-label="''">
            </multiselect>
            </div>

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
import multiselect from 'vue-multiselect';

export default {
  name: 'DropdownMenu',
  components: {
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

<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style>