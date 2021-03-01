<template>
  <v-container fluid>
    <div v-if="error">
      <Alert @dismissed="onDismissed" :text="error.message"></Alert>
    </div>
    <v-card elevation="12">
      <v-toolbar color="primary">
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
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            prepend-icon="lock"
            name="password"
            label="Password"
            id="password"
            type="password"
            color="primary"
            required
          ></v-text-field>
          <v-text-field
            v-model="confirmPassword"
            prepend-icon="lock"
            name="confirmPassword"
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            color="primary"
            :rules="[validatePassword]"
          ></v-text-field>
          <v-switch label="Link Spotify Account?" v-model="linkSpotify" color="primary"></v-switch>
          <v-container>
            <v-layout align-center justify-center column wrap fill-height>
              <v-flex xs12>
                <v-btn
                  type="submit"
                  color="primary"
                  :disabled="loading || validatePassword != ''"
                  :loading="loading"
                >Create Account</v-btn>
              </v-flex>
              <v-flex xs12>
                Have an account?
                <a @click="navSignIn" color="primary">Sign In</a>
              </v-flex>
              <v-flex xs12>
                Otherwise, Continue As
                <a @click="navAsGuest" color="primary">Guest</a>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Alert from "../Shared/Alert";

export default {
  name: "signUp",
  components: {
    Alert
  },
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      linkSpotify: true
    };
  },
  computed: {
    validatePassword() {
      return this.password !== this.confirmPassword
        ? "Entered passwords are not the same"
        : "";
    },
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.isLoading;
    }
  },
  methods: {
    onSubmit() {
      this.$store.dispatch("firebaseSignUpUser", {
        email: this.email,
        password: this.password,
        linkSpotify: this.linkSpotify
      });
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    },
    navSignIn() {
      this.$router.push({ path: "/signin" });
    },
    navAsGuest() {
      this.$router.push({ path: "/saved/playlists" });
    }
  }
};
</script>



