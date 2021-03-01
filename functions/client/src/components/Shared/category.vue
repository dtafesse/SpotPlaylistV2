<template>
  <v-list two-line>
    <v-subheader>{{ headerMessage }}</v-subheader>
      <v-list-item v-for="(item, index) in limitItemSize" :key="item.id" @click="onClick(index, item.id)" class="listItem">
        <v-list-item-avatar>
          <v-avatar v-bind="{ ['tile']: imageType }" size="55">
            <v-img v-if="item.images.length > 0" :src="item.images[0].url"></v-img>
            <v-img v-else :src="defaultImage"></v-img>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon
            v-if="selectedItems && selectedItems.indexOf(item.id) !== -1"
            color="primary"
          > 
            check_circle_outline
          </v-icon>
        </v-list-item-action>
      </v-list-item>
    <v-btn
      v-if="showMoreButton"
      outlined
      color="cyan lighten-1"
      @click="onShowAllClick"
      class="ml-4 mt-3"
    >{{ moreText }}</v-btn>
  </v-list>
</template>

<script>
import config from "../../config/index";

export default {
  name: "category",
  props: {
    type: String,
    items: Array,
    selectedItems: Array,
    size: Number,
    showSeeAllButton: Boolean,
    headerMessage: String
  },
  computed: {
    limitItemSize() {
      if (this.items) {
        if (this.items.length > this.size) {
          return this.items.slice(0, this.size);
        } else {
          return this.items;
        }
      }
      return [];
    },
    showMoreButton() {
      if (this.items && this.showSeeAllButton) {
        if (this.items.length > this.size) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    moreText() {
      return this.type === "Albums" ? "See all albums" : "See all artists";
    },
    imageType() {
      if (this.type === "Albums") {
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
    onClick(index, id) {
      this.$emit("onClick", {
        type: this.type.toLowerCase(),
        index: index,
        id
      });
    },
    onShowAllClick() {
      this.$emit("onShowAllClick", this.type.toLowerCase());
    }
  },
};
</script>

<style scoped>
.listItem {
  cursor: pointer;
}
.listItem:hover {
  background-color: rgb(228, 231, 234);
}
</style>
