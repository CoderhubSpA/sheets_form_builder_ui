<template>
    <div>

      <b-collapse visible :id="menu_id">
  <div>
    <b-list-group style="padding: 1em">
      <div v-if="currentForm">
        <h5>Formulario:</h5>
        <h6>"{{currentFormName}}"</h6>
        <div v-for="element in $store.state.api.config.filter(element => element.show_in_create_form==2)" :key="element.name" style="padding: 0.5em">
          <label :for="'menu-'+menu_id+'-element-'+element.name">
            <div v-if="element.required_in_create_form === 1">
              {{ element.name }} <span class="text-danger">*</span>
            </div>
            <div v-else>
              {{ element.name }}
            </div>
          </label>
          <!-- v-if else depending on element.format -->
          <b-form-checkbox v-if="element.format=='SiNo'"
            :id="'menu-'+menu_id+'-element-'+element.name"
            v-model="$store.state.form.form.config_values[element.id]"
          >
          </b-form-checkbox>

          <b-form-input v-else-if="element.format=='TEXT'"
            :id="'menu-'+menu_id+'-element-'+element.name"
            :placeholder="'Ingresa '+element.name"
            v-model="$store.state.form.form.config_values[element.id]"
          >
          </b-form-input>

          <div v-else-if="element.name=='Tipo de Entidad'">
            <select class="form-select" :id="'menu-'+menu_id+'-element-'+element.name"
            v-model="$store.state.form.form.config_values[element.id]" @change="showFields($store.state.form.form.config_values[element.id].id)">
              <option v-for="option in $store.state.api.config_select[element.id].options" 
              :value="option"
              :key="option.id"
            >{{element.col_name_fk ? option[element.col_name_fk] : option.name}}</option>
            </select>
          </div>

          <div v-else-if="element.format=='SELECTOR'">
            <select class="form-select" :id="'menu-'+menu_id+'-element-'+element.name"
            v-model="$store.state.form.form.config_values[element.id]">
              <option v-for="option in $store.state.api.config_select[element.id].options" 
              :value="option"
              :key="option.id"
            >{{
                element.col_name_fk ? option[element.col_name_fk] : option.name
              }}</option>
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
        <h4>Fila: {{ currentRowName }}</h4>
        <br>
        <div v-for="element in $store.state.api.rows_config.filter(element => element.show_in_create_form==2 && hiddenConfig(element))" :key="element.id" style="padding: 0.5em">
          <label :for="'menu-'+menu_id+'-element-'+element.id">
            <div v-if="element.required_in_create_form === 1">
              {{ element.name }} <span class="text-danger">*</span>
            </div>
            <div v-else>
              {{ element.name }}
            </div>
          </label>

          <b-form-checkbox
          v-if="element.format=='SiNo'"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentRow.config_values[element.id]"
          ></b-form-checkbox>

          <b-form-input v-else-if="element.col_name=='name'"
            :id="'menu-'+menu_id+'-element-'+element.name"
            :placeholder="currentRow.config_values[element.id]"
            v-model="currentRow.config_values[element.id]"
            @change="updateRowName(currentRow.config_values[element.id])"
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
              {{ element.col_name_fk ? option[element.col_name_fk] : option.name }}
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
        <h5>Sección: {{currentSectionName}}</h5>
        <br>
              <div v-for="element in $store.state.api.sections_config.filter(element => element.show_in_create_form==2 && hiddenConfig(element))" :key="element.id" style="padding: 0.5em">
          <label :for="'menu-'+menu_id+'-element-'+element.id">
            <div v-if="element.required_in_create_form === 1">
              {{ element.name }} <span class="text-danger">*</span>
            </div>
            <div v-else>
              {{ element.name }}
            </div>
          </label>

          <b-form-checkbox
          v-if="element.format=='SiNo'"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentSection.config_values[element.id]"
          ></b-form-checkbox>

          <b-input
          v-else-if="element.col_name=='name'"
            :id="'menu-'+menu_id+'-element-'+element.id"
             v-model="currentSection.config_values[element.id]" type="text" placeholder="Nombre Sección"/>

        <b-form-textarea 
        v-else-if="element.col_name=='description'"
        size="lg" v-model="currentSection.config_values[element.id]" :id="'menu-'+menu_id+'-element-'+element.id"/>

        <custom-slider
        v-else-if="element.col_name=='col_sm'"
        min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentSection.config_values[element.id]"/>

        <custom-slider
        v-else-if="element.col_name=='col_md'"
        min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentSection.config_values[element.id]"/>

        <custom-slider
        v-else-if="element.col_name=='col_xl'"
        min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentSection.config_values[element.id]"/>


          <b-form-input
          v-else-if="element.format=='TEXT'"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentSection.config_values[element.id]"
          ></b-form-input>

          <b-form-input
          v-else-if="element.format=='NUMBER'"
            type="number"
            min="0"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentSection.config_values[element.id]"
          ></b-form-input>

          <select
          v-else-if="element.format=='SELECTOR'"
            class="form-select"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentSection.config_values[element.id]"
          >
            <option v-for="option in $store.state.api.sections_config_select[element.id].options.filter(op => op.show_in_create_form==2)"
              :value="option"
              :key="option.id">
              {{ element.col_name_fk ? option[element.col_name_fk] : option.name }}
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
        <h5>
          {{ currentFieldName }}
        </h5>
        <br>
              <div v-for="element in $store.state.api.fields_config.filter(element => element.show_in_create_form==2 && hiddenConfig(element))" :key="element.id" style="padding: 0.5em">
          <label :for="'menu-'+menu_id+'-field-'+currentField.id+'-element-'+element.id">
            <div v-if="element.required_in_create_form === 1">
              {{ element.name }} <span class="text-danger">*</span>
            </div>
            <div v-else>
              {{ element.name }}
            </div>
          </label>
          
          <b-form-checkbox
          v-if="element.format=='SiNo'"
            :id="'menu-'+menu_id+'-element-'+element.id"
                  v-model="currentField.config_values[element.id]">
          </b-form-checkbox>

          <select 
            v-else-if="element.col_name=='form_id'"
            class="form-select"
            :id="'menu-'+menu_id+'-element-'+element.id"
            v-model="currentField.config_values[element.id]"
          > 
          <option v-for="option in $store.state.api.fields_config_select[element.id].options"
              :value="option"
              :key="option.id">
              {{ element.col_name_fk ? option[element.col_name_fk] : option.name }}
            </option>
        </select>

              <custom-slider
              v-else-if="element.col_name=='col_sm'"
              min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentField.config_values[element.id]"/>
              <custom-slider
              v-else-if="element.col_name=='col_md'"
              min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentField.config_values[element.id]"/>

              <custom-slider
              v-else-if="element.col_name=='col_xl'"
              min="1" max="12" step="1" :id="'menu-'+menu_id+'-element-'+element.id" v-model="currentField.config_values[element.id]"/>

              <textarea
              v-else-if="element.col_name=='description'"
                :id="'menu-'+menu_id+'-element-'+element.id"
                class="col-12" placeholder="Ingrese descripción del campo"
                v-model="currentField.config_values[element.id]"></textarea>

              <b-form-input
              v-else-if="element.format=='TEXT'"
                :id="'menu-'+menu_id+'-element-'+element.id"
                  v-model="currentField.config_values[element.id]"
                :placeholder="'Ingresa ' + element.name">
              </b-form-input>
              

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
                :id="'menu-'+menu_id+'-element-'+element.id"
              >
                  {{ currentField.config_values[element.id].name }}
              </div>

              <select
              v-else-if="element.format=='SELECTOR'"
                class="form-select"
                :id="'menu-'+menu_id+'-element-'+element.id"
                  v-model="currentField.config_values[element.id]"
              >
                <option v-for="option in $store.state.api.fields_config_select[element.id].options" 
                  :value="option"
                  :key="'option-'+option.id"
                >
                  {{ element.col_name_fk ? option[element.col_name_fk] : option.name }}
                </option>
              </select>

              <b-list-group-item v-else>
                {{ element }}
              </b-list-group-item>
            </div>
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
    },

    currentFieldName() {
      return this.currentField.config_values[
        this.$store.state.api.fields_config.find(config => config.name === 'Columna').id
      ].name;
    },
    currentSectionName() {
      return this.currentSection.config_values[
        this.$store.state.api.sections_config.find(config => config.name === 'Título de la sección').id
      ];
    },
    currentRowName() {
      return this.currentRow.config_values[
        this.$store.state.api.rows_config.find(config => config.name === 'Nombre').id
      ];
    },
    currentFormName() {
      return this.currentForm.config_values[
        this.$store.state.api.config.find(config => config.name === 'Nombre').id
      ]
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
      this.$store.dispatch('api/fetchFields', entity_id);
    },
    updateFormId(entity){
      this.$store.state.form.form.rows[this.currentRow.index].form_id = entity
      this.$store.state.form.form.rows[this.currentRow.index].sections.forEach(section => {
      section.form_id = entity
      }
      )
    },
    updateRowName(element){
      this.$store.state.form.form.rows[this.currentRow.index].sections.forEach(section => 
      section.form_row_id = element
      )
    },
    hiddenConfig(element){
      let columns_hidden = [ 'Formulario', 'Fila del formulario', 'Sección formulario', 'Alternativas', 'Entidad del form', 'Sección siguiente default', 'Mostrar solo por el campo', 'Mostrar solo si el campo posee valor', 'Columna']
      return !(columns_hidden.includes(element.name))
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style>
<style>

.slider {
  margin-top: 1em !important; margin-bottom: 0 !important;
}
</style>
