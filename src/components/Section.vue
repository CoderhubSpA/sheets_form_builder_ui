<template>
  <div class="form-row" >
    <div class="row row-cols-1 row-cols-lg-1 g-2 g-lg-3">
      <div class="col">
        <draggable
          :animation="200"
          ghost-class="moving-section">
          <transition-group>

          <div v-for="(section, index) in sections" :key="section" :id="`section-${index}`" class="cursor-move">
            <form>
              <div class="form-group col-md-4 flex">
                <input type="text" class="form-control" placeholder="Nombre Sección">
                <button type="button" class="close-rounded position-relative translate-middle badge border border-light rounded-circle bg-danger p-2" @click="deleteSection(index)"> 
                  x
                </button>
              </div>
            </form>
            <br>
            <div class="p-3 border-solid bg-light rounded container" v-bind="section.seccion">
              <br>
            </div>
            <hr>
          </div>
        </transition-group>
      </draggable>
        <div class="p-3 border-dotted bg-light rounded" >
          <div class="container text-center">
            <button type="button"  class="btn-primary btn btn-circle btn-lg" size="sm" @click="addSection">
              <v-icon name="plus" scale="1.5"/>
            </button>
            <p>Añadir Sección</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: "Section",
  components: {
          draggable,
      },
  props:{
    idRow:{
      type:String,
      required:false //por ahora es false, cada seccion debe saber a que fila pertenece
    }
  },
  data: () => ({
    sections: [
    ],
  }),

  methods: {
    addSection () {
      this.sections.push({
        seccion: this.newSection()
      })
    },
    newSection(){
      return {
        name:"",
      }
    },
    deleteSection (idx) {
      this.sections.splice(idx,1)
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
  height:2rem;
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


</style>
