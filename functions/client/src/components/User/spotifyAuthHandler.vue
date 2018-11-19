<template>
    <v-container grid-list-md my-5 pt-2 >         
        <Loader :width="7" :size="70" />
    </v-container>
</template>
<script>
import queryString from 'query-string';
import Loader from '../Shared/Loader';

export default {
    name: 'spotifyAuthHandler',
    components: {
        Loader
    },
    created(){
        const query = queryString.parse(window.location.search);
        this.$store.dispatch("saveUserSpotAuthTokensToFB", query);
    }
}
</script>
