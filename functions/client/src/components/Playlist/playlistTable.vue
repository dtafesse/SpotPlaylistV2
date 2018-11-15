<template>
    <v-container grid-list-md text-xs-center my-5 pt-2>
        <Loader v-if="loading" :width="7" :size="70" />
        <v-layout v-else row>
            <v-flex sm5 offset-sm1 v-if="$vuetify.breakpoint.smAndUp">
                <v-card 
                    v-if="currentlySelectedTrack" 
                    max-width="380px"
                >          
                    <v-layout>
                        <v-flex xs12 mt-2 >
                            <v-img 
                                :src="currentlySelectedTrack.album.images[0].url"
                                contain
                                height="320px"
                            >
                            </v-img>
                        </v-flex>
                 
                    </v-layout> 
                    <v-divider light></v-divider>    
                    <v-card-actions>
                        <v-btn  
                            flat
                            @click="onPlay"
                            color="primary"
                            >Play 
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn 
                            flat
                            @click="onShuffle"
                            color="primary"
                            >Shuffle
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn  
                            v-if="isUserLoggedIn"
                            flat
                            @click="onSaveToSpotify"
                            color="#1DB954"
                            >Save to Spotify! 
                            
                        </v-btn>
                    </v-card-actions>  
                </v-card>           
            </v-flex>
            <!-- <v-flex xs12 sm6 offset-sm3 align-center justify-center fill-height> -->
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
                        <v-btn 
                            v-if="$vuetify.breakpoint.xs && isUserLoggedIn" 
                            flat
                            small
                            @click="onSaveToSpotify"
                            color="#1DB954"
                            >Save to Spotify! 
                        </v-btn>
                    </v-subheader>
                    <template v-for="(track, index) in currentlySelectedPlaylist" >
                        <v-list-tile :key="track.id" avatar ripple @click="onClickTrack(index)" class="listItem">
                            <v-list-tile>
                                <img 
                                    :src="track.album.images[0].url"
                                    max-width="50"
                                    height="50"
                                >
                            </v-list-tile>
                            <v-list-tile-content>
                                <v-list-tile-title v-html="track.name"></v-list-tile-title>
                                 <v-list-tile-sub-title v-html="track.album.name"></v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action>
                                <v-icon v-if="track.name === currentlySelectedTrackName" color="primary">
                                    library_music
                                </v-icon>
                            </v-list-tile-action>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Loader from '../Shared/Loader';

export default {
    name: 'playlistTable',
    components: {
        Loader
    },
    data() {
        return {
            newPlaylistName : '',
            isTextFieldReadOnly: true,
            playlistNameRules: [v => v.length <= 25 || 'Max 25 characters']
        }
    },
    computed: {
        isUserLoggedIn(){
            return this.$store.getters.user ? true: false;
        },
        isSpotifyAccountLinked(){
            return this.$store.getters.isSpotifyLoggedIn;
        },
        currentPlaylistName(){
            return this.$store.getters.getCurrentPlaylistMetaData.playlistName 
                ? this.$store.getters.getCurrentPlaylistMetaData.playlistName 
                : 'Untitled'; 
        },
        currentlySelectedPlaylist() {
            const currentPlayingPlaylist = this.$store.getters.getCurrentPlaylist;
            return currentPlayingPlaylist !== undefined ? this.$store.getters.getCurrentPlaylist : null;
        },
        currentlySelectedTrack(){
            return this.$store.getters.getCurrentTrack ? this.$store.getters.getCurrentTrack: null;
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
        onSaveToSpotify(){
            if(this.isSpotifyAccountLinked){
                this.$store.dispatch('savePlaylistToSpotify');
            }else{
                this.$store.dispatch('loginSpotify');
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
