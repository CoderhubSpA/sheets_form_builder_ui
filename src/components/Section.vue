<template>
  <div>
    <b-row>
        <b-row class="row-cols-1 row-cols-lg-1 g-2 g-lg-3">
        <draggable
          :list="sections"
          @change="onChange"
          :animation="200"
          ghost-class="moving-section">
          <transition-group name="fade" tag="b-row" class="sections">

                <b-col v-for="(section, index) in sections" :key="section.index" :id="`section-${section.index}`"
                      :cols = "view =='xl' ? (sections[index].colXl ? sections[index].colXl : 12) : 
                              (view == 'md' ? (sections[index].colMd ? sections[index].colMd : 12): 
                              sections[index].colSm ? sections[index].colSm : 12) "
                      class="cursor-move my-1"
                      >
                      <div 
                     class="p-3 rounded panel-resizable"
                     :style="$store.state.form.current_section_config?.index===section.index? 
                                  'border-style: solid; border-radius: 5%; border-width: medium; border-color: #008A94;':
                                  'border-style: solid; border-radius: 5%;border-width: thin; border-color:#BDBBBB'"
                     @click.self="openSectionConfig(section)"
                     >
                    <b-form-row>
                      <div class="form-group flex">
                        <!-- <div class="h4 d-inline-block">{{section.name}}</div> -->
                        <!-- <input type="text" class="form-control" placeholder="Nombre Sección"> -->
                        <b-input v-model="section.name" type="text" class="form-control" placeholder="Nombre Sección"/>
                        <button type="button" class="close" aria-label="Close" v-b-modal="`modal-borrar-seccion-${idxRow}-${index}`">×</button>
                        <b-modal :id="`modal-borrar-seccion-${idxRow}-${index}`" centered hide-header @ok="deleteSection(index)"  ok-variant="danger" ok-title="Sí, estoy seguro" cancel-title="Cancelar">
                          <template #default="{ close }">
                            <div class="container row justify-content-end">
                              <b-button class="btn btn-close"  @click="close()"> </b-button>
                              <h5 class="text-center" >¿Está seguro que desea eliminar esta sección?</h5>
                            </div>
                          </template>
                      </b-modal>
                      </div>
                    </b-form-row>
                    <br>
                    <b-form-row class="p-3 border-solid bg-light rounded container" v-bind="section.seccion"
                    @click.self="openSectionConfig(section)"
                    >
                    
                    

                      <Field :idxSection="index" :idxRow="idxRow"/>
                    </b-form-row>
                    
                  </div>
                </b-col>
              </transition-group>
            </draggable>
            <!-- pa debuguear -->
            <!-- {{sections}} -->
            <div class="p-3 border-dotted bg-light rounded" > <!-- Hacer el for aquí para que solo se haga ciclo por la fila con el boton -->
              <div class="container text-center">
                <button type="button"  class="btn-primary btn btn-circle btn-lg" size="sm" @click="addSection">
                  <v-icon name="plus" scale="1.5"/>
                </button>
                <p>Añadir Sección</p>
              </div>
            </div>
        </b-row>
    </b-row>
  </div>
</template>
  
<script>
import draggable from 'vuedraggable'
import Campo from './Toolbox/CampoComponent.vue';
import Field from "./Fields/Field.vue"
  
export default {
    name: "Section",
    components: {
    draggable,
    Campo,
    Field
},
    props:{
      idRow:{
        type:String,
        required:false //por ahora es false, cada seccion debe saber a que fila pertenece
      },
      idxRow:{
        type:Number,
        required:true //por ahora es false, cada seccion debe saber a que fila pertenece
      }
    },
    computed:
    {
      sections(){
        return this.$store.state.form.form.rows[this.idxRow].sections
      },
      view(){
        return this.$store.state.form.current_view
      }

    },
    data: () => ({
      formatTypes: [
        {name: 'TEXT', value: ""},
        {name: 'NUMBER', value: null},
        {name: 'SELECTOR', value: []},
        {name: 'SiNo', value: null}
      ]
    }),
  
    methods: {
      addSection () {
        let section = this.newSection();
        
        section.idxRow = this.idxRow;
        this.sections.push(section);
        this.openSectionConfig(section)
      },
      selectFormat(format, name){
        let res = null;
        this.formatTypes.forEach(element =>{
          if (format === element.name){
            console.log("primer if")
            if (name === 'col_sm' || name === 'col_md' || name === 'col_xl'){
              res = "12"
            }
            else {
              res = element.value
            }
          }
        })
        return res;
      },
      newSection(){
        let config_values = {};
        this.$store.state.api.sections_config.forEach(config => {
          config_values[config.id] =  this.selectFormat(config.format, config.name)
        })

        return {
          index: this.sections.length,
          name: "",
          description:"",
          colSm:12,
          colMd:12,
          colXl:12,
          image:'',
          fields: [],
          idxRow: -1,
          config_values: config_values, // here we store the values for the sections_config
        }
      },
      deleteSection (idx) {
        if (this.$store.state.form.current_section_config?.index == this.sections[idx].index) {
          this.$store.state.form.current_section_config = null;
        }
        this.updateFields(idx);
        this.sections.splice(idx,1)
        this.sections.forEach(
          (s, sidx) => s.index=sidx
        )
      },
      updateFields(index){
        this.sections[index].fields.forEach(field => {
          this.$store.state.api.fields.push(field);
        });

      },
      onChange(event) {
        if (event.added) {
          event.added.element.idxRow = this.idxRow;
        } else if (event.moved) {
          this.sections.forEach(
            (s, sidx) => s.index=sidx
          )
        }
      },
      openSectionConfig(section){
        this.$store.state.form.current_form_config = null
        this.$store.state.form.current_row_config = null
        this.$store.state.form.current_field_config = null
        this.$store.state.form.current_section_config = section
      }
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
  height: 2rem;
}

.moving-section {
  opacity: 0.5;
  background: #F7FAFC;
  border: 2px solid #008A94;
  border-radius: 5px;
}
.cursor-move{
  cursor: move;
}

.close {
  cursor: pointer;
  right: 0%;
  width: 32px;
  height: 32px;
  font-size: 21px;
  font-weight: 700;
  color: #ff4949;
  border: none;
  background: none;
  opacity: 0.8;
}

.close:hover {
  color: red;
  opacity: 1;
}

.panel-resizable {
  resize: horizontal;
  max-width: 100%;
  min-width: 25%;
  overflow: hidden;
}

</style>
