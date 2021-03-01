<template>
  <v-container grid-list-md>
    <v-layout>
      <v-flex xs12 align-center justify-center fill-height>
        <v-list two-line v-if="recentlyGeneratedPlaylists.length > 0">
          <v-subheader>Most Recent Playlists...</v-subheader>
          <v-list-item v-for="(playlist, index) in recentlyGeneratedPlaylistsInCurrentPage" :key="index" ripple class="listItem">
            <v-list-item-content @click="onClickPlaylist(playlist)">
              <v-list-item-title v-html="playlist.playlistName"></v-list-item-title>
              <v-list-item-subtitle v-html="playlist.playlistIds.length + ' songs'"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="error"
                    @click="handleRemovePlaylist(playlist.id)"
                    v-bind="attrs"
                    v-on="on"
                  >delete</v-icon>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <!-- Pagination Template -->
        <v-layout
          align-center
          justify-center
          fill-height
          mt-1
          v-if="recentlyGeneratedPlaylists.length > 0"
        >
          <v-pagination v-model="page" :length="pageLength" :total-visible="6" circle></v-pagination>
        </v-layout>

        <!-- End Pagination Template -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: "recentPlaylists",
  data() {
    return {
      page: 1,
      pageSize: 5
    };
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.getters.user ? true : false;
    },
    loading() {
      return this.$store.getters.isLoading;
    },
    recentlyGeneratedPlaylists() {
      // from latest to oldest, first copy it then reverse it.
      let temp = [...this.$store.getters.getRecentlyGeneratedPlaylist];
      return temp.reverse();
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
    },
    handleRemovePlaylist(id) {
      let index = this.$store.getters.getRecentlyGeneratedPlaylist.findIndex(
        playlist => playlist.id === id
      );

      if (this.isUserLoggedIn) {
        this.$store
          .dispatch("removePlaylistFromFirebasePlaylists", index)
          .then(() =>
            this.$store.dispatch(
              "removePlaylistFromRecentlyGeneratedPlaylists",
              index
            )
          )
          .catch(err => console.log(err));
      } else {
        this.$store.dispatch(
          "removePlaylistFromRecentlyGeneratedPlaylists",
          index
        );
      }
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
