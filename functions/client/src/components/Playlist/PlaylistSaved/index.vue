<template>
  <v-container grid-list-md>
    <v-container v-if="loading">
      <Loader :width="7" :size="70"/>
    </v-container>

    <v-container v-else>
      <v-layout row wrap v-if="isUserLoggedIn && isSpotifyAccountLinked">
        <topArtistsView/>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 align-center justify-center fill-height>Previously listened to..</v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import topArtistsView from "./topArtistsView";
import Loader from "../../Shared/Loader";
import config from "../../../config";

export default {
  name: "playlistSaved",
  components: {
    topArtistsView,
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


