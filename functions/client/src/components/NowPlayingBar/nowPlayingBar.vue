<template>
    <v-footer height="110" color="light-grey" fixed>
        <v-container fluid grid-list @mousedown="(e) => e.preventDefault()" @mousemove="(e) => e.preventDefault()" 
        @touchmove="(e) => e.preventDefault()" @touchstart="(e) => e.preventDefault()">
            <v-layout v-if="$vuetify.breakpoint.smAndUp">
                <v-flex sm3>
                     <TrackMetaData />
                </v-flex>
                <v-flex sm6>
                    <audioControl />
                </v-flex>
                <v-flex sm3>
                    <volumeControl />
                </v-flex>
            </v-layout>
            <v-layout v-else align-center justify-center row fill-height>
                <v-flex xs12>
                    <audioControl />
                </v-flex>
            </v-layout>
            <v-layout>
                <!-- <div v-if="this.$store.getters.getCurrentTrack">
                    <audio 
                        ref="audioElement" 
                        :src="setAudioSource" 
                        style="display:none">
                    </audio>
                </div> -->
                <audio 
                    ref="audioElement" 
                    :src="setAudioSource" 
                    style="display:none">
                </audio>
            </v-layout>
        </v-container>
    </v-footer>    
</template>

<script>
import TrackMetaData from './trackMetaData';
import AudioControl from './audioControl';
import VolumeControl from './volumeControl'
import helpers from '../../assets/js/helpers';

export default {
    name: 'nowPlayingBar',
    components: {
        TrackMetaData,
        AudioControl,
        VolumeControl
    },
    computed: {
        setAudioSource(){
            const currentTrack = this.$store.getters.getCurrentTrack;
            return (currentTrack)?currentTrack.preview_url:null;
        }
    },
    methods: {
        onNextSong(){
            this.$store.dispatch('setNextTrack');
        },
        handleLoad(){
            //// maybe here figure out the current playlist??

            // if(this.$store.getters.isMobileAudioElementFirstClick){
            //     this.$store.commit('MOBILE_AUDIO_ELEMENT_FIRST_CLICK', false);
            // }else{
            //     if(this.$store.getters.getAudioElement.readyState >= 2 ){
            //         if(this.$store.getters.isAutoPlay) {
            //             this.$store.dispatch('playPauseSong', {
            //                 playing: false,
            //                 playSong: true
            //             });
            //         }

            //         this.$store.dispatch('setDuration', this.$store.getters.getAudioElement.duration);
            //         this.$store.dispatch('setRemainingTime', helpers.formatTime(this.$store.getters.getDuration));
                
            //     } else {
            //         throw new Error('Failed to load sound file');
            //     }
            // }
            
            if(this.$store.getters.getAudioElement.readyState >= 2 ){
                if(this.$store.getters.isAutoPlay) {
                    this.$store.dispatch('playPauseSong', {
                        playing: false,
                        playSong: true
                    });
                }

                this.$store.dispatch('setDuration', this.$store.getters.getAudioElement.duration);
                this.$store.dispatch('setRemainingTime', helpers.formatTime(this.$store.getters.getDuration));
            
            } else {
                throw new Error('Failed to load sound file');
            }        
        },
        handleUpdateTimeProgressBar(){
            if(this.$store.getters.getAudioElement.duration){
    
                this.$store.dispatch('setCurrentTime', 
                    helpers.formatTime(this.$store.getters.getAudioElement.currentTime)
                );
                this.$store.dispatch('setRemainingTime', 
                    helpers.formatTime(
                        this.$store.getters.getAudioElement.duration - 
                        this.$store.getters.getAudioElement.currentTime
                    )
                );

                const progress = this.$store.getters.getAudioElement.currentTime / this.$store.getters.getAudioElement.duration * 100;
                this.$store.dispatch('setProgress', progress);
            }
        },
        handleUpdateVolumeProgressBar(){
            this.$store.dispatch('setVolume', this.$store.getters.getAudioElement.volume * 100);
        },
        resetMouseDown(){
            this.$store.dispatch('setMouseDown', false);
        }
    },
    mounted(){
        this.$el.addEventListener('mouseup', this.resetMouseDown);

        this.$refs.audioElement.addEventListener('loadeddata', this.handleLoad);
        this.$refs.audioElement.addEventListener('timeupdate', this.handleUpdateTimeProgressBar);
        this.$refs.audioElement.addEventListener('volumechange', this.handleUpdateVolumeProgressBar);
        this.$refs.audioElement.addEventListener('ended', this.onNextSong);

        this.$store.dispatch('setAudioElement', this.$refs.audioElement );
    },
    beforeDestroy(){
        this.$el.removeEventListener('mouseup', this.resetMouseDown);
        this.$store.getAudioElement.removeEventListener('loadeddata', this.handleLoad);
        this.$store.getAudioElement.removeEventListener('timeupdate', this.handleUpdateTimeProgressBar);
        this.$store.getAudioElement.removeEventListener('volumechange', this.handleUpdateVolumeProgressBar);
        this.$store.getAudioElement.removeEventListener('ended', this.onNextSong);
    }
}
</script>

<style scoped>
  .container.fluid.grid-list {
    padding: 0;
}
</style>
