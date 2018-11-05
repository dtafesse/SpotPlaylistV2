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
                        <p>
                         <a href='http://localhost:5000/spotplaylist-dev/us-central1/server/api/auth/login'>Log into Spotify</a>  
                        </p>   
                    </v-card-text>                   
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'landing'
}

</script>

<style scoped>
   
</style>

