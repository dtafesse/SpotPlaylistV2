<template>
  <card-list
    :items="newlyReleasedAlbums"
    :selectedItems="selectedAlbumIds"
    heading="New Album Releases"
    :numOfPagesVisible="6"
    :pageSizeMobile="4"
    :pageSizeNonMobile="6"
    @onClickItem="handleSelectedAlbum"
  />
</template>

<script>
import CardList from "../../Shared/CardList";

export default {
  name: "newAlbumReleases",
  components: {
    CardList
  },
  computed: {
    newlyReleasedAlbums() {
      return this.$store.getters.getNewlyReleasedAlbums;
    },
    selectedAlbumIds() {
      return this.$store.getters.getSelectedAlbums.map(artist => artist.id);
    }
  },
  methods: {
    handleSelectedAlbum(id) {
      let index = this.newlyReleasedAlbums.findIndex(album => album.id === id);
      this.$store.dispatch(
        "addToSelectedAlbums",
        this.newlyReleasedAlbums[index]
      );
    }
  }
};
</script>
