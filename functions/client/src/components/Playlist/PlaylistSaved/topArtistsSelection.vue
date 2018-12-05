<template>
  <v-container>
    <v-alert :value="isError" type="error">{{ `Please Select up to ${selectionLimit} times Only `}}</v-alert>

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
  </v-container>
</template>

<script>
import selector from "../../Shared/selector";
import config from "../../../config";

export default {
  name: "topArtistsSelection",
  components: {
    selector
  },
  data() {
    return {
      selectionLimit: config.LIMIT
    };
  },
  computed: {
    isError() {
      let selectedItems = this.$store.getters.getSelectedArtists;

      if (selectedItems) {
        return selectedItems.length > config.LIMIT;
      }
    },
    selectedArtists() {
      return this.$store.getters.getSelectedArtists;
    }
  },
  methods: {
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
