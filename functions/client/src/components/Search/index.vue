<template>
  <v-container grid-list-md>
    <Loader v-if="loading" :width="7" :size="70"/>

    <div v-else>
      <v-container>
        <v-layout wrap v-if="albums || artists">
          <selectorView v-if="selectedItems && selectedItems.length > 0"/>
        </v-layout>
      </v-container>

      <router-view></router-view>
    </div>
  </v-container>
</template>


<script>
import selectorView from "../Shared/SelectorView";
import Loader from "../Shared/Loader";

export default {
  name: "searchResults",
  components: {
    selectorView,
    Loader
  },
  computed: {
    loading() {
      return this.$store.getters.isLoading;
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
    },
    selectedItems() {
      return [
        ...this.$store.getters.getSelectedAlbums,
        ...this.$store.getters.getSelectedArtists
      ];
    }
  }
};
</script>


<style scoped>
  .container {
    padding: 4px;
  }
</style>