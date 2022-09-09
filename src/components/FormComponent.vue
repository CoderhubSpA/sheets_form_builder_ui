<template>
    <b-container class="border rounded my-5 p-3">
        <b-form-row class="w-100 mx-auto">
            <b-input v-model="name" v-if="editingName" class="text-left w-50"
            @keyup.enter="editingName = false"/>
            <div class="h3 d-inline-block" v-else>{{name}}</div>
            <v-icon class="d-inline-block ml-2 mb-1"
                :name="editingName? 'check': 'pencil-alt'"
                @click="editingName=!editingName"
                style="cursor: pointer"   
            />
            <div class="m-2 y-2">
                <Row/>
            </div>
            
        </b-form-row>
    </b-container>
</template>

<script>
import Row from "./Row.vue";
export default {
    name:"FormComponent",
    components: { 
        Row },
    data(){
        return {
            name:"",
            editingName: false,
        }
    }
}
</script>

<style>

</style>