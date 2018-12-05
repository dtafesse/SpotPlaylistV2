<template>
  <v-container fluid mt-5>
    <v-layout row wrap v-if="isUserLoggedIn && isSpotifyAccountLinked">

      <v-flex xs12>
        <!-- TODO: insert selected, follow the same steps as in src/componets/Search/index  -->
        <!-- TODO: insert category with type - 'Artists', look inside src/componets/Search/AlbumAndArtist -->
        <!-- Set :showSeeAllButton="false" instead of true -->
        <!-- TODO: uses vuetify paganiation (look up), dived up topArtists into pages, with a page size of 5 for ex -->
        <!-- TODO: for selector component, copy over, replace selectedItems with selectedArtists
            and implement handleRemoveSelected method below, tips there below
        -->
           <v-flex sm8>
                        <selector 
                            :selectedItems="selectedArtists"  
                            @onRemoveSelected="handleRemoveSelected"
                        />
                    </v-flex>
                     <v-flex 
                        sm4
                        v-if="selectedArtists.length > 0"
                    >
                        <v-btn @click="onGeneratePlaylist" >
                            Generate Playlist!
                            <v-icon color="primary">library_music</v-icon>
                        </v-btn>
                        <v-btn @click="onClearAll">
                            Clear All
                            <v-icon color="red lighten-2">clear</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs12 sm6>
                         
                <category  
                    :type="'Top Artists For You'"    
                    :items="topArtists"
                    :selectedItems="selectedArtists"
                    :size="5"
                    :showSeeAllButton="false"
                    @onClick="handleOnClick"
                />
            </v-flex>
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
      let itemToAdd = null;
        itemToAdd = this.topArtists[index];
        this.$store.dispatch("addToSelectedArtists", itemToAdd);
      
    },
  onClearAll() {
      this.$store.dispatch("removeAllSelectedItems");
    },
    onGeneratePlaylist() {
      if (!this.isError) {
        this.$store.dispatch("generatePlaylist");
      }
    },
    handleRemoveSelected(index) {
      // TODO: look inside src/componets/Search/index
      // copy over handleRemoveSelected method, and extra out only
      // the "... dispatch("removeItemFromSelectedArtists", index)"
      // TODO: figure out possibly using id, wheather to remove from selected artist or albums
        let indexInArtistList = this.$store.getters.getSelectedArtists.findIndex(
          artist => artist.id === this.selectedArtists[index].id
        );
        this.$store.dispatch(
          "removeItemFromSelectedArtists",
          indexInArtistList
        );
      }
    }
};
</script>


