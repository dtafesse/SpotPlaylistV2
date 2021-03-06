<template>
  <v-container>
    <v-layout
      :class="{mobile: $vuetify.breakpoint.xsOnly}"
      align-center
      justify-center
    >
      <v-flex class="flexButton">
        <v-btn fab dark small color="white">
          <v-icon @click="onShuffle" v-if="!this.$store.getters.isShuffle" color="primary">shuffle</v-icon>
          <v-icon @click="onShuffle" v-else color="orange darken-1">shuffle</v-icon>
        </v-btn>
      </v-flex>
      <v-flex class="flexButton">
        <v-btn fab dark small color="white">
          <v-icon dark @click="onPrev" color="primary">skip_previous</v-icon>
        </v-btn>
      </v-flex>
      <v-flex v-if="this.$store.getters.isPlaying" class="flexButton">
        <v-btn fab dark small color="white">
          <v-icon dark @click="onPlay" color="primary">play_circle_outline</v-icon>
        </v-btn>
      </v-flex>
      <v-flex v-else class="flexButton">
        <v-btn fab dark small color="white">
          <v-icon dark @click="onPause" color="primary">pause_circle_outline</v-icon>
        </v-btn>
      </v-flex>
      <v-flex class="flexButton">
        <v-btn fab dark small color="white">
          <v-icon dark @click="onNext" color="primary">skip_next</v-icon>
        </v-btn>
      </v-flex>
      <v-flex class="flexButton">
        <v-btn fab dark small color="white">
          <v-icon dark @click="onRepeat" v-if="!this.$store.getters.isRepeat" color="primary">repeat</v-icon>
          <v-icon dark @click="onRepeat" v-else color="orange darken-1">repeat_one</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <span class="time">{{ currentTime }}</span>
      <v-flex sm10>
        <v-slider 
          :value="widthPercentage" 
          @change="onProgressBarChange"
        >
        </v-slider>
      </v-flex>
      <span class="time">{{ remainingTime }}</span>
    </v-layout>
  </v-container>
</template>

<script>
import helpers from "../../assets/js/helpers";

export default {
  name: "audioControl",
  props: {
    progress: {
      type: String,
      default: "0%"
    }
  },
  data() {
    return {
      baseProgressStyles: {
        backgroundColor: "rgb(71,71,71)",
        height: "5px",
        width: "0%",
        borderRadius: "2px"
      },
      progressBar: undefined,
      valueDeterminate: 50
    };
  },
  computed: {
    widthPercentage() {
      return this.$store.getters.getProgress;
    },
    currentTime() {
      return this.$store.getters.getCurrentTime;
    },
    remainingTime() {
      return this.$store.getters.getRemainingTime;
    }
  },
  methods: {
    onProgressBarChange(newPos) {
      const percent = newPos / 100;
      const seconds = this.$store.getters.getDuration * percent;
      this.$store.dispatch("setAudioElementCurrentTime", seconds);
    },
    onPlay() {
      this.$store.dispatch("playPauseSong", {
        playing: false,
        playSong: true
      });
    },
    onPause() {
      this.$store.dispatch("playPauseSong", {
        playing: true,
        playSong: false
      });
    },
    onStop() {},
    onRepeat() {
      this.$store.dispatch("repeatSong", !this.$store.getters.isRepeat);
    },
    onShuffle() {
      if (this.$store.getters.getCurrentPlaylist) {
        this.$store.dispatch("setSuffle", {
          shuffle: !this.$store.getters.isShuffle,
          loadingNewPlaylist: false
        });
      }
    },
    onNext() {
      if (this.$store.getters.getCurrentPlaylist) {
        this.$store.dispatch("setNextTrack");
      }
    },
    onPrev() {
      this.$store.dispatch("setPrevTrack");
    },
    onMouseDown() {
      this.$store.dispatch("setMouseDown", true);
    },
    onMouseMove(e) {
      if (this.$store.getters.isMouseDown) {
        // set time of song depending on posistion of mouse
        const seconds = helpers.timeFromOffset(
          e,
          this.progressBar,
          this.$store.getters.getDuration
        );
        this.$store.dispatch("setAudioElementCurrentTime", seconds);
      }
    },
    onMouseUp(e) {
      const seconds = helpers.timeFromOffset(
        e,
        this.progressBar,
        this.$store.getters.getDuration
      );
    }
  },
  mounted() {
    this.progressBar = this.$refs.progressBar;
  }
};
</script>

<style scoped>
.flexButton {
  flex: 0 1 auto;
  margin: 6px;
}

.mobile {
  padding-left: 15px;
}

.container {
  /* padding-top: 0;
  padding-bottom: 0; */
  padding: 2px;
}

.time {
  margin-top: 3px;
  margin-right: 5px;
  margin-left: 5px;
}
</style>
