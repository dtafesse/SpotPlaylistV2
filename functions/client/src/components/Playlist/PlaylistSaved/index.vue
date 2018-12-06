<template>
  <v-container grid-list-md>
    <v-container v-if="loading">
      <Loader :width="7" :size="70"/>
    </v-container>

    <v-container mb-5 v-else>
      <v-layout row wrap>
        <selectorView v-if="isSpotifyAccountLinked"/>
        <v-flex xs12 sm6 v-if="isSpotifyAccountLinked">
          <top-artists-view/>
        </v-flex>
        <v-flex xs12 sm6 v-bind="{ ['sm12']: !isSpotifyAccountLinked }">
          <recent-playlists/>
        </v-flex>
        <new-album-releases/>
        <featured-playlists/>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import topArtistsView from "./topArtistsView";
import selectorView from "../../Shared/SelectorView";
import recentPlaylists from "./recentPlaylists";
import featuredPlaylists from "./featuredPlaylists";
import newAlbumReleases from "./newAlbumReleases";
import Loader from "../../Shared/Loader";
import config from "../../../config";

export default {
  name: "playlistSaved",
  components: {
    topArtistsView,
    recentPlaylists,
    featuredPlaylists,
    newAlbumReleases,
    selectorView,
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
  created() {
    this.$store.dispatch("fetchFeaturedPlaylists");
    this.$store.dispatch("fetchNewReleasedAlbums");
  }
};
</script>


