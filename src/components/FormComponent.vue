<template>
    <b-container class="border rounded p-3" style="overflow-y: auto;">
        <b-form-row class="w-100 mx-auto">
            <b-input v-model="form.name" v-if="editingName" class="text-left w-50 d-inline-block"
            @keyup.enter="editingName = false"/>
            <div class="h3 d-inline-block" v-else>{{form.name}}</div>
            <v-icon class="d-inline-block ml-2 mb-1"
                :name="editingName? 'check': 'pencil-alt'"
                @click="editingName=!editingName"
                style="cursor: pointer"   
            />
            <div class="m-2 y-2">
                <Row/>
            </div>
            <Actions/>
        </b-form-row>
    </b-container>
</template>

<script>
import Row from "./Row.vue";
import Actions from "./Actions.vue";
export default {
    name:"FormComponent",
    components: { 
        Row,
        Actions,
        },
    computed:{
        form(){
           return this.$store.state.form.form
        }
    },
    data(){
        return {
            name:"Nombre formulario",
            editingName: false,
        }
    },
    methods: {
    },
}
</script>

<style>

</style>