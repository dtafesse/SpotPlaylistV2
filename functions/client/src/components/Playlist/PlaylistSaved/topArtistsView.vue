<template>
  <v-container>
    <!-- Change items:topArtists to "topArtistsInCurrentPage" 
          define in the computed aread -  pageLength(), topArtistsInCurrentPage () 
          define in methods - paginate() 
    -->
    <category
      :type="'Artists'"
      :headerMessage="'Here are your top Artists, generate a playlist based on them?'"
      :items="topArtists"
      :selectedItems="selectedArtistIds"
      :size="pageSize"
      :showSeeAllButton="false"
      @onClick="handleOnClick"
    />

    <v-layout
      row
      align-center
      justify-center
      fill-height
      mt-1
      v-if="topArtists && topArtists.length > 0"
    >
      <!-- Pagination here -->
      <!-- v-pagination .... -->
    </v-layout>
  </v-container>
</template>

<script>
import category from "../../Shared/category";
import Loader from "../../Shared/Loader";

export default {
  name: "topArtistsView",
  components: {
    category,
    Loader
  },
  data() {
    return {
      page: 1,
      pageSize: 5
    };
  },
  computed: {
    topArtists() {
      return this.$store.getters.getUserSpotifyTopArtists;
    },
    selectedArtistIds() {
      return this.$store.getters.getSelectedArtists.map(artist => artist.id);
    }
  },
  methods: {
    handleOnClick({ id }) {
      if (this.topArtists && !this.isError) {
        let index = this.topArtists.findIndex(artist => artist.id === id);
        this.$store.dispatch("addToSelectedArtists", this.topArtists[index]);
      }
    }
  }
};
</script>
