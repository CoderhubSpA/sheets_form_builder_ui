<template>
  <div id="row" class="container">
    <form>
      <div class="form-row" >
        <div class="row  row-cols-1 row-cols">
          <div class="col">
            <draggable 
              :list="rows" 
              :animation="200"
              ghost-class="moving-section">
              <transition-group>
                <div v-for="(row, index) in rows" :key="index" :id="`row-${index}`" class="cursor-move">
                  <form @click.self="openRowConfig(row)">
                    <div class="form-group col-md-4 flex">
                      <!-- <div class="h3 d-inline-block">{{row.name}}</div> -->
                      <!-- <input type="text" class="form-control" placeholder="Nombre Fila"> -->
                      <b-input v-model="row.config_values[rowNameConfigId]" type="text" class="form-control" placeholder="Nombre Fila"/>
                      <button type="button" class="btn btn-danger btn-sm delete"  v-b-modal="`modal-borrar-fila-${index}`" > 
                        <v-icon class="custom-icon" name="trash"></v-icon>
                      </button>
                      <b-modal :id="`modal-borrar-fila-${index}`" centered hide-header @ok="deleteRow(index)"  ok-variant="danger" ok-title="Sí, estoy seguro" cancel-title="Cancelar">
                        <template #default="{ close }">
                          <div class="container row justify-content-end">
                            <b-button class="btn btn-close"  @click="close()"> </b-button>
                            <h5 class="text-center" >¿Está seguro que desea eliminar esta fila?</h5>
                          </div>
                        </template>
                      </b-modal>
                    </div>
                  </form>
                  <br>
                  <div class="p-3 border-solid bg-light rounded container" v-bind="row">
                  <Section :idxRow="index"></Section>
                  <br>
                </div>
              <hr>
            </div>
          </transition-group>
          </draggable>
            <div class="pt-3 border-dotted bg-light rounded" >
              <div class="container text-center">
                <button type="button"  class="btn btn-primary btn-circle btn-xl" @click="addRow">
                  <v-icon name="plus" scale="1.75"/>
                </button>
                <p>Añadir Fila</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Section from './Section.vue';

export default {
    name: "Row",
    components: {
      Section,
      draggable,
    },
    props:{
      idForm:{
        type:String,
        required:false //por ahora es false, pero la idea es que una row sepa a que formulario pertenece
      }
    },
    computed:
    {
      rows(){
        return this.$store.state.form.form.rows
      },
      rowNameConfigId() {
        return this.$store.state.api.rows_config.find(config => config.name === 'Nombre').id;
      },
      formatTypes() {
        return this.$store.state.tools.format_types;
      }
    },
    data: () => ({
    }),
    mounted(){
    },

    methods: {
      addRow () {
        this.rows.push(
           this.newRow()
        )
      },
      selectFormat(format, name){
        if (name === 'col_sm' || name === 'col_md' || name === 'col_xl') {
          return "12";
        }
        let type = this.formatTypes.find(element => element.name === format);
        if (type)
          return type.value;
        console.log("No se encontró el formato" + format);
        return "";
      },
      newRow(){
        let config_values = {};
        this.$store.state.api.rows_config.forEach(config => {
          config_values[config.id] = this.selectFormat(config.format, config.name)
        });
        
        return {
          sections:[],
          config_values: config_values,
          form_id: "",
          index: this.rows.length
        }
      },
      deleteRow (idx) {
        this.updateFields(idx)
        this.rows.splice(idx,1)
      },
      updateFields(index){
        this.rows[index].sections.forEach((section) => {
          section.fields.forEach(field => {
            this.$store.state.api.fields.push(field);
          })
        })
      },
      openRowConfig(row){
        this.$store.state.form.current_form_config = null
        this.$store.state.form.current_row_config = row
        this.$store.state.form.current_field_config = null
        this.$store.state.form.current_section_config = null
      }
  }
};
</script>

<style>

.btn-circle.btn-xl {
  width: 70px;
  height: 70px;
  padding: 10px 16px;
  border-radius: 35px;
  font-size: 12px;
  text-align: center;
  background: #008A94;
}

.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
  background-color: #008A94 !important;
}

.border-dotted {
  border-style: dotted;
  border-color: #BDBBBB;
}

.flex {
  display: flex;
  justify-content: space-between;
  text-align: right;
}

.custom-icon {
  fill: white;
}

.moving-section {
  opacity: 0.5;
  background: #F7FAFC;
  border: 2px solid #008A94;
  border-radius: 5px;
}

.cursor-move:hover{
  cursor: move;
}

</style>
