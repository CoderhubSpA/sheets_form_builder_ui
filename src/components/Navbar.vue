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
          <div style="margin-right: 1em">
            <a v-if="$store.state.api.status_form_url" class="text-white" style="margin-top: 2px"
              :href="$store.state.api.status_form_url"
            >
              Ver formulario generado
            </a>
            <b-spinner v-if="$store.state.api.status_msg.length > 0" variant="info" style="margin-right: 1em">
            </b-spinner>
          </div>
          <b-button class="btn btn-success text-white" @click="$store.dispatch('api/post_form')">Guardar</b-button>
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
