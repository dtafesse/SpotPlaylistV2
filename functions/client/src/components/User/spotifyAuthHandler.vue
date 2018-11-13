<template>
    <div>
        Please wait...
    </div>
</template>
<script>
import queryString from 'query-string';

export default {
    name: 'spotifyAuthHandler',
    created(){
        const query = queryString.parse(window.location.search);
        this.$store.dispatch("finalizeSpotifyLogin", query);
    }
}
</script>
