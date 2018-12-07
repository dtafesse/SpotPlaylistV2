<template>
  <v-app id="container">
    <navBar/>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
        <nowPlayingBar v-if="this.$store.getters.getCurrentPlaylist"/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import landingPage from "./Landing/landing";
import nowPlayingBar from "./NowPlayingBar/nowPlayingBar";
import navBar from "./NavBar/nav";
import Loader from "./Shared/Loader";
import Alert from "./Shared/Alert";

export default {
  name: "Home",
  components: {
    nowPlayingBar,
    navBar,
    Loader,
    landingPage,
    Alert
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
