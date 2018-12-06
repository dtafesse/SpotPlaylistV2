<template>
  <v-container fluid>
    <v-layout align-center justify-center row wrap fill-height>
      <v-flex xs12 sm6>
        <v-layout wrap ml-5>
          <v-flex xs12>
            <p>Hello welcome to spot playlist!</p>
          </v-flex>

          <v-flex xs12>
            <v-btn color="primary" to="/saved/playlists">Enter as Guest</v-btn>
          </v-flex>
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
  name: "landing",
  methods: {
    login() {
      this.$router.push("/signin");
    },
    signUp() {
      this.$router.push("/signup");
    }
  }
};
</script>

<style scoped>
</style>

