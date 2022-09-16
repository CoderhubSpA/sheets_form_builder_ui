<template>
  <div id="row" class="container">
    <form>
      <div class="form-row" >
        <div class="row row-cols-1 row-cols-lg-1 g-2 g-lg-3">
          <div class="col">
            <draggable v-model="rows"
              :animation="200"
              ghost-class="moving-section">
              <transition-group>
                <div v-for="(row, index) in rows" :key="row" :id="`row-${index}`" class="cursor-move">
                <form>
                  <div class="form-group col-md-4 flex">
                    <input type="text" class="form-control" placeholder="Nombre Fila">
                    <button type="button" class="btn btn-danger btn-sm delete" @click="deleteRow(index)"> 
                      <v-icon class="custom-icon" name="trash"></v-icon>
                    </button>
                  </div>
                </form>
              <br>
              <div class="p-3 border-solid bg-light rounded container" v-bind="row">
                <Section/>
                <br>
              </div>
              <hr>
            </div>
          </transition-group>
          </draggable>
            <div class="p-3 border-dotted bg-light rounded" >
              <div class="container text-center">
                <button type="button"  class="btn btn-primary btn-circle btn-xl" @click="addRow">
                  <v-icon name="plus" scale="2"/>
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

  data: () => ({
    rows: [
    ]
  }),


  methods: {
    addRow () {
      this.rows.push({
        row: this.newRow()
      })
    },
    newRow (){
      return {
        name:"",
      }
    },
    deleteRow (idx) {
      console.log(idx)
      this.rows.splice(idx,1)
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
