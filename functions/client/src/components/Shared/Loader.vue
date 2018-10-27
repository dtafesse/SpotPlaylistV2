<template>
    <v-layout align-center justify-center row fill-height >
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
    name: 'loader',
    props: {
        width: Number,
        size: Number
    }
}
</script>

<style scoped>
    
</style>
