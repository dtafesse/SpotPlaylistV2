<template>
  <v-flex sm5 v-if="$vuetify.breakpoint.smAndUp">
    <v-card v-if="currentlySelectedTrack" max-width="380px">
      <v-layout>
        <v-flex xs12 mt-2>
          <v-img
            v-if="currentlySelectedTrack.album.images[0].url !== undefined"
            :src="currentlySelectedTrack.album.images[0].url"
            contain
            height="320px"
          ></v-img>
        </v-flex>
      </v-layout>
      <v-divider light></v-divider>
      <v-card-actions>
        <v-btn text @click="$emit('onPlay')" color="primary">Play</v-btn>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('onShuffle')" color="primary">Shuffle</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="isUserLoggedIn"
          text
          @click="$emit('onSpotifyButton')"
          color="spotifyColor"
        >{{ spotifyButtonValue }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: "card",
  props: {
    currentlySelectedTrack: Object,
    isUserLoggedIn: Boolean,
    spotifyButtonValue: String
  }
};
</script>

