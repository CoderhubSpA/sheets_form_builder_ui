<template>
  <div>
    <b-button v-b-toggle="menu_id" class="btn btn-toggle align-items-center rounded collapsed">{{ menu_name }}</b-button>
    <b-collapse visible :id="menu_id">
      <div>
        <b-list-group style="padding: 1em">
          <div v-for="(element, index) in $store.state.tools.config" :key="element.name" style="padding: 0.5em">
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
              v-model="$store.state.tools.acciones_value" 
              :options="$store.state.tools.acciones_options" 
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
        <h4>Formulario {{form.name}}</h4>
       
        <div v-for="(row,rindex) of form.rows" :key="rindex">
          <h5 class="p-2">Fila {{rindex+1}}</h5>
          <b-input v-model="row.name" type="text" placeholder="Nombre Fila"/>
          <div v-for="(section,sindex) of row.sections" :key="sindex">
            <h6 class="p-2">Section {{sindex+1}}</h6>
            <b-input v-model="section.name" type="text" placeholder="Nombre Sección"/>
            <b-input v-model="section.cols" type="number"/>
          </div>
        </div>
      </div>

    </b-collapse>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import multiselect from 'vue-multiselect';

export default {
  name: 'ConfigDropdownMenu',
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
  computed:{
        form(){
           return this.$store.state.form.form
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