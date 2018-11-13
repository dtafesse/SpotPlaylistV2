<template>
    <v-alert error dismissible @input="closeAlert" :value=true> 
        {{text}}
    </v-alert>
</template>

<script>
    export default {
        name:"Alert",
        props: ['text'],
        methods: {
            closeAlert() {
                this.$emit('dismissed')
            }
        }
    }
</script>
