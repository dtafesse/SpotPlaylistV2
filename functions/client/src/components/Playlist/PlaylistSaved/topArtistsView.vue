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

    <v-container class="text-xs-center">
      <!-- Pagination here -->
      <!-- v-pagination .... -->
    </v-container>
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
