<template>
  <v-container grid-list-md text-xs-center my-5 pt-2>
    <v-layout row>
      <v-flex xs12 sm6 align-center justify-center fill-height>
        <v-list three-line v-if="recentlyGeneratedPlaylists.length > 0">
          <v-subheader>Recent Playlists...</v-subheader>
          <template v-for="(playlist, index) in recentlyGeneratedPlaylistsInCurrentPage">
            <v-list-tile :key="index" ripple class="listItem" @click="onClickPlaylist(playlist)">
              <v-list-tile-content>
                <v-list-tile-title v-html="playlist.playlistName"></v-list-tile-title>
                <v-list-tile-sub-title v-html="playlist.playlistIds.length + ' songs'"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>

        <v-container class="text-xs-center">
          <v-pagination v-model="page" :length="pageLength" :total-visible="6" circle></v-pagination>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import config from "../../config";

export default {
  name: "recentPlaylists",
  data() {
    return {
      page: 1,
      pageSize: 5
    };
  },
  computed: {
    loading() {
      return this.$store.getters.isLoading;
    },
    recentlyGeneratedPlaylists() {
      return this.$store.getters.getRecentlyGeneratedPlaylist;
    },
    pageLength() {
      if (this.recentlyGeneratedPlaylists && this.pageSize) {
        let pageLength = Math.ceil(
          this.recentlyGeneratedPlaylists.length / this.pageSize
        );

        return pageLength;
      }
      return 0;
    },
    recentlyGeneratedPlaylistsInCurrentPage() {
      if (!this.recentlyGeneratedPlaylists) return [];
      return this.paginate(
        this.recentlyGeneratedPlaylists,
        this.pageSize,
        this.page
      );
    }
  },
  methods: {
    paginate(array, page_size, page_number) {
      --page_number; // because pages logically start with 1, but technically with 0
      return array.slice(
        page_number * page_size,
        (page_number + 1) * page_size
      );
    },
    onClickPlaylist(selectedPlaylist) {
      // set the selecetedPlaylist as the currentPlaylist
      // navigate to playlist page view

      this.$store.dispatch(
        "selectPlaylistFromRecentlyGeneratedPlaylists",
        selectedPlaylist
      );
    }
  }
};
</script>

<style scoped>
.listItem {
  cursor: pointer;
}
.listItem:hover {
  background-color: rgb(228, 231, 234);
}
</style>
