<template>
  <v-container grid-list-md my-5 pt-2>
    <v-layout row wrap>
      <v-flex v-for="(item, index) in items" xs6 sm3 :key="item.id">
        <v-card class="card" height="255px">
          <v-layout column align-center justify-center>
            <v-flex xs12 mt-4>
              <v-avatar v-bind="{ ['tile']: imageType }" size="150">
                <v-img
                  v-if="item.images.length > 0"
                  :src="item.images[0].url"
                  @click="selected(index)"
                ></v-img>
                <v-img v-else :src="defaultImage" @click="selected(index)"></v-img>
              </v-avatar>
            </v-flex>
            <v-flex xs12>
              <v-card-title class="caption" @click="selected(index)">
                {{ item.name }}
                <span v-if="selectedItemsIds">
                  <v-icon
                    v-if="selectedItemsIds.indexOf(item.id) !== -1"
                    color="primary"
                  >check_circle_outline</v-icon>
                </span>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import config from "../../config/index";

export default {
  name: "renderAll",
  computed: {
    items() {
      if (this.$route.params.type === "albums") {
        return this.$store.getters.getQueryResult.albums
          ? this.$store.getters.getQueryResult.albums.items
          : null;
      } else {
        return this.$store.getters.getQueryResult.artists
          ? this.$store.getters.getQueryResult.artists.items
          : null;
      }
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
    },
    imageType() {
      if (this.$route.params.type === "albums") {
        return true;
      } else {
        return false;
      }
    },
    defaultImage() {
      return config.defaultImage;
    }
  },
  methods: {
    selected(index) {
      //console.log({ 'type': this.$route.params.type, 'index': index });
      let itemToAdd;

      if (this.items) {
        itemToAdd = this.items[index];

        if (this.$route.params.type === "albums") {
          this.$store.dispatch("addToSelectedAlbums", itemToAdd);
        } else {
          this.$store.dispatch("addToSelectedArtists", itemToAdd);
        }
      }
    }
  }
};
</script>

<style scoped>
.card:hover {
  cursor: pointer;
}
</style>
