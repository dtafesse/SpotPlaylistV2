<template>
  <v-container>
    <v-layout     
      align-center
      justify-center
    >
      <v-flex sm4 class="flexBtnContainer">
        <v-btn fab dark small color="white" style="margin: 12px">
          <v-icon @click="onMute" v-if="!this.$store.getters.isMute" color="primary">volume_up</v-icon>
          <v-icon @click="onMute" v-else color="orange darken-1">volume_off</v-icon>
        </v-btn>
      </v-flex>
      <v-flex sm8>
        <v-slider class="slider" :value="widthPercentage" @change="onVolumeChange" single-line></v-slider>
      </v-flex>
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

<style scoped>
.flexBtnContainer { 
  flex: 0 1 auto;
  margin: 6px;
}
.slider {
  margin-top: 16px;
}

.flex.sm8 {
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 50px;
}

.contain {
  width: 100%;
}

.volumeBar {
  width: 180px;
  position: absolute;
  right: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 29px;
}
img {
  width: 20px;
  height: 20px;
}

.volume {
  float: left;
}
.controlButton {
  background-color: transparent;
  border: none;
  vertical-align: middle;
  outline: 0;
}
.controlButton:focus {
  border: solid 0.5px rgb(189, 216, 247);
  border-radius: 2px;
}
.controlButton img {
  width: 20px;
  height: 20px;
}
.progressBar {
  width: 100%;
  height: 4px;
  display: inline-flex;
  cursor: pointer;
  background-color: rgb(199, 199, 199);
  border-radius: 2px;
  margin-top: 3px;
  margin-right: 3px;
}
</style>
