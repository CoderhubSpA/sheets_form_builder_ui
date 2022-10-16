<template>
    <div>
  
      <b-button v-b-toggle="menu_id" class="btn btn-toggle align-items-center rounded collapsed menu-button">{{ menu_name }}</b-button>
      <b-collapse visible :id="menu_id">
  <div>
    <b-list-group style="padding: 1em">
      <div v-if="currentForm">
        <h4>Formulario:</h4>
        <h5>"{{form.name}}"</h5>
              <div v-for="element in $store.state.api.config.filter(element => element.show_in_create_form==2)" :key="element.name" style="padding: 0.5em">
          <label :for="'menu-'+menu_id+'-element-'+element.name">{{ element.name }}</label>
          <!-- v-if else depending on element.format -->
          <b-form-checkbox v-if="element.format=='SiNo'"
            :id="'menu-'+menu_id+'-element-'+element.name"
            v-model="$store.state.api.config_values[element.id]"
          >
          </b-form-checkbox>

          <b-form-input v-else-if="element.col_name=='name'"
            :id="'nameInserted'"
            :placeholder="currentForm.name"
            v-model="currentForm.name"
          >
          </b-form-input>

          <b-form-input v-else-if="element.format=='TEXT'"
            :id="'menu-'+menu_id+'-element-'+element.name"
            :placeholder="'Ingresa '+element.name"
            v-model="$store.state.api.config_values[element.id]"
          >
          </b-form-input>

          <div v-else-if="element.name=='Tipo de Entidad'">
            <select class="form-select" :id="'menu-'+menu_id+'-element-'+element.name"
            v-model="$store.state.api.config_values[element.id]" @change="showFields($store.state.api.config_values[element.id].id)">
              <option v-for="option in $store.state.api.config_select[element.id].options" 
              :value="option"
              :key="option.id"
            >{{option.name}}</option>
            </select>
          </div>

          <div v-else-if="element.format=='SELECTOR'">
            <select class="form-select" :id="'menu-'+menu_id+'-element-'+element.name"
            v-model="$store.state.api.config_values[element.id]">
              <option v-for="option in $store.state.api.config_select[element.id].options" 
              :value="option"
              :key="option.id"
            >{{option.name}}</option>
            </select>
          </div>
          <div v-else-if="element.format=='SELECTOR[MULTIPLE]'">
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

          <b-form-input
          v-else-if="element.format=='NUMBER'"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentForm.config_values[element.id]"
          ></b-form-input>
          <b-list-group-item v-else>
            {{ element }}
          </b-list-group-item>
          
          
        </div>
      </div>
      
      <div v-else-if="currentRow">
        <h4>Fila {{ currentRow.name }}</h4>
        <br>
        <div v-for="element in $store.state.api.rows_config.filter(element => element.show_in_create_form==2)" :key="element.id" style="padding: 0.5em">
          <label :for="'menu-'+menu_id+'-element-'+element.id">
            {{ element.name }}
          </label>

          <b-form-checkbox
          v-if="element.format=='SiNo'"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentRow.config_values[element.id]"
          ></b-form-checkbox>

          <b-form-input v-else-if="element.col_name=='name'"
            :id="'menu-'+menu_id+'-element-'+element.name"
            :placeholder="currentRow.name"
            v-model.lazy="currentRow.name"
          >
          </b-form-input>

          

          <b-form-input
          v-else-if="element.format=='TEXT'"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentRow.config_values[element.id]"
          ></b-form-input>


          <select
          v-else-if="element.format=='SELECTOR'"
            class="form-select"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentRow.config_values[element.id]"
          >
            <option v-for="option in $store.state.api.rows_config_select[element.id].options"
              :value="option"
              :key="option.id">
              {{ option.name }}
            </option>
          </select>

          <b-form-input
          v-else-if="element.format=='NUMBER'"
            type="number"
            min="0"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentRow.config_values[element.id]"
          ></b-form-input>
          <b-list-group-item
          v-else>
            {{ element }}
          </b-list-group-item>
          
        </div>
      
      </div>
      <div v-else-if="currentSection">
        <h4>Sección {{currentSection.index+1}}</h4>
        <br>
              <div v-for="element in $store.state.api.sections_config.filter(element => element.show_in_create_form==2)" :key="element.id" style="padding: 0.5em">
          <label :for="'menu-'+menu_id+'-element-'+element.id">
            {{ element.name }}
          </label>

          <b-form-checkbox
          v-if="element.format=='SiNo'"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentSection.config_values[element.id]"
          ></b-form-checkbox>

          <b-input
          v-else-if="element.col_name=='name'"
            :id="'menu-'+menu_id+'-element-'+element.id"
             v-model="currentSection.name" type="text" placeholder="Nombre Sección"/>

        <b-form-textarea 
        v-else-if="element.col_name=='description'"
        size="lg" v-model="currentSection.description" :id="'menu-'+menu_id+'-element-'+element.id"/>

        <custom-slider
        v-else-if="element.col_name=='col_sm'"
        min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentSection.colSm"/>

        <custom-slider
        v-else-if="element.col_name=='col_md'"
        min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentSection.colMd"/>

        <custom-slider
        v-else-if="element.col_name=='col_xl'"
        min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentSection.colXl"/>


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

          <b-form-input
          v-else-if="element.format=='NUMBER'"
            type="number"
            min="0"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentSection.config_values[element.id]"
          ></b-form-input>

          <b-form-row class="py-1 w-100" v-else-if="element.format=='DOCUMENT[IMAGE]'"
          :id="'menu-'+menu_id+'-element-'+element.id">
          <b-form-file 
          v-model="currentSection.image"  :id="'section-config-image'+element.id"
        @input="handleImage(currentSection)" accept="image/jpeg, image/png, image/gif" plain></b-form-file>
        
          <b-modal class="modal-img" id="modal-1" title="BootstrapVue" hide-footer hide-header centered>
            <b-img :src="currentSection.image_url" alt="image-section" width="320px"/>
        </b-modal>
        <b-button v-b-modal.modal-1 variant="primary">Ver imagen</b-button>
        </b-form-row>



          <b-list-group-item
          v-else>
            {{ element }}
          </b-list-group-item>
        </div>

      </div>

      <div v-else-if="currentField">
        <h4>{{ currentField.name }}</h4>
        <br>
              <div v-for="element in $store.state.api.fields_config.filter(element => element.show_in_create_form==2)" :key="element.id" style="padding: 0.5em">
          <label :for="'menu-'+menu_id+'-field-'+currentField.id+'-element-'+element.id">
            {{ element.name }}
          </label>
          
          <b-form-checkbox
          v-if="element.format=='SiNo'"
            :id="'menu-'+menu_id+'-field-'+currentField.id+'-element-'+element.id"
                  v-model="$store.state.api.fields_config_values[currentField.id][element.id]">
          </b-form-checkbox>

              <b-form-input
              v-else-if="element.format=='TEXT'"
                :id="'menu-'+menu_id+'-field-'+currentField.id+'-element-'+element.id"
                  v-model="$store.state.api.fields_config_values[currentField.id][element.id]"
                :placeholder="'Ingresa ' + element.name">
              </b-form-input>

              <custom-slider
              v-else-if="element.col_name=='col_sm'"
              min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentField.colSm"/>
              <custom-slider
              v-else-if="element.col_name=='col_md'"
              min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentField.colMd"/>

              <custom-slider
              v-else-if="element.col_name=='col_xl'"
              min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentField.colXl"/>

              <b-form-input
              v-else-if="element.format=='NUMBER'"
                type="number"
                min="0"
                :id="'menu-'+menu_id+'-element-'+element.id"
                v-model="currentField.config_values[element.id]"
              ></b-form-input>

              <b-form-input
              v-else-if="element.format=='URL'"
                type="url"
                :id="'menu-'+menu_id+'-element-'+element.id"
                v-model="currentField.config_values[element.id]"
              ></b-form-input>

              <div
              v-else-if="element.name=='Columna'"
                :id="'menu-'+menu_id+'-field-'+currentField.id+'-element-'+element.id"
              >
                  {{ $store.state.api.fields_config_values[currentField.id][element.id].name }}
              </div>
              <select
              v-else-if="element.format=='SELECTOR'"
                class="form-select"
                :id="'menu-'+menu_id+'-field-'+currentField.id+'-element-'+element.id"
                  v-model="$store.state.api.fields_config_values[currentField.id][element.id]"
              >
                <option v-for="option in $store.state.api.fields_config_select[element.id].options" 
                  :value="option"
                  :key="'option-'+option.id"
                >
                  {{ option.name }}
                </option>
              </select>
              <b-form-input
          v-else-if="element.format=='NUMBER'"
            type="number"
            min="0"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentField.config_values[element.id]"
          ></b-form-input>
              <b-list-group-item v-else>
                {{ element }}
              </b-list-group-item>
            </div>
            <!--
            <label for="field-config-required">Requerido</label>
            <b-form-checkbox id="field-config-required" v-model="currentField.required"></b-form-checkbox>
            -->
            <label for="field-config-col-sm">col sm: </label>
            <!-- <b-input v-model="currentField.colSm" id="field-config-col-sm" type="number"/> -->
            <label for="field-config-col-md">col md: </label>
            <!-- <b-input v-model="currentField.colMd" id="field-config-col-md" type="number"/> -->
            <label for="field-config-col-xl">col xl: </label>

            <!-- <b-input v-model="currentField.colXl" id="field-config-col-xl" type="number"/> -->
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
    }
  },
  methods:{
    handleImage(obj){
      obj.image_url = window.URL.createObjectURL(obj.image)
    },
    showFields(entity_id){
      this.$store.dispatch('api/get_fields', entity_id);
    },
    updateData(entity_id){
      this.$store.dispatch('api/update_value_config_select', entity_id);
    },
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style>
