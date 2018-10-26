<template>
     <v-container grid-list-md my-5 pt-2 >
         <v-content v-if="loading">
             <Loader :width="7" :size="70" />
         </v-content>

         <v-content v-else>
            <v-layout row>
                <v-flex xs12>
                    Selected
                </v-flex>
            </v-layout>
            
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
        }
    }
}
</script>


