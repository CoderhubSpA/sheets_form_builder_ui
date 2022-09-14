<template>
    <div id="actions-buttons" class="d-flex flex-row justify">
        <ActionComponent v-for="(button, index) in $store.state.acciones_value" :text="button.name"/>
    </div>
</template>

<script>
    import ActionComponent from './ActionComponent.vue'
    export default {
        components: { 
            ActionComponent,
        },
    }
</script>

<style>
.justify{
    justify-content: space-between;
}
</style>