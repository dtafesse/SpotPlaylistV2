<template>
    <v-container fluid>
        <v-layout align-center justify-center row fill-height >
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Welcome!</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <p> Hello welcome to spot playlist we are spot playlist</p>
                        <br>
                        <p>
                        <router-link to="../saved/playlists">Enter as Guest</router-link>    
                        </p>
                        <br>
                        <p v-if="!isSpotifyLoggedIn">
                         <button @click="loginSpotify">Log into Spotify</button>  
                        </p>   
                    </v-card-text>                   
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

export default {
    name: 'landing',
    computed: {
        isSpotifyLoggedIn(){
           return this.$store.getters.isSpotifyLoggedIn;
        }
    },
    methods: {
         loginSpotify() {
            this.$store.dispatch("loginSpotify");
         }
    }
}

</script>

<style scoped>
   
</style>

