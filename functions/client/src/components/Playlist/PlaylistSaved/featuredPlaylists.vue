<template>
  <card-list
    :items="featuredPlaylists"
    heading="Featured Playlists"
    :numOfPagesVisible="6"
    :pageSizeMobile="4"
    :pageSizeNonMobile="6"
    @onClickItem="handleSelectedFeaturedPlaylist"
  />
</template>

<script>
import CardList from "../../Shared/CardList";

export default {
  name: "featuredPlaylists",
  components: {
    CardList
  },
  computed: {
    featuredPlaylists() {
      return this.$store.getters.getFeaturedPlaylists;
    }
  },
  methods: {
    handleSelectedFeaturedPlaylist(index) {
      let selectedPlaylist = this.featuredPlaylists[index];
      this.$store.dispatch("fetchTracksForSelectedFeaturedPlaylist", {
        id: selectedPlaylist.id,
        playlistName: selectedPlaylist.name
      });
    }
  }
};
</script>

