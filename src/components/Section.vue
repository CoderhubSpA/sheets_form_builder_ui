<template>
  <div>
    <b-row>
        <b-row class="row-cols-1 row-cols-lg-1 g-2 g-lg-3">
            <draggable >
              <transition-group name="fade" tag="b-row" class="sections">
      
                <b-col v-for="(section, index) in sections" :key="index" :id="`section-${index}`" :cols="sections[index].cols ? sections[index].cols : 12" >
                  
                  <div>
                    <b-form-row>
                      <div class="form-group col-md-4 flex">
                        <!-- <div class="h4 d-inline-block">{{section.name}}</div> -->
                        <!-- <input type="text" class="form-control" placeholder="Nombre Sección"> -->
                        <b-input v-model="section.name" type="text" class="form-control" placeholder="Nombre Sección"/>
                        <button type="button" class="close-rounded position-relative translate-middle badge border border-light rounded-circle bg-danger p-2" @click="deleteSection(index)"> 
                          x
                        </button>
                      </div>
                    </b-form-row>
                    <br>
                    <div class="p-3 border-solid bg-light rounded container" v-bind="section.seccion">
                        <br>
                    </div>
                    <hr>
                  </div>

                </b-col>
        

            </transition-group>
          </draggable>
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
  
export default {
    name: "Section",
    components: {
            draggable
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
      }
    },
    data: () => ({
      // sections: [
      // ]
    }),
  
    methods: {
      addSection () {
        this.sections.push(
           this.newSection()
        )
      },
      newSection(){
        return {
          index: this.sections.length,
          name:"",
          cols:12
        }
      },
      deleteSection (idx) {
        this.sections.splice(idx,1)
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
</style>
