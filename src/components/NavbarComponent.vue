<template>
  <b-navbar type="dark" variant="dark" style="height: 5vh">
    <b-navbar-nav
      style="left: 50%; transform: translateX(-50%); position: fixed"
    >
      <b-button
        class="btn m-1"
        @click="viewXl"
        :variant="view === 'xl' ? 'secondary' : 'dark'"
      >
        <v-icon class="custom-icon" name="laptop"></v-icon>
      </b-button>
      <b-button
        class="btn m-1"
        @click="viewMd"
        :variant="view === 'md' ? 'secondary' : 'dark'"
      >
        <v-icon class="custom-icon" name="tablet"></v-icon>
      </b-button>
      <b-button
        class="btn m-1"
        @click="viewSm"
        :variant="view === 'sm' ? 'secondary' : 'dark'"
      >
        <v-icon class="custom-icon" name="mobile"></v-icon>
      </b-button>
    </b-navbar-nav>
    <b-navbar-nav
      style="left: 99%; transform: translateX(-99%); position: fixed"
    >
      <b-spinner
        v-if="$store.state.api.status_msg.length > 0"
        variant="info"
        style="margin-right: 2em"
      >
      </b-spinner>
      <b-button
        class="btn btn-success text-white"
        v-b-modal="`modal-guardar-formulario`"
        >Guardar</b-button
      >
      <b-modal
          :id="`modal-guardar-formulario`"
          centered
          hide-header
          @ok="$store.dispatch('api/postForm')"
          ok-variant="danger"
          ok-title="Sí, estoy seguro"
          cancel-title="Cancelar"
        >
          <template #default="{ close }">
            <div class="container row justify-content-end">
              <b-button class="btn btn-close" @click="close()"> </b-button>
              <h5 class="text-center">
                ¿Está seguro que desea guardar este formulario?
              </h5>
            </div>
          </template>
        </b-modal>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";

export default {
  name: "NavbarComponent",
  computed: {
    view() {
      return this.$store.state.form.current_view;
    },
  },
  methods: {
    viewXl() {
      this.$store.state.form.current_view = "xl";
    },
    viewMd() {
      this.$store.state.form.current_view = "md";
    },
    viewSm() {
      this.$store.state.form.current_view = "sm";
    },
  },
};
</script>
