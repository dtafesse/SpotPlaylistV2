<template>
  <v-flex xs12>
    <v-container fluid>
      <v-alert
        :value="isError"
        type="error"
      >{{ `Please Select up to ${selectionLimit} times Only `}}</v-alert>
    </v-container>

    <v-layout row wrap>
      <v-flex sm8>
        <selector :selectedItems="selectedArtists" @onRemoveSelected="handleRemoveSelected"/>
      </v-flex>

      <v-flex sm4 v-if="selectedArtists.length > 0" mt-4>
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

    <category
      :type="'Artists'"
      :headerMessage="'Here are your top Artists, generate a playlist based on them?'"
      :items="topArtistsInCurrentPage"
      :selectedItems="selectedArtistIds"
      :size="pageSize"
      :showSeeAllButton="false"
      @onClick="handleOnClick"
    />

    <v-container class="text-xs-center">
      <v-pagination v-model="page" :length="pageLength" :total-visible="6" circle></v-pagination>
    </v-container>
  </v-flex>
</template>

<script>
import category from "../../Shared/category";
import selector from "../../Shared/selector";
import Loader from "../../Shared/Loader";
import config from "../../../config";

export default {
  name: "topArtistsView",
  components: {
    category,
    selector,
    Loader
  },
  data() {
    return {
      page: 1,
      pageSize: 5,
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
    topArtists() {
      return this.$store.getters.getUserSpotifyTopArtists;
    },
    selectedArtists() {
      return this.$store.getters.getSelectedArtists;
    },
    selectedArtistIds() {
      return this.selectedArtists.map(artist => artist.id);
    },
    isError() {
      let selectedItems = this.$store.getters.getSelectedArtists;

      if (selectedItems) {
        return selectedItems.length > config.LIMIT;
      }
    },
    pageLength() {
      if (this.topArtists && this.pageSize) {
        let pageLength = Math.ceil(this.topArtists.length / this.pageSize);

        return pageLength;
      }
      return 0;
    },
    topArtistsInCurrentPage() {
      if (!this.topArtists) return [];
      return this.paginate(this.topArtists, this.pageSize, this.page);
    },
    loading() {
      return this.$store.getters.isLoading;
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

    handleOnClick({ id }) {
      if (this.topArtists && !this.isError) {
        let index = this.topArtists.findIndex(artist => artist.id === id);
        this.$store.dispatch("addToSelectedArtists", this.topArtists[index]);
      }
    },

    handleRemoveSelected(index) {
      this.$store.dispatch("removeItemFromSelectedArtists", index);
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
