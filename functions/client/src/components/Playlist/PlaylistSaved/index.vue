<template>
  <v-container grid-list-md>
    <v-container v-if="loading">
      <Loader :width="7" :size="70"/>
    </v-container>

    <v-container mb-5 v-else>
      <v-layout wrap>
        <selectorView v-if="selectedItems && selectedItems.length > 0"/>
        <v-flex
          xs12
          sm6
          v-if="isSpotifyAccountLinked"
          v-bind="{ ['sm12']: recentlyGeneratedPlaylist.length === 0 }"
        >
          <top-artists-view v-if="topArtists && topArtists.length > 0"/>
        </v-flex>
        <v-flex xs12 sm6 v-bind="{ ['sm12']: !isSpotifyAccountLinked }">
          <recent-playlists
            v-if="recentlyGeneratedPlaylists && recentlyGeneratedPlaylists.length >0"
          />
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
      return false;
    },
    loading() {
      return this.$store.getters.isLoading;
    },
    recentlyGeneratedPlaylist() {
      return this.$store.getters.getRecentlyGeneratedPlaylist;
    },
    selectedItems() {
      return [
        ...this.$store.getters.getSelectedAlbums,
        ...this.$store.getters.getSelectedArtists
      ];
    },
    topArtists() {
      return this.$store.getters.getUserSpotifyTopArtists;
    },
    recentlyGeneratedPlaylists() {
      return this.$store.getters.getRecentlyGeneratedPlaylist;
    }
  },
  created() {
    this.$store.dispatch("fetchFeaturedPlaylists");
    this.$store.dispatch("fetchNewReleasedAlbums");
  }
};
</script>


