<template>
    <v-container grid-list-md my-5 pt-2 >
        <v-layout 
            row wrap  
        >
            <v-flex
                v-for="item in items"
                xs6 sm3
                :key="item.id"
            >
                <v-card flat>
                    <v-avatar 
                        v-bind="{ ['tile']: imageType }"
                        size="150"
                    >
                        <v-img
                            v-if="item.images.length > 0" 
                            :src="item.images[0].url"
                        >
                        </v-img>
                    </v-avatar>
                    <v-card-title class="caption">
                        {{ item.name }}
                    </v-card-title>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>

</template>

<script>
export default {
    name: 'renderAll',
    computed: {
        items(){
            if(this.$route.params.type === "albums"){
                return this.$store.getters.getQueryResult.albums 
                    ? this.$store.getters.getQueryResult.albums.items
                    : null;
            }else{
                return this.$store.getters.getQueryResult.artists
                    ? this.$store.getters.getQueryResult.artists.items
                    : null;
            }
        },
        imageType(){
            if(this.$route.params.type === "albums"){
                return true;
            }else{
                return false;
            }
        }
    }
}
</script>
