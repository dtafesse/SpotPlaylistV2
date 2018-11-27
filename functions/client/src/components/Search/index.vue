<template>
  <v-container grid-list-md my-5 pt-2>
    <v-alert :value="isError" type="error">{{ `Please Select up to ${selectionLimit} times Only `}}</v-alert>

    <v-content v-if="loading">
      <Loader :width="7" :size="70"/>
    </v-content>

    <v-content v-else>
      <v-container>
        <v-layout row wrap v-if="albums || artists">
          <v-flex sm8>
            <selector :selectedItems="selectedItems" @onRemoveSelected="handleRemoveSelected"/>
          </v-flex>
          <v-flex sm4 v-if="selectedItems.length > 0" mt-4>
            <v-layout justify-end>
              <v-btn @click="onGeneratePlaylist">Generate
                <v-icon color="primary">library_music</v-icon>
              </v-btn>
              <v-btn @click="onClearAll">Clear All
                <v-icon color="red lighten-2">clear</v-icon>
              </v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>

      <router-view></router-view>
    </v-content>
  </v-container>
</template>


<script>
import selector from "../Shared/selector";
import Loader from "../Shared/Loader";
import config from "../../config";

export default {
  name: "searchResults",
  components: {
    selector,
    Loader
  },
  data() {
    return {
      selectionLimit: config.LIMIT
    };
  },
  computed: {
    loading() {
      return this.$store.getters.isLoading;
    },
    isError() {
      let selectedItems = [
        ...this.$store.getters.getSelectedAlbums,
        ...this.$store.getters.getSelectedArtists
      ];

      if (selectedItems) {
        return selectedItems.length > config.LIMIT;
      }
    },
    selectedItems() {
      return [
        ...this.$store.getters.getSelectedAlbums,
        ...this.$store.getters.getSelectedArtists
      ];
    },
    albums() {
      return this.$store.getters.getQueryResult.albums
        ? this.$store.getters.getQueryResult.albums.items
        : null;
    },
    artists() {
      return this.$store.getters.getQueryResult.artists
        ? this.$store.getters.getQueryResult.artists.items
        : null;
    }
  },
  methods: {
    handleRemoveSelected(index) {
      // TODO: figure out possibly using id, wheather to remove from selected artist or albums
      if (this.selectedItems[index].type === "album") {
        let indexInAlbumList = this.$store.getters.getSelectedAlbums.findIndex(
          album => album.id === this.selectedItems[index].id
        );

        this.$store.dispatch("removeItemFromSelectedAlbums", indexInAlbumList);
      } else {
        let indexInArtistList = this.$store.getters.getSelectedArtists.findIndex(
          artist => artist.id === this.selectedItems[index].id
        );

        this.$store.dispatch(
          "removeItemFromSelectedArtists",
          indexInArtistList
        );
      }
    },
    onClearAll() {
      this.$store.dispatch("removeAllSelectedItems");
    },
    onGeneratePlaylist() {
      if (!this.isError) {
        this.$store.dispatch("generatePlaylist");
      }
    }
  }
};
</script>


