<template>
  <v-container fluid>
    <v-card class="elevation-12">
      <div v-if="error">
        <Alert @dismissed="onDismissed" :text="error.message"></Alert>
      </div>
      <v-toolbar dark color="primary">
        <v-toolbar-title>Sign In</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form @submit.prevent="signIn">
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
          <v-container>
            <v-layout align-center justify-center column wrap fill-height>
              <v-flex xs12>
                <v-btn type="submit" color="primary" :disabled="loading" :loading="loading">Sign In</v-btn>
              </v-flex>
              <v-flex xs12>
                Don't Have an account?
                <a @click="navSignUp" color="primary">Sign Up</a>
              </v-flex>
              <v-flex xs12 class="guestLink hidden-md-and-up">
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
import Loader from "../Shared/Loader";
import Alert from "../Shared/Alert";

export default {
  name: "signIn",
  components: {
    Loader,
    Alert
  },
  data() {
    return {
      email: "",
      password: ""
    };
  },
  computed: {
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
    signIn() {
      this.$store.dispatch("firebaseSignInUser", {
        email: this.email,
        password: this.password
      });
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    },
    navSignUp() {
      this.$router.push({ path: "/signup" });
    },
    navAsGuest() {
      this.$router.push({ path: "/saved/playlists" });
    }
  }
};
</script>

<style scoped>
.guestLink {
  padding: 5px 0 0 0;
  margin: 0;
  text-align: center;
}
</style>


