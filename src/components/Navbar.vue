<template>
  <div>
    <b-navbar  style="background-color: #4D8D92">
        <b-navbar-nav style="margin-left: 2vh;">
          <b-button class="btn m-1" @click="viewXl" :variant = "view =='xl' ? 'success' : 'dark'">
              <v-icon class="custom-icon" name="laptop"></v-icon>
          </b-button>
          <b-button class="btn m-1" @click="viewMd" :variant = "view =='md' ? 'success' : 'dark'">
              <v-icon class="custom-icon" name="tablet"></v-icon>
          </b-button>
          <b-button class="btn m-1" @click="viewSm" :variant = "view =='sm' ? 'success' : 'dark'">
              <v-icon class="custom-icon" name="mobile"></v-icon>
          </b-button>
        </b-navbar-nav>
        <b-navbar-nav class="justify-content-end" style="margin-right: 3vh;">
          <b-button class="btn btn-success">Guardar</b-button>
        </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import 'bootstrap' 
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
    name: "Navbar",
    computed:{
      view(){
          return this.$store.state.form.current_view
      }
    },
    methods: {
    viewXl(){
      this.$store.state.form.current_view = "xl";
    },
    viewMd(){
      this.$store.state.form.current_view = "md";
    },
    viewSm(){
      this.$store.state.form.current_view = "sm";
    }
  }
}
</script>
