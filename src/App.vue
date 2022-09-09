<template>
  <div id="app" class="container">
    <form>
      <h1>Nombre Formulario</h1>
      <div class="form-row" >
        <div class="row row-cols-1 row-cols-lg-1 g-2 g-lg-3">
          <div class="col">
            <div class="p-3 border-dotted bg-light rounded" v-for="(row, index) in rows" :key="index"> <!-- Hacer el for aquí para que solo se haga ciclo por la fila con el boton -->
              <div class="container text-center">
                <button type="button" v-bind="row.fila" class="btn btn-primary btn-circle btn-xl" @click="addRow">
                  <h1 class="h1-button">+</h1>
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

export default {
  name: "App",
  
  data: () => ({
    rows: [
      {
        fila: ''
      }
    ]
  }),

  methods: {
    addRow () {
      this.rows.push({
        fila: ''
      })
    },
    changeRow (){

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
