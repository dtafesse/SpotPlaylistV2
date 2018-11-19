<template>
    <v-container grid-list-md text-xs-center my-5 pt-2>
        <Loader v-if="loading" :width="7" :size="70" />
        <v-layout v-else row>
            <card 
                :currentlySelectedTrack="currentlySelectedTrack" 
                :isUserLoggedIn="isUserLoggedIn"
                :spotifyButtonValue="spotifyButtonValue"
                @onPlay="onPlay" 
                @onShuffle="onShuffle" 
                @onSpotifyButton="onSpotifyButton"     
            />

            <v-flex xs12 sm6 offset-sm1 align-center justify-center fill-height>
                <v-list three-line>
                    <v-subheader> 
                        <v-text-field 
                            :value="currentPlaylistName"
                            :readonly="isTextFieldReadOnly"
                            :append-outer-icon="isTextFieldReadOnly ? 'edit' : 'check'"
                            @click:append-outer="editIconClicked"
                            @input="updatePlaylistName"
                            :rules="playlistNameRules"
                            maxlength="25"
                            label="Playlist Name"
                        >
                        </v-text-field>
                        <span v-if="$vuetify.breakpoint.smAndUp" >{{ numberOfSongs }}</span>
                        <v-tooltip top>
                            <v-btn 
                                v-if="$vuetify.breakpoint.xs && isUserLoggedIn && isTextFieldReadOnly" 
                                flat
                                small
                                @click="onSpotifyButton"
                                color="#1DB954"
                                slot="activator"
                                > {{ spotifyButtonValue }}
                            </v-btn>
                            <span> {{ spotifyButtonToolTipValue }} </span>
                        </v-tooltip>
                    </v-subheader>
                    <template v-for="(track, index) in currentlySelectedPlaylist" >
                        <v-list-tile :key="track.id" avatar ripple class="listItem">
                            <v-list-tile @click="onClickTrack(index)">
                                <img 
                                    :src="track.album.images[0].url"
                                    max-width="50"
                                    height="50"
                                >
                            </v-list-tile>
                            <v-list-tile-content @click="onClickTrack(index)">
                                <v-list-tile-title v-html="track.name"></v-list-tile-title>
                                 <v-list-tile-sub-title v-html="track.album.name"></v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-tooltip top>
                                     <v-icon 
                                        v-if="track.name === currentlySelectedTrackName" 
                                        color="spotifyColor"
                                        @click="onListenToTrackOnSpotify"
                                        slot="activator"
                                    >
                                        launch
                                    </v-icon>
                                    <span>Listen On Spotify!</span>
                                </v-tooltip>
                            </v-list-tile-action>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Loader from '../../Shared/Loader';
import config from '../../../config';
import card from './card';

export default {
    name: 'playlistTable',
    components: {
        Loader,
        card
    },
    data() {
        return {
            newPlaylistName : '',
            isTextFieldReadOnly: true,
            playlistNameRules: [v => v.length <= 25 || 'Max 25 characters'],
            spotifyIcon: config.spotifyIcon
        }
    },
    computed: {
        isUserLoggedIn(){
            return this.$store.getters.user ? true: false;
        },
        isSpotifyAccountLinked(){
            return this.$store.getters.isSpotifyLoggedIn;
        },
        isPlaylistSavedOnSpotify(){
            // Save to Spotify! 
            return this.$store.getters.isCurrentPlaylistSavedOnSpotify;
        },
        currentPlaylistName(){
            return this.$store.getters.getCurrentPlaylistMetaData.playlistName 
                ? this.$store.getters.getCurrentPlaylistMetaData.playlistName 
                : 'Untitled'; 
        },
        spotifyButtonValue(){
            return this.isPlaylistSavedOnSpotify ? 'Listen On Spotify' : 'Save to Spotify!';
        },
        spotifyButtonToolTipValue(){
            if(this.spotifyButtonValue === 'Save to Spotify!'){
                return !this.isSpotifyAccountLinked ? 'Link Spotify account first': 'First save playlist to listen on Spotify';
            }
            return 'Click to listen on Spotify!';
        },
        currentlySelectedPlaylist() {
            const currentPlayingPlaylist = this.$store.getters.getCurrentPlaylist;
            return currentPlayingPlaylist !== undefined ? this.$store.getters.getCurrentPlaylist : null;
        },
        currentlySelectedTrack(){
            return this.$store.getters.getCurrentTrack ? this.$store.getters.getCurrentTrack: this.currentlySelectedPlaylist[0];
        },
        currentlySelectedTrackName(){
            let trackName = null;
            if(this.currentlySelectedTrack){
               
                trackName = this.currentlySelectedTrack.name;
            }
            return trackName;
        },
        numberOfSongs() {
            return this.currentlySelectedPlaylist ? `${this.currentlySelectedPlaylist.length} songs`: '';           
        },
        loading(){
            return this.$store.getters.isLoading;
        }
    },
    methods: {
        onClickTrack(index) {
            const track = {
                currentTrack: this.currentlySelectedPlaylist[index],
                currentArtwork: this.currentlySelectedPlaylist[index].album.images[0].url,
                currentTrackIndex: index
            };
            this.$store.dispatch('setCurrentTrack', track);
            this.$store.dispatch('setAutoPlay', true);
            this.selectedIndex = index
        },
        onPlay(){
            if(this.currentlySelectedPlaylist){
                this.onClickTrack(0);
            }
        },
        onShuffle(){
            if(this.currentlySelectedPlaylist){
                let randomTrackIndex = Math.floor((Math.random() * this.currentlySelectedPlaylist.length));
                this.$store.dispatch('setSuffle', {
                    shuffle: !this.$store.getters.isShuffle,
                    loadingNewPlaylist: false
                });
                this.$store.dispatch('setAutoPlay', true);
            }
        },
        updatePlaylistName(newName){
            this.newPlaylistName = newName;
        },
        editIconClicked(){
            this.isTextFieldReadOnly = !this.isTextFieldReadOnly;
            if(this.isTextFieldReadOnly){
                if(this.newPlaylistName.trim() !== this.currentPlaylistName.trim()){
                    // update playlistName in the store and the database 
                    this.$store.dispatch('updatedPlaylistName', this.newPlaylistName.trim());
                }
            }
        },
        onSpotifyButton(){
            if(this.isPlaylistSavedOnSpotify){
                // Listen uri 
                let newTab = window.open(`https://open.spotify.com/playlist/${this.$store.getters.getCurrentPlaylistMetaData.spotifyGeneratedPlaylistId}`)
                newTab.opener = null;
            }else{
                this.onSaveToSpotify();
            }
        },
        onListenToTrackOnSpotify(){
            let newTab = window.open(`https://open.spotify.com/track/${this.currentlySelectedTrack.id}`)
        },
        onSaveToSpotify(){
            if(this.isSpotifyAccountLinked){
                this.$store.dispatch('savePlaylistToSpotify');
            }else{
                window.localStorage.setItem('loginFromPlaylistPage', true);
                this.$store.dispatch('saveCurrentGeneratedPlaylistToFirebaseForUserThatHasNotLinkedSpotify')
                    .then(() => this.$store.dispatch('loginSpotify'));
                
            }
        }
    }
}
</script>

<style scoped>
    .listItem {
        cursor: pointer;
    }
    .listItem:hover {
        background-color: rgb(228,231,234);
    }

</style>
