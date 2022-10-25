<template>
  <div>
    <b-navbar  type="dark" variant="dark">
        <b-navbar-nav style="margin-left: 2vh;">
          <b-button class="btn m-1" @click="viewXl" :variant = "view =='xl' ? 'secondary' : 'dark'">
              <v-icon class="custom-icon" name="laptop"></v-icon>
          </b-button>
          <b-button class="btn m-1" @click="viewMd" :variant = "view =='md' ? 'secondary' : 'dark'">
              <v-icon class="custom-icon" name="tablet"></v-icon>
          </b-button>
          <b-button class="btn m-1" @click="viewSm" :variant = "view =='sm' ? 'secondary' : 'dark'">
              <v-icon class="custom-icon" name="mobile"></v-icon>
          </b-button>
        </b-navbar-nav>
        <b-navbar-nav class="justify-content-end" style="margin-right: 3vh;">
          <div v-if="$store.state.api.status_msg.length > 0">
            <b-spinner variant="info" style="margin-right: 2em">
            </b-spinner>
          </div>
          <b-button class="btn btn-success text-white" @click="$store.dispatch('api/postForm')">Guardar</b-button>
        </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import 'bootstrap' 
import 'bootstrap/dist/css/bootstrap.min.css'

export default {
    name: "NavbarComponent",
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
