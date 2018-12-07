<template>
  <v-container>
    <v-alert
      v-if="isError"
      :value="isError"
      type="error"
    >{{ `Please Select up to ${selectionLimit} times Only `}}</v-alert>

    <v-layout row wrap>
      <v-flex sm8>
        <selector :selectedItems="selectedItems" @onRemoveSelected="handleRemoveSelected"/>
      </v-flex>

      <v-flex sm4 v-if="selectedItems.length > 0" mt-4>
        <v-layout row align-center justify-end>
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
</template>

<script>
import selector from "./selector";
import config from "../../config";

export default {
  name: "selectorView",
  components: {
    selector
  },
  data() {
    return {
      selectionLimit: config.LIMIT
    };
  },
  computed: {
    isError() {
      if (this.selectedItems) {
        return this.selectedItems.length > config.LIMIT;
      }
    },
    selectedItems() {
      return [
        ...this.$store.getters.getSelectedAlbums,
        ...this.$store.getters.getSelectedArtists
      ];
    }
  },
  methods: {
    handleRemoveSelected(index) {
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
