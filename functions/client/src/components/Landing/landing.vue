<template>
    <v-container fluid>
        <v-layout align-center justify-center row fill-height >
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Welcome!</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-layout v-if="!user">
                            <p> Hello welcome to spot playlist!</p>
                            <br>
                           
                            <router-link to="../saved/playlists">Enter as Guest</router-link>    
     
                            <br>
                            <v-btn @click="login" color="primary">Log In!</v-btn>
                            <v-btn @click="signUp" color="primary">Sign Up</v-btn>
                        </v-layout>   
                        <v-layout v-else>
                           <router-link to="../saved/playlists">Welcome Back!</router-link> 
                        </v-layout>
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
        user(){
           return this.$store.getters.user;
        }
    },
    methods: {
         login() {
            this.$router.push('/signin');
         },
         signUp(){
            this.$router.push('/signup');
         }
    }
}

</script>

<style scoped>
   
</style>

