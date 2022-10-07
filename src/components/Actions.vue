<template>
    <div id="actions-buttons" class="row justify-content-md-center">
        <ActionComponent v-for="(button, index) in getAction" :text="button.name" :key="index"/>
    </div>
</template>

<script>
    import ActionComponent from './ActionComponent.vue'
    export default {
        components: { 
            ActionComponent,
        },
        data() {
            return {
                actions: [],
            }
        },
        computed: {
            getAction() {
                return this.$store.state.api.actions
            }
        }
    }
</script>

<style>
.justify{
    justify-content: space-between;
}
</style>