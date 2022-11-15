<template>
  <div class="fieldMenuComponent col-12">
    <div class="card text-center h-100">
      <div class="card-body" style="padding: 0.25em 0.5em">
        <!-- commented fields have a fontawesome icon that doesn't display correctly right now, 
        uncommented fields have a placeholder icon -->
        <b-row>
          <b-col cols="2">
            <v-icon v-if="format == 'CLP'" dense name="dollar-sign"></v-icon>
            <!-- <v-icon v-else-if="format == 'DATE'" dense name="calendar"></v-icon> -->
            <v-icon v-else-if="format == 'DATE'" name="event"></v-icon>
            <v-icon v-else-if="format == 'DATETIME'" name="clock"></v-icon>
            <!-- <v-icon v-else-if="format == 'DATETIME'" dense name="fa-calendar-clock"></v-icon> -->
            <v-icon v-else-if="format == 'DOCUMENT'" dense name="file"></v-icon>
            <v-icon
              v-else-if="format == 'DOCUMENT[EXCEL]'"
              dense
              name="file-excel"
            ></v-icon>
            <v-icon
              v-else-if="format == 'DOCUMENT[IMAGE]'"
              dense
              name="file-image"
            ></v-icon>
            <!-- <v-icon v-else-if="format == 'FORM'" dense name="file"></v-icon> -->
            <v-icon
              v-else-if="format == 'INFO'"
              dense
              name="circle-info"
            ></v-icon>
            <v-icon
              v-else-if="format == 'LATITUDE'"
              dense
              name="location-dot"
            ></v-icon>
            <v-icon
              v-else-if="format == 'LONGITUDE'"
              dense
              name="location-dot"
            ></v-icon>
            <v-icon v-else-if="format == 'MAPA'" dense name="map"></v-icon>
            <!-- <v-icon v-else-if="format == 'NUMBER'" dense class="material-icons" name="numbers"></v-icon> -->
            <!-- <v-icon v-else-if="format == 'NUMBER'" name="input-numeric"></v-icon> -->
            <v-icon v-else-if="format == 'PASSWORD'" dense name="key"></v-icon>
            <v-icon
              v-else-if="format == 'PERCENTAGE'"
              dense
              name="percent"
            ></v-icon>
            <v-icon
              v-else-if="format == 'PERCENTAGE[X100]'"
              dense
              name="percent"
            ></v-icon>
            <v-icon
              v-else-if="format == 'QUESTION'"
              dense
              name="question"
            ></v-icon>
            <v-icon
              v-else-if="format == 'RADIO'"
              dense
              name="radio-button-checked"
            ></v-icon>
            <!-- <v-icon v-else-if="format == 'RADIO'" dense name="circle-dot"></v-icon> -->
            <!-- <v-icon v-else-if="format == 'RESPONSE'" dense name="file"></v-icon> -->
            <v-icon v-else-if="format == 'RUT'" dense name="user"></v-icon>
            <v-icon v-else-if="format == 'SELECTOR'" dense name="list"></v-icon>
            <!-- <v-icon v-else-if="format == 'SELECTOR'" dense name="list-dropdown"></v-icon> -->
            <v-icon
              v-else-if="format == 'SELECTOR[1XN][ALL]'"
              dense
              name="square-check"
            ></v-icon>
            <v-icon
              v-else-if="format == 'SELECTOR[1XN][AVAILABLES]'"
              dense
              name="square-check"
            ></v-icon>
            <v-icon
              v-else-if="format == 'SELECTOR[1XN][ONLYNEW]'"
              dense
              name="square-check"
            ></v-icon>
            <v-icon
              v-else-if="format == 'SELECTOR[IMAGELIST]'"
              dense
              name="square-check"
            ></v-icon>
            <v-icon
              v-else-if="format == 'SELECTOR[MULTIPLE]'"
              name="list"
            ></v-icon>
            <!-- <v-icon v-else-if="format == 'SELECTOR[MULTIPLE]'" dense name="square-check"></v-icon> -->
            <v-icon
              v-else-if="format == 'SELECTOR[MULTIPLE][ADVANCED]'"
              dense
              name="square-check"
            ></v-icon>
            <v-icon
              v-else-if="format == 'SELECTOR[REMOTE]'"
              dense
              name="square-check"
            ></v-icon>
            <v-icon
              v-else-if="format == 'SELECTOR[REMOTE][MULTIPLE]'"
              dense
              name="square-check"
            ></v-icon>
            <v-icon
              v-else-if="format == 'SELECTOR[REMOTE][MULTIPLE][ALL]'"
              dense
              name="square-check"
            ></v-icon>
            <v-icon
              v-else-if="format == 'SiNo'"
              dense
              name="square-check"
            ></v-icon>
            <v-icon v-else-if="format == 'TEXT'" name="edit"></v-icon>
            <!-- <v-icon v-else-if="format == 'TEXT'" name="input-text"></v-icon> -->
            <v-icon
              v-else-if="format == 'TEXT[AREA]'"
              dense
              name="edit"
            ></v-icon>
            <v-icon v-else-if="format == 'URL'" dense name="link"></v-icon>
            <v-icon v-else dense name="file"></v-icon>
          </b-col>
          <b-col>
            <div class="card-title">{{ text }}</div>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FieldMenuComponent",
  props: {
    text: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: false,
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
.fieldMenuComponent {
  color: #000000;

  padding: 5px 10px;
  cursor: pointer;

  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}
</style>
