<template>
  <v-container v-if="albums || artists">
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <category
          :type="'Albums'"
          :headerMessage="'Albums'"
          :items="albums"
          :selectedItems="selectedItemsIds"
          :size="5"
          :showSeeAllButton="true"
          @onClick="handleOnClick"
          @onShowAllClick="handleShowAllChick"
        />
      </v-flex>
      <v-flex xs12 sm6>
        <category
          :type="'Artists'"
          :headerMessage="'Artists'"
          :items="artists"
          :selectedItems="selectedItemsIds"
          :size="5"
          :showSeeAllButton="true"
          @onClick="handleOnClick"
          @onShowAllClick="handleShowAllChick"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
import category from "../Shared/category";

export default {
  name: "albumAndArtistResult",
  components: {
    category
  },
  computed: {
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
    selectedItemsIds() {
      let selectedItems = [
        ...this.$store.getters.getSelectedAlbums,
        ...this.$store.getters.getSelectedArtists
      ];

      let selectedIds = [];
      if (selectedItems) {
        selectedItems.forEach(item => {
          selectedIds.push(item.id);
        });
        return selectedIds;
      } else {
        return null;
      }
    }
  },
  methods: {
    handleOnClick(selectedItem) {
      let itemToAdd = null;
      if (selectedItem.type === "albums") {
        if (this.albums) {
          itemToAdd = this.albums[selectedItem.index];
          this.$store.dispatch("addToSelectedAlbums", itemToAdd);
        }
      } else {
        if (this.artists) {
          itemToAdd = this.artists[selectedItem.index];
          this.$store.dispatch("addToSelectedArtists", itemToAdd);
        }
      }

      // if (itemToAdd) {
      //   this.$store.dispatch("addToSelectedItems", itemToAdd);
      // }
    },
    handleShowAllChick(type) {
      if (type === "album") {
        this.$router.push({
          path: `/search/${this.$route.params.query}/all/${type.toLowerCase()}`
        });
      } else {
        this.$router.push({
          path: `/search/${this.$route.params.query}/all/${type.toLowerCase()}`
        });
      }
    }
  }
};
</script>
