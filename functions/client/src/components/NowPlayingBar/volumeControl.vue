<template>
  <v-container>
    <v-layout     
      align-center
      justify-center
    >
      <v-slider 
        class="ml-3"
        hide-details 
        :value="widthPercentage" 
        @change="onVolumeChange" 
        :prepend-icon="muteIcon"
        @click:prepend="onMute"
      >
      </v-slider>
    </v-layout>
  </v-container>
</template>

<script>
import helpers from "../../assets/js/helpers";

export default {
  name: "volumeControl",
  props: {
    volume: String,
    mute: Boolean
  },
  data() {
    return {
      baseProgressStyles: {
        backgroundColor: "rgb(71,71,71)",
        height: "4px",
        width: "0%",
        borderRadius: "2px"
      },
      volumeProgressBar: undefined
    };
  },
  computed: {
    muteIcon() {
      if (this.$store.getters.isMute) {
        return 'volume_off'
      }
      return 'volume_up'
    },
    widthPercentage() {
      return this.$store.getters.getVolume;
    }
  },
  methods: {
    onVolumeChange(newVolume) {
      this.$store.dispatch("setAudioElementVolumePercentage", newVolume / 100);
    },
    onMute() {
      this.$store.dispatch("muteSong", !this.$store.getters.isMute);
    }
  },
  mounted() {
    this.volumeProgressBar = this.$refs.volumeProgressBar;
  }
};
</script>