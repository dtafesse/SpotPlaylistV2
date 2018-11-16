<template>
    <v-container fluid>
        <v-card class="elevation-12">
            <div v-if="error">
                <Alert @dismissed="onDismissed" :text="error.message"></alert>
            </div>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Sign In</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form @submit.prevent="signIn">
                    <v-text-field v-model="email" prepend-icon="person" name="email" label="Email" type="email" color="primary" required></v-text-field>
                    <v-text-field v-model="password" prepend-icon="lock" name="password" label="Password" id="password" type="password" color="primary" required></v-text-field>
                    <v-layout align-center justify-center>
                        <v-btn @click="navSignUp" color="primary">Sign Up</v-btn>
                        <v-btn type="submit" color="primary" :disabled="loading" :loading="loading">
                            Log In
                        </v-btn>
                    </v-layout>
                </v-form>
            </v-card-text>
        </v-card>       
    </v-container>
</template>

<script>
import Loader from '../Shared/Loader';
import Alert from '../Shared/Alert';

export default {
    name: 'signIn',
    components: {
        Loader,
        Alert
    },
    data () {
        return {
            email: '',
            password: ''
        }
    },
    computed: {
        user() {
            return this.$store.getters.user
        },
        error() {
            return this.$store.getters.error
        },
        loading() {
            return this.$store.getters.isLoading
        }
    },
    watch: {
        user (value) {
            if (value !== null && value !== undefined) {
                this.navHome(); 
            }
        }
    },
    methods: {
        signIn () {
            this.$store.dispatch('firebaseSignInUser',{email: this.email, password: this.password});
        },
        onDismissed () {
            this.$store.dispatch('clearError');
        },
        navSignUp() {
            this.$router.push({path: '/signup'});
        }
    }
}
</script>

<style scoped>
   
</style>


