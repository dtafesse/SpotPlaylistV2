<template>
    <div>
        Please wait...
    </div>
</template>
<script>
export default {
    name: 'spotifyAuthHandler',
    created(){
        this.$store.dispatch("finalizeSpotifyLogin", window.location.search);
    }
}
</script>
