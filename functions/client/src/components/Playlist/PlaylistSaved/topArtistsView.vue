<template>
  <v-container>
    <!-- Change items:topArtists to "topArtistsInCurrentPage" 
          define in the computed aread -  pageLength(), topArtistsInCurrentPage () 
          define in methods - paginate() 
    -->
    <category
      :type="'Artists'"
      :headerMessage="'Here are your top Artists, generate a playlist based on them?'"
      :items="topArtistsInCurrentPage"
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
      
          <v-pagination v-model="page" :length="pageLength" :total-visible="6" circle></v-pagination>
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
    },
    topArtistsInCurrentPage() {
      if (!this.topArtists) return [];
      return this.paginate(
        this.topArtists,
        this.pageSize,
        this.page
      );
    },
    pageLength() {
      if (this.topArtists && this.pageSize) {
        let pageLength = Math.ceil(
          this.topArtists.length / this.pageSize
        );

        return pageLength;
      }
      return 0;
    }
  },
  methods: {
    handleOnClick({ id }) {
      if (this.topArtists && !this.isError) {
        let index = this.topArtists.findIndex(artist => artist.id === id);
        this.$store.dispatch("addToSelectedArtists", this.topArtists[index]);
      }
    },
    paginate(array, page_size, page_number) {
      --page_number; // because pages logically start with 1, but technically with 0
      return array.slice(
        page_number * page_size,
        (page_number + 1) * page_size
      );
    }
  }
};
</script>
