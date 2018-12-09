<template>
  <v-container grid-list-md>
    <div class="subheading">{{heading}}</div>
    <v-layout row wrap>
      <v-flex v-for="item in itemsInCurrentPage" xs6 sm2 :key="item.id">
        <v-card class="card text-as-center" height="175px">
          <v-layout column align-center justify-center>
            <v-flex xs12 my-3>
              <v-avatar v-bind="{ ['tile']: true }" size="125">
                <v-img
                  v-if="item.images.length > 0"
                  :src="item.images[0].url"
                  @click="onClickItem(item.id)"
                  contain
                ></v-img>
                <v-img v-else :src="defaultImage" @click="onClickItem(item.id)"></v-img>
              </v-avatar>
            </v-flex>
            <!-- <v-flex xs12 >
              <div>
                <v-card-title class="caption text-truncate" @click="onClickItem(item.id, index)">
                  {{ item.name }}
                  <span v-if="selectedItems">
                    <v-icon
                      v-if="selectedItems.indexOf(item.id) !== -1"
                      color="primary"
                      right
                    >check_circle_outline</v-icon>
                  </span>
                </v-card-title>
              </div>
            </v-flex>-->
          </v-layout>
        </v-card>
      </v-flex>

      <!-- Pagination Template -->
      <v-layout column align-center justify-center fill-height mt-1>
        <v-flex xs12>
          <v-pagination
            v-model="page"
            :length="pageLength"
            :total-visible="this.numOfPagesVisible"
            circle
          ></v-pagination>
        </v-flex>
      </v-layout>
      <!-- End Pagination Template -->
    </v-layout>
  </v-container>
</template>

<script>
import config from "../../config";

export default {
  name: "featuredPlaylists",
  data() {
    return {
      page: 1,
      isMobile: false
    };
  },
  props: {
    items: Array,
    selectedItems: Array,
    heading: String,
    numOfPagesVisible: Number, // set to 6 in parent comp
    pageSizeMobile: Number,
    pageSizeNonMobile: Number
  },
  computed: {
    pageSize() {
      if (this.isMobile) {
        return this.pageSizeMobile;
      } else {
        return this.pageSizeNonMobile;
      }
    },
    itemsInCurrentPage() {
      if (!this.items) return [];
      return this.paginate(this.items, this.pageSize, this.page);
    },
    pageLength() {
      if (this.items && this.pageSize) {
        let pageLength = Math.ceil(this.items.length / this.pageSize);

        return pageLength;
      }
      return 0;
    },
    defaultImage() {
      return config.defaultImage;
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
    onResize() {
      this.isMobile = window.innerWidth < 600;
    },
    onClickItem(id, index) {
      this.$emit("onClickItem", id);
    }
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, { passive: true });
    }
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  }
};
</script>

<style scoped>
.card:hover {
  cursor: pointer;
}
</style>