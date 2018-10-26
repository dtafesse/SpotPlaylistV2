<template>
     <v-container grid-list-md my-5 pt-2 >
         <v-content v-if="loading">
             <Loader :width="7" :size="70" />
         </v-content>

         <v-content v-else>
             <v-container>
                <v-layout row wrap v-if="albums || artists">
                    <v-flex sm8>
                        <v-chip
                            v-if="selectedItems"
                            v-for="(item, index) in selectedItems"
                            :key="index"
                            close
                            label 
                            class="chip--select-multi"
                            @input="removeSelected(index)" 
                        >
                        <v-avatar>
                            <img 
                                v-if="item.images.length > 0" 
                                :src="item.images[0].url"
                            >
                            <v-icon v-else > 
                                {{ 'person_outline' }} 
                            </v-icon>
                        </v-avatar>    
                        {{ item.name }}
                        </v-chip>
                    </v-flex>
                    <v-flex 
                        sm4
                        v-if="selectedItems.length > 0"
                    >
                        <v-btn @click="onGeneratePlaylist" >
                            Generate Playlist!
                            <v-icon color="primary">library_music</v-icon>
                        </v-btn>
                        <v-btn @click="onClearAll">
                            Clear All
                            <v-icon color="red lighten-2">clear</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
             </v-container>

           <router-view></router-view>
         </v-content>

     </v-container>

</template>


<script>
import category from './category';
import Loader from '../Shared/Loader';

export default {
    name: 'searchResults',
    components: {
        category,
        Loader
    },
    computed: {
        loading(){
            return this.$store.getters.isLoading;
        },
        selectedItems(){
            return this.$store.getters.getSelectedItems;
        },
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
        removeSelected(index){
            this.$store.dispatch('removeItemFromSelectedItems', index);
        },
        onClearAll(){
            this.$store.dispatch('removeAllSelectedItems');
        },
        onGeneratePlaylist(){
            console.log('generate playlist');
        }
    }
}
</script>


