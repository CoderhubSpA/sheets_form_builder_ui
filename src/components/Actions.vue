<template>
    <div id="actions-buttons" class="d-flex flex-row justify">
        <ActionComponent v-for="(button, index) in getActionsValues" :text="button.name" :key="index"/>
    </div>
</template>

<script>
    import ActionComponent from './ActionComponent.vue'
    export default {
        components: { 
            ActionComponent,
        },
        computed: {
            // a computed getter
            getActionsValues() {
                for (let column in this.$store.state.api.config)
                {
                    if (column.name == 'Acciones')
                        return this.$store.state.api.config_select[column.id].values
                }

                return [];
            // `this` points to the component instance
        }
  }
    }
</script>

<style>
.justify{
    justify-content: space-between;
}
</style>