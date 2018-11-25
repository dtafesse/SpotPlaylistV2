<template>
    <v-container fluid mt-5>
        <v-layout row wrap v-if="isUserLoggedIn && isSpotifyAccountLinked">
            <v-flex xs12 sm6>
                <!-- TODO: insert selected, follow the same steps as in src/componets/Search/index  -->
                <!-- TODO: insert category with type - 'Artists', look inside src/componets/Search/AlbumAndArtist -->
                <!-- Set :showSeeAllButton="false" instead of true -->
                <!-- TODO: uses vuetify paganiation (look up), dived up topArtists into pages, with a page size of 5 for ex -->
            
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 align-center justify-center fill-height>
                Previously listened to..
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import category from "../Shared/category";
import selector from "../Shared/selector";

export default {
  name: "playlistSaved",
  components: {
    category,
    selector
  },
  data() {
    return {
      selectedItemsIds: [],
      page: 1
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
    }
  },
  methods: {
    handleOnClick() {
      // TODO: look inside src/componets/Search/AlbumAndArtist
      // exact implementaion pretty much the same except
      // ignore the first if statment since there are no albums
      // and replace '(this.artist)' with '(this.topArtists)'
      // dispatch call is exactly the same
    },
    handleShowAllChick() {
      // TODO: not needed here, since pagination will be used.. delete after seeing this
    }
  }
};
</script>


