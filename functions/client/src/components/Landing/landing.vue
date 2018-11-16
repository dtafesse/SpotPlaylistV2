<template>
    <v-container fluid>
        <v-layout align-center justify-center row wrap fill-height >
            <v-flex xs12 sm6>
                <v-layout v-if="!user">
                    <p> Hello welcome to spot playlist!</p>
                    <router-link to="../saved/playlists">Enter as Guest</router-link>    
                </v-layout>   
                <v-layout v-else>
                    <router-link to="../saved/playlists">Welcome Back!</router-link> 
                </v-layout>
            </v-flex>
            <v-flex xs12 sm6>
                <router-view></router-view>
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

