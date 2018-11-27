<template>
  <v-container fluid mt-5>
    <v-layout row wrap v-if="isUserLoggedIn && isSpotifyAccountLinked">
      <v-alert
        :value="isError"
        type="error"
      >{{ `Please Select up to ${selectionLimit} times Only `}}</v-alert>

      <v-flex xs12>
        <!-- TODO: insert selected, follow the same steps as in src/componets/Search/index  -->
        <!-- TODO: insert category with type - 'Artists', look inside src/componets/Search/AlbumAndArtist -->
        <!-- Set :showSeeAllButton="false" instead of true -->
        <!-- TODO: uses vuetify paganiation (look up), dived up topArtists into pages, with a page size of 5 for ex -->
        <!-- TODO: for selector component, copy over, replace selectedItems with selectedArtists
            and implement handleRemoveSelected method below, tips there below
        -->
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 align-center justify-center fill-height>Previously listened to..</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import category from "../Shared/category";
import selector from "../Shared/selector";
import config from "../../config";

export default {
  name: "playlistSaved",
  components: {
    category,
    selector
  },
  data() {
    return {
      selectedItemsIds: [],
      page: 1,
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
    isError() {
      let selectedItems = this.$store.getters.getSelectedArtists;

      if (selectedItems) {
        return selectedItems.length > config.LIMIT;
      }
    }
  },
  methods: {
    handleOnClick({ index }) {
      if (this.topArtists) {
        let itemToAdd = this.topArtists[index];
        this.$store.dispatch("addToSelectedArtists", itemToAdd);
      }
    },

    handleShowAllClick() {
      // TODO: not needed here, since pagination will be used.. delete after seeing this
      // delete the :onShowAllClick=handleShowAllClick" from "category" component
    },

    handleRemoveSelected(index) {
      // TODO: look inside src/componets/Search/index
      // copy over handleRemoveSelected method, and extra out only
      // the "... dispatch("removeItemFromSelectedArtists", index)"
    }
  }
};
</script>


