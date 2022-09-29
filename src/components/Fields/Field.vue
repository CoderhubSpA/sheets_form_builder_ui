<template>
  <div class="form-group">
    <draggable class="card-deck" :list="sections[idxSection].fields" group="Fields" @change="onChange">
      <transition-group tag="b-row" class="sections">
      <b-form-row style="margin-bottom: 15px; background-color: lightgray; border-radius: 5px; padding: 8px;" v-for="(field, fieldIdx) in sections[idxSection].fields" :key="field.index" :id="`section-${idxSection}-field-${fieldIdx}`" class="form-group">
        <div class="flex"  @mouseover="field.show=true" @mouseleave="field.show = false">
          <div class="form-group col-12">
            <div style="text-align: left !important; margin-bottom: 5px;"

            >
              <i>{{field.field_type_text}}</i>
              <button type="button" v-if="field.show" style="float:right" class="close-rounded badge border border-light bg-danger p-2" @click="deleteField(fieldIdx)">x</button> 
              <button type="button" v-if="field.show" style="float:right" class="close-rounded badge border border-light bg-info p-2" @click="openFieldConfig(field)">
                <v-icon class="d-inline-block ml-2 mb-1" :dark="true" name="cog"/>
              </button>            
            </div>
            <b-input v-model="field.name" type="text" class="form-control" placeholder="Nombre campo"/>
          </div>
         <!-- ඞ -->
        </div>
      </b-form-row>
      </transition-group>
    </draggable>
  </div>
</template>
    
<script>
import draggable from 'vuedraggable'

export default {
  name: "Field",
  components: {
    draggable
  },
  props:{
    name: {
      type: String,
      required: false
    },
    idxRow:{
      type:Number,
      required:true
    },
    idxSection: {
      type: Number,
      required: true
    }
  },
  computed: {
    sections() {
      return this.$store.state.form.form.rows[this.idxRow].sections;
    },
    fields() {
      return this.$store.state.form.form.rows[this.idxRow].sections[this.idxSection].fields;
    }
  },
  data: () => ({
  }),
  methods: {
    addField() {
      this.fields.push(this.newField());
    },
    deleteField(index) {
      if (this.$store.state.form.current_field_config?.index == this.fields[index].index) {
        this.$store.state.form.current_field_config = null;
      }
      this.fields.splice(index, 1);
    },
    newField() {
      return {
        index: this.fields.length,
        name: "",
        idxRow: -1,
        idxSection: -1,
        description:"",
      };
    },
    onChange(event) {
      console.log("change", event)
      if (event.added) {
        console.log("add");
        event.added.element.idxRow = this.idxRow;
        event.added.element.idxSection = this.idxSection;
      } else if (event.moved) {
        console.log("move");
      } else if (event.deleted) {
        console.log("delete");
      }
    },
    openFieldConfig(newField) {
      this.$store.state.form.current_section_config = null
      this.$store.state.form.current_form_config = null
      this.$store.state.form.current_row_config = null
      this.$store.state.form.current_field_config = newField
    }
  }
};
</script>
  
<style>

.btn-circle.btn-lg {
  width: 55px;
  height: 55px;
  padding: 10px 16px;
  border-radius: 35px;
  font-size: 12px;
  text-align: center;
  background: #008A94;
}

.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
  background-color: #008A94 !important;
}

.h1-button {
  color: black;
}

.border-dotted{
  border-style: dotted;
  border-color: #BDBBBB;
}

.flex {
  display: flex;
  justify-content: space-between;
  text-align: right;
}

.close-rounded{
  width: 2rem; 
  height:2rem;
}
</style>
