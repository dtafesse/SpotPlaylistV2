<template>
  <v-footer color="light-grey" app fixed>
    <v-container
      fluid
      grid-list
      @mousedown="(e) => e.preventDefault()"
      @mousemove="(e) => e.preventDefault()"
      @touchmove="(e) => e.preventDefault()"
      @touchstart="(e) => e.preventDefault()"
    >
      <v-layout v-if="$vuetify.breakpoint.smAndUp" align-center justify-center fill-height>
        <v-flex sm3>
          <TrackMetaData/>
        </v-flex>
        <v-flex sm6>
          <audioControl/>
        </v-flex>
        <v-flex sm3>
          <volumeControl/>
        </v-flex>
      </v-layout>
      <v-layout v-else align-center justify-center fill-height>
        <v-flex xs12>
          <audioControl/>
        </v-flex>
      </v-layout>
      <v-layout v-if="this.$store.getters.getCurrentTrack">
        <audio
          ref="audioElement"
          :src="setAudioSource"
          preload="auto"
          @loadeddata="handleLoad"
          @timeupdate="handleUpdateTimeProgressBar"
          @volumechange="handleUpdateVolumeProgressBar"
          @ended="onNextSong"
          style="display:none"
        ></audio>
      </v-layout>
      <v-layout v-else>
        <audio ref="audioElement"></audio>
      </v-layout>
    </v-container>
  </v-footer>
</template>

<script>
import TrackMetaData from "./trackMetaData";
import AudioControl from "./audioControl";
import VolumeControl from "./volumeControl";
import helpers from "../../assets/js/helpers";

export default {
  name: "nowPlayingBar",
  components: {
    TrackMetaData,
    AudioControl,
    VolumeControl
  },
  computed: {
    setAudioSource() {
      const currentTrack = this.$store.getters.getCurrentTrack;
      if (currentTrack && currentTrack.preview_url) {
        this.$store.commit("SET_PREVIEW_URL_FOR_CURRENT_TRACK", true);
        return currentTrack.preview_url;
      } else {
        this.$store.commit("SET_PREVIEW_URL_FOR_CURRENT_TRACK", false);
        return null;
      }
      // return currentTrack ? currentTrack.preview_url : null;
    }
  },
  methods: {
    onNextSong() {
      this.$store.dispatch("setNextTrack");
    },
    handleLoad() {
      if (this.$store.getters.getAudioElement.readyState >= 2) {
        if (this.$store.getters.isAutoPlay) {
          this.$store.dispatch("playPauseSong", {
            playing: false,
            playSong: true
          });
        }

        this.$store.dispatch(
          "setDuration",
          this.$store.getters.getAudioElement.duration
        );
        this.$store.dispatch(
          "setRemainingTime",
          helpers.formatTime(this.$store.getters.getDuration)
        );
      } else {
        throw new Error("Failed to load sound file");
      }
    },
    handleUpdateTimeProgressBar() {
      if (
        this.$store.getters.getAudioElement &&
        this.$store.getters.getAudioElement.duration
      ) {
        this.$store.dispatch(
          "setCurrentTime",
          helpers.formatTime(this.$store.getters.getAudioElement.currentTime)
        );
        this.$store.dispatch(
          "setRemainingTime",
          helpers.formatTime(
            this.$store.getters.getAudioElement.duration -
              this.$store.getters.getAudioElement.currentTime
          )
        );

        const progress =
          (this.$store.getters.getAudioElement.currentTime /
            this.$store.getters.getAudioElement.duration) *
          100;
        this.$store.dispatch("setProgress", progress);
      }
    },
    handleUpdateVolumeProgressBar() {
      this.$store.dispatch(
        "setVolume",
        this.$store.getters.getAudioElement.volume * 100
      );
    },
    resetMouseDown() {
      this.$store.dispatch("setMouseDown", false);
    }
  },
  mounted() {
    this.$el.addEventListener("mouseup", this.resetMouseDown);
    this.$store.dispatch("setAudioElement", this.$refs.audioElement);
  },
  beforeDestroy() {
    this.$el.removeEventListener("mouseup", this.resetMouseDown);
  }
};
</script>

<style scoped>
.container {
  padding: 0;
}
.v-footer {
  padding: 0px 16px;
}
</style>
