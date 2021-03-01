<template>
    <v-layout align-center justify-center fill-height class="mt-5" >
        <v-progress-circular
            :size="size"
            :width="width"
            color="primary"
            indeterminate
        ></v-progress-circular>
    </v-layout>
</template>

<script>
export default {
    name: 'Loader',
    props: {
        width: Number,
        size: Number
    }
}
</script>

<style scoped>
    
</style>
