<template>
  <div>
    <b-button v-b-toggle="menu_id" class="accordion-button">{{ menu_name }}</b-button>
    <b-collapse visible :id="menu_id">
      <div>
        <b-list-group style="padding: 1em">
          <div v-for="element of [{name: 'Nombre de campo', type: 'text-input'}, {name: 'required', type: 'checkbox'}, {name: 'Unknown', type: 'Unknown'}]" :key="element.name" style="padding: 0.5em">
            <b-list-group-item>
              {{ element }}
            </b-list-group-item>
          </div>
        </b-list-group>
      </div>
    </b-collapse>
  </div>
</template>

<script>

export default {
  name: 'DropdownMenu',
  props: {
    menu_name: {
      type: String,
      required: true,
    },
    menu_id: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
    }
  },
}
</script>