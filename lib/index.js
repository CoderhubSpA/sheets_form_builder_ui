import FormBuilderUi from '../src/components/FormBuilderUi.vue';
import FormBuilderUiStoreApi from '../src/store/modules/api';
import FormBuilderUiStoreForm from '../src/store/modules/form';
import FormBuilderUiStoreTools from '../src/store/modules/tools';

import Icon from 'vue-awesome/components/Icon';
import Toasted from 'vue-toasted';import 'vue-awesome/icons';
import CustomSlider from 'vue-custom-range-slider';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleInfo, faXmark, faGear, faCircleXmark, faEye } from '@fortawesome/free-solid-svg-icons';

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import "../src/assets/main.css";
import "../src/assets/bootstrap-colors.scss";
import "../src/assets/multiselect.scss";

import "vue-custom-range-slider/dist/vue-custom-range-slider.css";

export default {
  install(Vue, options) {
    if (!options.store) {
      console.error('Se requiere de un store');
    }

    Vue.component('form-builder-ui', FormBuilderUi);
    Vue.component("v-icon", Icon);
    Vue.component("custom-slider", CustomSlider);
    Vue.component("font-awesome-icon", FontAwesomeIcon);

    Vue.use(Toasted, {
      position: "bottom-center",
      duration: 3000,
      class: "toasted-class",
      action: {
        text: "x",
        onClick: (e, toastObject) => {
          toastObject.goAway(0);
        },
      },
    });

    library.add(faCircleInfo, faXmark, faGear, faCircleXmark, faEye);

    options.store.registerModule('form', FormBuilderUiStoreForm);
    options.store.registerModule('tools', FormBuilderUiStoreTools);
    options.store.registerModule('api', FormBuilderUiStoreApi);
  },
};