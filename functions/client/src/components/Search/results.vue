<template>
     <v-container grid-list-md my-5 pt-2 >
        <v-layout row>
            <v-flex xs12>
                Selected
            </v-flex>
        </v-layout>
        <v-layout>
            <renderItem  
                :type="'Albums'"    
                :items="albums"
                :size="5"
                @onClick="handleOnClick"
            />

            <renderItem  
                :type="'Artists'"    
                :items="artists"
                :size="5"
                @onClick="handleOnClick"
            />
        </v-layout>
     </v-container>

</template>


<script>
import renderItem from './renderSection';

export default {
    name: 'searchResults',
    components: {
        renderItem
    },
    computed: {
        albums(){
            // const albums = this.$store.getters.getQueryResult;
            // if(albums.items){
            //     if(albums.items.length > 5){
            //         // show more album button 
            //         return albums.items.slice(0, 5);

            //     }else{
            //         return albums.items;
            //     }
            // }else{
            //     return null;
            // }

            return this.$store.getters.getQueryResult.albums 
                ? this.$store.getters.getQueryResult.albums.items
                : null;
        },
        artists(){
            return this.$store.getters.getQueryResult.artists
                ? this.$store.getters.getQueryResult.artists.items
                : null;
        }
    },
    methods: {
        handleOnClick(selectedObj){
            if(selectedObj.type === 'Album'){
                 console.log('album index: ', selectedObj.index);
            }else{
                console.log('artist index: ', selectedObj.index);
            }
        }
    }
}
</script>
