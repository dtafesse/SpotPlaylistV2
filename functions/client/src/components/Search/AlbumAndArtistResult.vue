<template>
    <v-layout>
        <category  
            :type="'Albums'"    
            :items="albums"
            :size="5"
            @onClick="handleOnClick"
            @onShowAllClick="handleShowAllChick"
        />

        <category  
            :type="'Artists'"    
            :items="artists"
            :size="5"
            @onClick="handleOnClick"
            @onShowAllClick="handleShowAllChick"
        />
    </v-layout>
</template>


<script>
import category from './category';

export default {
    name: 'albumAndArtistResult',
    components: {
        category
    },
    computed: {
        albums(){
            return this.$store.getters.getQueryResult.albums 
                ? this.$store.getters.getQueryResult.albums.items
                : null;
        },
        artists(){
            return this.$store.getters.getQueryResult.artists
                ? this.$store.getters.getQueryResult.artists.items
                : null;
        },
    },
    methods: {
        handleOnClick(selectedObj){
            if(selectedObj.type === 'Album'){
                 console.log('album index: ', selectedObj.index);
            }else{
                console.log('artist index: ', selectedObj.index);
            }
        },
        handleShowAllChick(type){
            if(type === "Album"){
                this.$router.push({path: `/search/${this.$route.params.query}/all/${type.toLowerCase()}`});
            }else{
                this.$router.push({path: `/search/${this.$route.params.query}/all/${type.toLowerCase()}`});
            }
        }
    }
}
</script>
