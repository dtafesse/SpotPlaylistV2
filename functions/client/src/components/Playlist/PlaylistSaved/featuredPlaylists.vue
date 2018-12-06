<template></template>

<script>
export default {
  name: "featuredPlaylists",
  computed: {
    featuredPlaylists() {
      return this.$store.getters.getFeaturedPlaylists;
    }
  }
};
</script>
