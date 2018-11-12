<template>
    <v-container fluid>
        <v-layout align-center justify-center row fill-height >
            <v-flex xs12 sm8 md4>
                <v-card class="elevation-12">
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>Sign In</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form @submit.prevent="signIn">
                            <v-text-field v-model="email" prepend-icon="person" name="email" label="Email" type="email" color="primary" required></v-text-field>
                            <v-text-field v-model="password" prepend-icon="lock" name="password" label="Password" id="password" type="password" color="primary" required></v-text-field>
                            <v-layout align-center justify-center>
                                <v-btn @click="navHome" color="primary">Cancel</v-btn>
                                <v-btn type="submit" color="primary">Log In</v-btn>
                            </v-layout>
                        </v-form>
                    </v-card-text>
                    <!-- <v-card-actions>
                        <v-layout align-center justify-center>
                            <v-btn color="primary">Submit</v-btn>
                        </v-layout>
                    </v-card-actions> -->
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'signIn',
    data () {
        return {
            email: '',
            password: ''
        }
    },
    watch: {
        user (value) {
            if (value !== null && value !== undefined) {
                navHome(); 
            }
        }
    },
    methods: {
        signIn () {
            this.$store.dispatch('firebaseSignInUser',{email: this.email, password: this.password});
        },
        navHome() {
            this.$router.push({path: '/'});
        }
    }
}
</script>

<style scoped>
   
</style>


