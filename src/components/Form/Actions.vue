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
                return this.$store.state.form.form.config_values[
                    this.$store.state.api.form_config.find(config => config.name === 'Acciones').id
                ];
            }
        }
    }
</script>

<style>
.justify{
    justify-content: space-between;
}
</style>