<template>
    <v-layout>
        <v-flex xs12>
            <v-form @submit.prevent="onSumbit">
                <v-text-field
                    v-model="query"
                    color="white"
                    append-outer-icon="search"
                    @click:append-outer="onSumbit"
                    @input="onInputChange"
                    placeholder="Search ..."
                    clearable
                    @click:clear="clearSearchQuery"
                    autocomplete="off"
                    autocorrect="off"
                    spellcheck="false"
                    @focus="$emit('onHideTitle', true)"
                    @blur="$emit('onHideTitle', false)"
                >            
                </v-text-field>
            </v-form>

        </v-flex>

    </v-layout>
</template>

<script>
import _ from 'lodash';

export default {
    name: 'searchBar',
    data(){
        return{
            query: null,
        }
    },
    methods: {
        onInputChange() {
            if(this.query === ''){
                this.$store.commit('UPDATE_SEARCH_QUERY_CLEAR', true);
                return;
            }

            if(this.query){
                this.$store.commit('UPDATE_SEARCH_QUERY_CLEAR', false);
                this.searchApiRequest(this.query);
                this.$router.push({path: `/search/${this.query}`});
            }
            
        },
        searchApiRequest: _.debounce(function(val) {    
                // this.$store.dispatch('searchArtistId', val);
                this.$store.dispatch('searchForQueryString', val);
            }, 
        300), 
        clearSearchQuery(){
            this.query = null;
            this.$store.commit('UPDATE_SEARCH_QUERY_CLEAR', true);
        },
        onSumbit(){
            this.$store.dispatch('searchForQueryString', this.query);
            this.$router.push({path: `/search/${this.query}`});
        }
    }
}
</script>

