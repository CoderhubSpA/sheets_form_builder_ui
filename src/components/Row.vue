<template>
    <div id="row" class="container">
      <form>
        <div class="form-row" >
          <div class="row row-cols-1 row-cols-lg-1 g-2 g-lg-3">
            <div class="col">
              <draggable>
                <transition-group>
              <div v-for="(row, index) in rows" :key="index">
                <form>
                  <div class="form-group col-md-4">
                    <div class="h3 d-inline-block">{{row.name}}</div>
                    <!-- <b-input v-model="row.name" type="text" class="form-control" placeholder="Nombre Fila"/> -->
                  </div>
                </form>
                <br>
                <div class="p-3 border-solid bg-light rounded container" v-bind="row">
                  <Section :idxRow="index"/>
                  <br>
                </div>
                <hr>
              </div>
            </transition-group>
            </draggable>
              <div class="p-3 border-dotted bg-light rounded" > <!-- Hacer el for aquí para que solo se haga ciclo por la fila con el boton -->
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
    computed:
    {
      rows(){
        return this.$store.state.form.form.rows
      }
    },
    data: () => ({
      // rows: [
        
      // ]
    }),
    mounted(){
      console.log(this.$store.state.form.form)
    },

    methods: {
      addRow () {
        this.rows.push(
           this.newRow()
        )
        // this.$store.commit('form/addRow',{
        //   row: this.newRow()
        // })
      },
      changeRow (){
  
      },
      newRow(){
        return {
          name:"",
          sections:[]
        }
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
  
  .h1-button {
    color: black;
  }
  
  .border-dotted{
   border-style: dotted;
   border-color: #BDBBBB;
  }
  </style>
  