<template>
  <div>
    <b-button v-b-toggle="menu_id" class="btn btn-toggle align-items-center rounded collapsed menu-button">{{ menu_name }}</b-button>
    <b-collapse visible :id="menu_id">
      <div>
        <draggable class="card-deck row" style="display:flex; margin: 5px 0 5px 0;" :group="{name: 'Fields', pull: true, put: false}" :list="$store.state.tools.fields" :clone="cloneAction">
          <Campo v-for="(element, index) in $store.state.tools.fields" :key="element.name" :text="element.name">
          </Campo>
        </draggable>
      </div>
    </b-collapse>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import multiselect from 'vue-multiselect';
import Campo from './CampoComponent.vue';

export default {
  name: 'FieldsDropdownMenu',
  components: {
    Campo,
    draggable,
    multiselect,
  },
  props: {
    menu_name: {
      type: String,
      required: false,
    },
    menu_id: {
      type: String,
      required: false,
    },
    draggable_elements: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      field_n: 0
    }
  },
  methods: {
    cloneAction(item) {
      console.log('cloned', item)
      let element = {
        name: item.name,
        index: this.field_n,
        idxRow: -1,
        idxSection: -1,
        field_type: item.name,
        field_type_text: item.name,
        required: false,
        description: "", 
        show:false,
        colSm:12,
        colMd:12,
        colXl:12,
      };
      this.field_n += 1;
      return element;
    }
  }
}
</script>

<style>

  .btn-toggle {
    width: 100%;
    display: inline-flex;
    align-items: center;
    padding: .25rem .5rem;
    font-weight: 600;
    color: rgba(0, 0, 0, .65);
    background-color: transparent;
    border: 0;
  }
  .btn-toggle:hover,
  .btn-toggle:focus {
    color: rgba(0, 0, 0, .85);
  }
  
  .btn-toggle::before {
    width: 1.25em;
    line-height: 0;
    content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
    transition: transform .35s ease;
    transform-origin: .5em 50%;
  }
  
  .btn-toggle[aria-expanded="true"] {
    color: rgba(0, 0, 0, .85);
  }
  .btn-toggle[aria-expanded="true"]::before {
    transform: rotate(90deg);
  }

  .menu-button{
    font-size: 20pt !important;
  }
</style>