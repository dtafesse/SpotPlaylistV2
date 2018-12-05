<template>
  <v-container grid-list-md text-xs-center my-5 pt-2>
    <v-layout row>
      <v-flex xs12 sm6 align-center justify-center fill-height>
        <v-list three-line v-if="recentlyGeneratedPlaylists.length > 0">
          <v-subheader>Recent Playlists...</v-subheader>
          <template v-for="(playlist, index) in recentlyGeneratedPlaylists">
            <v-list-tile :key="index" ripple class="listItem" @click="onClickPlaylist(playlist)">
              <v-list-tile-content>
                <v-list-tile-title v-html="playlist.playlistName"></v-list-tile-title>
                <v-list-tile-sub-title v-html="playlist.playlistIds.length + ' songs'"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "recentPlaylists",

  data() {
    return {
      newPlaylistName: "",
      isTextFieldReadOnly: true,
      playlistNameRules: [v => v.length <= 25 || "Max 25 characters"],
      menuOptions: [{ title: "Replace" }, { title: "Remove" }],
      menuDisabled: false,
      selectedTrackToBeModified: 0,
      alert: false,
      alertType: undefined,
      alertMessage: undefined
    };
  },
  computed: {
    loading() {
      return this.$store.getters.isLoading;
    },
    recentlyGeneratedPlaylists() {
      return this.$store.getters.getRecentlyGeneratedPlaylist;
    }
  },
  methods: {
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
