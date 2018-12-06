<template>
  <card-list
    :items="newlyReleasedAlbums"
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
    }
  },
  methods: {
    handleSelectedAlbum(index) {
      console.log(this.newlyReleasedAlbums[index].name);
    }
  }
};
</script>
