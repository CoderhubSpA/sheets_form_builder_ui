<template>
  <div>

    <b-button v-b-toggle="menu_id" class="btn btn-toggle align-items-center rounded collapsed menu-button">{{ menu_name }}</b-button>
    <b-collapse visible :id="menu_id">
      <div>
        <b-list-group style="padding: 1em">
          <div v-if="currentForm">
            <h4>Formulario:</h4>
            <h5>"{{form.name}}"</h5>
            <div v-for="element in $store.state.api.config" :key="element.name" style="padding: 0.5em">
              <label :for="'menu-'+menu_id+'-element-'+element.name">{{ element.name }}</label>
              <!-- v-if else depending on element.format -->
              <b-form-checkbox v-if="element.format=='checkbox'"
                :id="'menu-'+menu_id+'-element-'+element.name">
              </b-form-checkbox>
              <b-form-input v-else-if="element.format=='text-input'"
                :id="'menu-'+menu_id+'-element-'+element.name"
                :type="element.format"
                :placeholder="'Ingresa '+element.name">
              </b-form-input>
              <div v-else-if="element.format=='SELECTOR'">
                <select class="form-select" :id="'menu-'+menu_id+'-element-'+element.name"
                v-model="$store.state.api.config_select[element.id].values" @change="myPrint([$store.state.api.config_select[element.id].values])">
                  <option v-for="option in $store.state.api.config_select[element.id].options" 
                  :value="option">{{option.name}}</option>
                </select>
              </div>
              <div v-else-if="element.format=='SELECTOR[MULTIPLE]'">
                <!--  Idealmente que sea este
                <select class="form-select" :id="'menu-'+menu_id+'-element-'+element.name"
                v-model="$store.state.api.config_select[element.id].values" multiple>
                  <option v-for="option in $store.state.api.config_select[element.id].options" 
                  :value="option">{{option.name}}</option>
                </select> -->
                <multiselect
                  :type="element.format"
                  v-model="$store.state.api.actions" 
                  :options="$store.state.api.config_select[element.id].options" 
                  :multiple="true" :close-on-select="false" 
                  :clear-on-select="false" 
                  :preserve-search="true" 
                  placeholder="Seleccione acciones" 
                  label="name" 
                  track-by="id"
                  :select-label="''"
                  :selected-label="''"
                  :deselect-label="''">
                </multiselect>
              </div>
              <b-list-group-item v-else>
                {{ element }}
              </b-list-group-item>
              
              
            </div>
          </div>
          
          <div v-else-if="currentRow">
          
          </div>
          <div v-else-if="currentSection">
            <h4 @click="myPrint(currentSection)">Sección {{currentSection.index+1}}</h4>
            <br>
            <div v-for="element in $store.state.api.sections_config" :key="element.id" style="padding: 0.5em">
              <label :for="'menu-'+menu_id+'-element-'+element.id">
                {{ element.name }}
              </label>

              <b-form-checkbox
              v-if="element.format=='SiNo'"
                :id="'menu-'+menu_id+'-element-'+element.id"
                v-model="currentSection.config_values[element.id]"
              ></b-form-checkbox>
              
              <b-form-input
              v-else-if="element.format=='TEXT'"
                :id="'menu-'+menu_id+'-element-'+element.id"
                v-model="currentSection.config_values[element.id]"
              ></b-form-input>

              <select
              v-else-if="element.format=='SELECTOR'"
                class="form-select"
                :id="'menu-'+menu_id+'-element-'+element.id"
                v-model="currentSection.config_values[element.id]"
              >
                <option v-for="option in $store.state.api.sections_config_select[element.id].options"
                  :value="option"
                  :key="option.id">
                  {{ option.name }}
                </option>
              </select>

              <b-list-group-item
              v-else>
                {{ element }}
              </b-list-group-item>
            </div>
            <label for="section-config-name">Nombre sección: </label>
            <b-input v-model="currentSection.name" id="section-config-name" type="text" placeholder="Nombre Sección"/>
            <label for="section-config-col-sm">col sm: </label>
            <b-input v-model="currentSection.colSm" id="section-config-col-sm" type="number"/>
            <label for="section-config-col-md">col md: </label>
            <b-input v-model="currentSection.colMd" id="section-config-col-md" type="number"/>
            <label for="section-config-col-xl">col xl: </label>
            <b-input v-model="currentSection.colXl" id="section-config-col-xl" type="number"/>
            <label for="section-config-description">Descripción: </label>
            <b-form-textarea size="lg" v-model="currentSection.description" id="section-config-description"/>
            <br>
            <label for="section-config-image">Agregar imagen: </label>
            <b-form-file v-model="currentSection.image"  id="section-config-image"
            @change="handleImage(currentSection)" accept="image/jpeg, image/png, image/gif" plain></b-form-file>
            
            <b-form-row class="py-1 w-100">
              <b-button v-b-modal.modal-1 variant="primary">Ver imagen</b-button>
              <b-modal class="modal-img" id="modal-1" title="BootstrapVue" hide-footer hide-header centered>
                <b-img :src="currentSection.image_url" alt="image-section" width="320px"/>
            </b-modal>
            </b-form-row>

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
            <label for="field-config-col-sm">col sm: </label>
            <b-input v-model="currentField.colSm" id="field-config-col-sm" type="number"/>
            <label for="field-config-col-md">col md: </label>
            <b-input v-model="currentField.colMd" id="field-config-col-md" type="number"/>
            <label for="field-config-col-xl">col xl: </label>
            <b-input v-model="currentField.colXl" id="field-config-col-xl" type="number"/>
            <br>
            <label for="field-config-description">Descripción</label>
            <div>
              <textarea class="col-12" placeholder="Ingrese la descripción del campo" v-model="currentField.description"></textarea>
            </div>
            <br>

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
      pondObject: null, 
    }
  },
  methods:{
    handleImage(obj){
      obj.image_url = window.URL.createObjectURL(obj.image)
    },
    myPrint(log){
      console.log(log)
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style>
