/* import FormBuilderUi from "../src/components/FormBuilderUi.vue";

export { FormBuilderUi }; */

import FormBuilderUi from '../src/components/FormBuilderUi.vue';
import FormBuilderUiStoreApi from '../src/store/modules/api'
import FormBuilderUiStoreForm from '../src/store/modules/form'
import FormBuilderUiStoreTools from '../src/store/modules/tools'

export default {
  install(Vue, options) {
    if (!options.store) {
      console.error('Se requiere de un store');
    }

    
    Vue.component('form-builder-ui', FormBuilderUi);

    options.store.registerModule('form', FormBuilderUiStoreForm);
    options.store.registerModule('tools', FormBuilderUiStoreTools);
    options.store.registerModule('api', FormBuilderUiStoreApi);
  },
};