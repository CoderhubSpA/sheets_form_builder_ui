<template>
  <div class="form-group">
    <draggable class="card-deck" 
    :list="fields" group="Fields" @change="onChange" @dragleave.native="dragleave">
      <transition-group tag="b-row" class="sections">
        <b-col  v-if="$store.state.tools.hover_fields" key="drop" cols="12">
          <div class="p-3 my-2 border-dotted bg-light rounded text-center text-secondary"> Suelta el campo acá</div>
        </b-col>

      <b-col style="margin-bottom: 15px; background-color: lightgray; border-radius: 5px; padding: 8px;" 
        :cols = "view =='xl' ? (field.colXl ? field.colXl : 12) : 
                (view == 'md' ? (field.colMd ? field.colMd : 12): 
                field.colSm ? field.colSm : 12) "
        
        v-for="(field, fieldIdx) in sections[idxSection].fields" :key="field.index" :id="`section-${idxSection}-field-${fieldIdx}`" class="form-group">
        <div class="flex"  @mouseover="field.show=true" @mouseleave="field.show = false">
          <div class="form-group col-12">
            <div class="column">
              <div class="area">
                <button type="button" class="remove" style="display: inline;" v-if="field.show" v-b-modal="`modal-borrar-campo-${idxRow}-${idxSection}-${fieldIdx}`">×</button>
              </div>
              <div class="area">
                <button type="button" class="config" style="display: inline;" v-if="field.show" @click="openFieldConfig(field)"><v-icon class="d-inline-block mb-1" name="cog"/></button>
              </div>
            </div>
            <div style="text-align: left !important; margin-bottom: 5px;"

            >
              <!--<i>{{field.field_type_text}}</i>-->
              <!-- <button type="button" v-if="field.show" style="float:right" class="close-rounded badge border border-light bg-danger p-2" v-b-modal="`modal-borrar-campo-${idxRow}-${idxSection}-${fieldIdx}`">x</button> 
              <button type="button" v-if="field.show" style="float:right" class="close-rounded badge border border-light bg-info p-2" @click="openFieldConfig(field)">
                <v-icon class="d-inline-block ml-2 mb-1" :dark="true" name="cog"/>
              </button> -->
              <b-modal :id="`modal-borrar-campo-${idxRow}-${idxSection}-${fieldIdx}`" centered hide-header @ok="deleteField(fieldIdx)"  ok-variant="danger" ok-title="Sí, estoy seguro" cancel-title="Cancelar">
                <template #default="{ close }">
                  <div class="container row justify-content-end">
                    <b-button class="btn btn-close"  @click="close()"> </b-button>
                    <h5 class="text-center" >¿Está seguro que desea eliminar este campo?</h5>
                  </div>
                </template>
              </b-modal>         
            </div>
            <b-input v-model="field.name" type="text" class="form-control" placeholder="Nombre campo"/>
          </div>
            
        </div>
        <div class="p-3 my-2 border-dotted bg-light rounded text-center text-secondary" v-if="$store.state.tools.hover_fields" key="drop"> Suelta el campo acá</div>
      </b-col>
      

      </transition-group>

    </draggable>
  </div>
</template>
    
<script>
import { viewport } from '@popperjs/core';
import draggable from 'vuedraggable'


export default {
  name: "Field",
  components: {
    draggable
  },
  props:{
    name: {
      type: String,
      required: false
    },
    idxRow:{
      type:Number,
      required:true
    },
    idxSection: {
      type: Number,
      required: true
    }
  },
  computed: {
    sections() {
      return this.$store.state.form.form.rows[this.idxRow].sections;
    },
    fields() {
      return this.$store.state.form.form.rows[this.idxRow].sections[this.idxSection].fields;
    },
    view(){
      return this.$store.state.form.current_view
    }
  },
  data: () => ({
  }),
  methods: {
    deleteField(index) {
      if (this.$store.state.form.current_field_config?.index == this.fields[index].index) {
        this.$store.state.form.current_field_config = null;
      }
      this.updateFields(index);
      this.fields.splice(index, 1);
    },
    updateFields(index){
      this.$store.state.api.fields.push(this.fields[index]);
    },
    onChange(event) {
      if (event.added) {
        event.added.element.idxRow = this.idxRow;
        event.added.element.idxSection = this.idxSection;
        this.openFieldConfig(event.added.element);
      }
    },
    openFieldConfig(newField) {
      this.$store.state.form.current_section_config = null;
      this.$store.state.form.current_form_config = null;
      this.$store.state.form.current_row_config = null;
      this.$store.state.form.current_field_config = newField;
    },
    dragleave() {
      this.$store.commit('tools/change_hover', false);
  
    },
  }
};
</script>
  
<style>

.btn-circle.btn-lg {
  width: 55px;
  height: 55px;
  padding: 10px 16px;
  border-radius: 35px;
  font-size: 12px;
  text-align: center;
  background: #008A94;
}

.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
  background-color: #008A94 !important;
}

.h1-button {
  color: black;
}

.border-dotted{
  border-style: dotted;
  border-color: #BDBBBB;
}

.flex {
  display: flex;
  justify-content: space-between;
  text-align: right;
}

.close-rounded{
  width: 2rem; 
  height:2rem;
}

.area {
  position: relative;
}
.remove {
  display: none;
  position: absolute;
  top: -26px;
  right: -18px;
  border-radius: 10em;
  padding: 4px 7px 5px;
  text-decoration: none;
  font: 700 18px/16px sans-serif;
  background: rgb(250, 10, 10);
  border: 2px solid rgb(255, 255, 255);
  color: #FFF;
}

.config {
  display: none;
  position: absolute;
  top: -26.5px;
  right: 13px;
  border-radius: 10em;
  padding: 0px 5px 1px;
  background: #079a90;
  border: 2px solid rgb(255, 255, 255);
  color: #FFF;
}

</style>
