<template>
     <v-container grid-list-md my-5 pt-2 >
         <v-content v-if="loading">
             <Loader :width="7" :size="70" />
         </v-content>

         <v-content v-else>
             <v-container>
                <v-layout row wrap v-if="albums || artists">
                    <v-flex sm8>
                        <selector 
                            :selectedItems="selectedItems"  
                            @onRemoveSelected="handleRemoveSelected"
                        />
                    </v-flex>
                    <v-flex 
                        sm4
                        v-if="selectedItems.length > 0"
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
                </v-layout>
             </v-container>

           <router-view></router-view>
         </v-content>

     </v-container>

</template>


<script>
import selector from "../Shared/selector";
import Loader from "../Shared/Loader";

export default {
  name: "searchResults",
  components: {
    selector,
    Loader
  },
  computed: {
    loading() {
      return this.$store.getters.isLoading;
    },
    selectedItems() {
      return this.$store.getters.getSelectedItems;
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
      this.$store.dispatch("removeItemFromSelectedItems", index);
    },
    onClearAll() {
      this.$store.dispatch("removeAllSelectedItems");
    },
    onGeneratePlaylist() {
      this.$store.dispatch("generatePlaylist");
    }
  }
};
</script>


