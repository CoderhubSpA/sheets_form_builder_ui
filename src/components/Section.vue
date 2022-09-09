<template>
        <div class="form-row" >
          <div class="row row-cols-1 row-cols-lg-1 g-2 g-lg-3">
            <div class="col">
              <div v-for="(section, index) in section" :key="index">
                <form>
                  <div class="form-group col-md-4">
                    <input type="text" class="form-control" placeholder="Nombre Sección">
                  </div>
                </form>
                <br>
                <div class="p-3 border-solid bg-light rounded container" v-bind="section.seccion">
                  <br>
                </div>
                <hr>
              </div>
              <div class="p-3 border-dotted bg-light rounded" > <!-- Hacer el for aquí para que solo se haga ciclo por la fila con el boton -->
                <div class="container text-center">
                  <button type="button"  class="btn btn-primary btn-circle btn-xl" @click="addSection">
                    <h1 class="h1-button">+</h1>
                  </button>
                  <p>Añadir Sección</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  </template>
  
  <script>
  
  export default {
    name: "Section",
    
    data: () => ({
      section: [
        
      ]
    }),
  
    methods: {
      addSection () {
        this.section.push({
          seccion: ''
        })
      },
      changeSection (){
  
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
  