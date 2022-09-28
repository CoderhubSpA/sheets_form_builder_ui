<template>
  <div>
    <b-button v-b-toggle="menu_id" class="btn btn-toggle align-items-center rounded collapsed menu-button">{{ menu_name }}</b-button>
    <b-collapse visible :id="menu_id">
      <div>
        <b-list-group style="padding: 1em">
          <div v-if="currentForm">

          </div>
          <div v-else-if="currentRow">
          
          </div>
          <div v-else-if="currentSection">
            <h4>Sección {{currentSection.index+1}}</h4>
            <label>Nombre sección: </label>
            <b-input v-model="currentSection.name" type="text" placeholder="Nombre Sección"/>
            <label>col sm: </label>
            <b-input v-model="currentSection.colSm" type="number"/>
            <label>col md: </label>
            <b-input v-model="currentSection.colMd" type="number"/>
            <label>col xl: </label>
            <b-input v-model="currentSection.colXl" type="number"/>
            <label>Descripción: </label>
            <b-form-textarea size="lg" v-model="currentSection.description"></b-form-textarea>
          </div>

          <div v-else-if="currentField">
            <h4>Campo:</h4>
            <h5>"{{currentField.name}}"</h5>
            <label for="field-config-name">Nombre del campo</label>
            <b-form-input
              id="field-config-name"
              type="text-input"
              v-model="currentField.name"
              placeholder="Ingresa nombre del campo">
            </b-form-input>
            <br>
            <label for="field-config-required">Requerido</label>
            <b-form-checkbox id="field-config-required" v-model="currentField.required"></b-form-checkbox>
            <br>
            <label for="field-config-description">Descripción</label>
            <div>
              <textarea class="col-12" placeholder="Ingrese la descripción del campo" v-model="currentField.description"></textarea>
            </div>
            <br>
          </div>

          <h4>Formulario:</h4>
          <h5>"{{form.name}}"</h5>
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
    },
    currentForm() {
      return this.$store.state.form.current_form_config;
    },
    currentRow() {
      return this.$store.state.form.current_row_config;
    },
    currentField() {
      return this.$store.state.form.current_field_config;
    },
    currentSection() {
      return this.$store.state.form.current_section_config;
    },
    currentConfig(){
      return this.$store.state.form.current_config;
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