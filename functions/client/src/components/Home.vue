<template>
  <v-app id="container">
    <navBar/>
    <v-main> 
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <nowPlayingBar v-if="this.$store.getters.getCurrentPlaylist"/>
  </v-app>
</template>

<script>
import nowPlayingBar from "./NowPlayingBar/nowPlayingBar";
import navBar from "./NavBar/nav";

export default {
  name: "Home",
  components: {
    nowPlayingBar,
    navBar,
  },
  computed: {
    loading() {
      return this.$store.getters.isLoading;
    },
    isCurrentPlaylist() {
      if (this.$store.getters.getCurrentPlaylist) {
        return true;
      }
      return false;
    },
    error() {
      return this.$store.getters.error;
    }
  },
  created() {
    this.$router.push({ path: "/saved/playlists" });
  }
};
</script>


<style>
  #container {
    background-color: #e9f2f7;
  }
</style>

<style scoped>
  .container {
    padding: 0px 12px;
  }
</style>