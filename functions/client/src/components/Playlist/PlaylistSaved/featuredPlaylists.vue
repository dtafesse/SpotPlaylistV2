<template>
  <v-container grid-list-md my-3>
    <div class="subheading">Featured Playlists</div>
    <v-layout row wrap>
      <v-flex
        v-for="(playlist, index) in featuredPlaylistsInCurrentPage"
        xs6
        sm2
        :key="playlist.id"
      >
        <v-card flat class="card text-as-center">
          <v-avatar v-bind="{ ['tile']: true }" size="125">
            <v-img
              v-if="playlist.images.length > 0"
              :src="playlist.images[0].url"
              @click="onClickPlaylist(index)"
            ></v-img>
            <v-img v-else :src="defaultImage" @click="onClickPlaylist(index)"></v-img>
          </v-avatar>
          <v-card-title class="caption" @click="onClickPlaylist(index)">{{ playlist.name }}</v-card-title>
        </v-card>
      </v-flex>

      <!-- Pagination Template -->
      <v-container class="text-xs-center">
        <v-pagination v-model="page" :length="pageLength" :total-visible="6" circle></v-pagination>
      </v-container>
      <!-- End Pagination Template -->
    </v-layout>
  </v-container>
</template>

<script>
import config from "../../../config";

export default {
  name: "featuredPlaylists",
  data() {
    return {
      page: 1,
      isMobile: false
    };
  },
  computed: {
    pageSize() {
      if (this.isMobile) {
        return 4;
      } else {
        return 6;
      }
    },
    featuredPlaylists() {
      return this.$store.getters.getFeaturedPlaylists;
    },
    featuredPlaylistsInCurrentPage() {
      if (!this.featuredPlaylists) return [];
      return this.paginate(this.featuredPlaylists, this.pageSize, this.page);
    },
    pageLength() {
      if (this.featuredPlaylists && this.pageSize) {
        let pageLength = Math.ceil(
          this.featuredPlaylists.length / this.pageSize
        );

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
    onClickPlaylist(index) {
      let selectedPlaylist = this.featuredPlaylists[index];
      this.$store.dispatch("fetchTracksForSelectedFeaturedPlaylist", {
        id: selectedPlaylist.id,
        playlistName: selectedPlaylist.name
      });
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