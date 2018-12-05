<template>
  <v-container grid-list-md>
    <v-container v-if="loading">
      <Loader :width="7" :size="70"/>
    </v-container>

    <v-container v-else mb-5>
      <v-layout row wrap v-if="isUserLoggedIn && isSpotifyAccountLinked">
        <top-artists-selection/>
        <v-flex xs12 sm6>
          <top-artists-view/>
        </v-flex>
        <v-flex xs12 sm6>
          <recent-playlists/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import topArtistsView from "./topArtistsView";
import topArtistsSelection from "./topArtistsSelection";
import recentPlaylists from "./recentPlaylists";
import Loader from "../../Shared/Loader";
import config from "../../../config";

export default {
  name: "playlistSaved",
  components: {
    topArtistsView,
    recentPlaylists,
    topArtistsSelection,
    Loader
  },
  data() {
    return {
      selectionLimit: config.LIMIT
    };
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.getters.user ? true : false;
    },
    isSpotifyAccountLinked() {
      return this.$store.getters.isSpotifyLoggedIn;
    },
    isError() {
      let selectedItems = this.$store.getters.getSelectedArtists;

      if (selectedItems) {
        return selectedItems.length > config.LIMIT;
      }
    },
    loading() {
      return this.$store.getters.isLoading;
    }
  },
  methods: {}
};
</script>


