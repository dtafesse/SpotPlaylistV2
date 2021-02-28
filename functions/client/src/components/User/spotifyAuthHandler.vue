<template>
  <v-container grid-list-md my-5 pt-2>
    <Loader :width="7" :size="70"/>
  </v-container>
</template>
<script>
import queryString from "query-string";
import Loader from "../Shared/Loader";

export default {
  name: "spotifyAuthHandler",
  components: {
    Loader
  },
  created() {
    const query = queryString.parse(window.location.search);
    this.$store.dispatch("saveUserSpotAuthTokensToFB", query)
      .then(() => {
        // saveUserSpotAuthTokensToFB will eventually redirect to home page '/saved/playlist/'
        // the dispatch is complete,
        // check local storage if login came from playlist table,
        // if so set the current playlist in the store to the last
        // playlist in recenently generated playlist, and route to
        // the playlist page.
        // then finally save the playlist over to spotify

        return this.$store.dispatch("checkIfLoginIntitiatedFromPlaylistPage")
      }).then(() => this.$store.dispatch("savePlaylistToSpotify") );
  }
};
</script>
