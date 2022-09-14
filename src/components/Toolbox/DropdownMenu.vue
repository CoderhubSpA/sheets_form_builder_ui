<template>
  <div>
    <b-button v-b-toggle="menu_id" class="accordion-button">{{ menu_name }}</b-button>
    <b-collapse visible :id="menu_id">
      <div v-if="draggable_elements">
        <draggable class="card-deck" style="display:flex; justify-content: flex-start;" group="Campos1">
          <Campo v-for="element in elements" :key="element.name" :text="element.name">
          </Campo>
        </draggable>
      </div>
      <div v-else>
        <b-list-group style="padding: 1em">
          <div v-for="element of elements" :key="element.name" style="padding: 0.5em">
            <label :for="'menu-'+menu_id+'-element-'+element.name">{{ element.name }}</label>

            <!-- v-if else depending on element.type -->
            <b-form-checkbox v-if="element.type=='checkbox'"
              :id="'menu-'+menu_id+'-element-'+element.name">
            </b-form-checkbox>
            <b-form-input v-else-if="element.type=='text-input'"
              :id="'menu-'+menu_id+'-element-'+element.name"
              :type="element.type"
              :placeholder="'Ingresa '+element.name">
            </b-form-input>
            <b-list-group-item v-else>
              {{ element }}
            </b-list-group-item>
          </div>
        </b-list-group>
        <h4>Formulario {{form.name}}</h4>
       
        <div v-for="(row,rindex) of form.rows" :key="rindex">
          <h5 class="p-2">Fila {{rindex+1}}</h5>
          <b-input v-model="row.name" type="text" placeholder="Nombre Fila"/>
          <div v-for="(section,sindex) of row.sections" :key="sindex">
            <h6 class="p-2">Section {{rindex+1}}</h6>
            <b-input v-model="section.name" type="text" placeholder="Nombre Sección"/>
            <b-input v-model="section.cols" type="number"/>
          </div>
        </div>
      </div>

    </b-collapse>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import Campo from './CampoComponent.vue';

export default {
  name: 'DropdownMenu',
  components: {
    Campo,
    draggable,
  },
  props: {
    menu_name: {
      type: String,
      required: true,
    },
    menu_id: {
      type: String,
      required: true,
    },
    elements: {
      type: Array,
      required: true,
    },
    draggable_elements: {
      type: Boolean,
      default: false,
    }
  },
  computed:{
        form(){
           return this.$store.state.form.form
        }
    },
  data() {
    return {
    }
  },
}
</script>