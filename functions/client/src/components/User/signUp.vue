<template>
    <v-container fluid>
        <div v-if="error">
            <Alert @dismissed="onDismissed" :text="error.message"></alert>
        </div>
        <v-card class="elevation-12">
            <v-toolbar dark color="primary">
                <v-toolbar-title>Sign Up</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form @submit.prevent="onSubmit">
                    <v-text-field 
                        v-model="email" 
                        prepend-icon="person" 
                        name="email" 
                        label="Email" 
                        type="email" 
                        color="primary" 
                        required>
                    </v-text-field>
                    <v-text-field 
                        v-model="password" 
                        prepend-icon="lock" 
                        name="password" 
                        label="Password" 
                        id="password" 
                        type="password" 
                        color="primary" 
                        required>
                    </v-text-field>
                    <v-text-field 
                        v-model="confirmPassword" 
                        prepend-icon="lock" 
                        name="confirmPassword" 
                        label="Confirm Password" 
                        id="confirmPassword" 
                        type="password" 
                        color="primary" 
                        :rules="[validatePassword]">
                    </v-text-field>
                        <v-switch
                        label='Link Spotify Account?'
                        v-model="linkSpotify"
                        color="primary"
                    >
                    </v-switch>
                    <v-layout wrap align-center justify-center>
                        <v-btn @click="navHome" color="primary">Cancel</v-btn>
                        <v-btn @click="navSignIn" color="primary">Sign In</v-btn>
                        <v-btn 
                            type="submit" 
                            color="primary" 
                            :disabled="loading || validatePassword != ''" 
                            :loading="loading"
                        >
                            Create Account
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
    name: 'signUp',
    components: {
        Loader,
        Alert
    },
    data () {
        return {
            email: '',
            password: '',
            confirmPassword: '',
            linkSpotify: true
        }
    },
    computed: {
        validatePassword() {
            return this.password !== this.confirmPassword ? 'Entered passwords are not the same' : ''
        },
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
        onSubmit(){
            this.$store.dispatch('firebaseSignUpUser',{
                email: this.email, 
                password: this.password, 
                linkSpotify: this.linkSpotify
            });

        },
        onDismissed () {
            this.$store.dispatch('clearError');
        },
        navHome() {
            this.$router.push({path: '/saved/playlists'});
        },
        navSignIn() {
            this.$router.push({path: '/signin'});
        }
    }
}
</script>

<style scoped>

</style>


