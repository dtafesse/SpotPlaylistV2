<template>
  <v-container grid-list-md text-center mt-6>
    <v-alert
      :value="!isPreviewUrlAvailableForCurrentTrack"
      dismissible
      type="warning"
    >{{ 'Selected track does not have a preview link, click on the Launch icon to preview the track on Spotify' }}</v-alert>
    <v-alert v-model="alert" dismissible :type="alertType">{{ alertMessage }}</v-alert>

    <Loader v-if="loading" :width="7" :size="70"/>
    <v-layout v-else>
      <card
        :currentlySelectedTrack="currentlySelectedTrack"
        :isUserLoggedIn="isUserLoggedIn"
        :spotifyButtonValue="spotifyButtonValue"
        @onPlay="onPlay"
        @onShuffle="onShuffle"
        @onSpotifyButton="onSpotifyButton"
      />

      <v-flex xs12 sm6 offset-sm1 align-center justify-center fill-height>
        <v-list two-line>
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
            ></v-text-field>
            <span v-if="$vuetify.breakpoint.smAndUp">{{ numberOfSongs }}</span>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="$vuetify.breakpoint.xs && isUserLoggedIn && isTextFieldReadOnly"
                  text
                  small
                  @click="onSpotifyButton"
                  color="#1DB954"
                  slot="activator"
                  v-bind="attrs"
                  v-on="on"
                >{{ spotifyButtonValue }}</v-btn>
              </template>

              <span>{{ spotifyButtonToolTipValue }}</span>
            </v-tooltip>
          </v-subheader>
          <v-list-item
            v-for="(track, index) in currentlySelectedPlaylist"
            :key="index"
            class="listItem"
            @mouseenter="selectedTrackToBeModified = index"
            
            >
              <v-list-item-avatar @click="onClickTrack(index)">
                <img
                  v-if="track.album.images[0].url !== undefined"
                  :src="track.album.images[0].url"
                  max-width="50"
                  height="50"
                >
              </v-list-item-avatar>
              <v-list-item-content @click="onClickTrack(index)">
                <v-list-item-title class="titleContainer" v-text="track.name"></v-list-item-title>
                <v-list-item-subtitle class="titleContainer" v-text="track.album.name"></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <div class="text-center">
                  <v-menu left :disabled="menuDisabled" offset-y>
                     <template v-slot:activator="{ on, attrs }">
                       <v-icon slot="activator" color="primary" dark v-bind="attrs" v-on="on">more_horiz</v-icon>
                     </template>
                    
                    <v-list>
                      <v-list-item
                        v-for="(option, index) in menuOptions"
                        :key="index"
                        @click="onSelectOption(option, track, index)"
                      >
                        <v-list-item-title>{{ option.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>

                <v-tooltip bottom  v-if="track.name === currentlySelectedTrackName">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="spotifyColor"
                      @click="onListenToTrackOnSpotify"
                      v-bind="attrs"
                      v-on="on"
                    >launch</v-icon>
                  </template>
                  <span>Listen On Spotify!</span>
                </v-tooltip>
  
              </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Loader from "../../Shared/Loader";
import config from "../../../config";
import card from "./card";

export default {
  name: "playlistTable",
  components: {
    Loader,
    card
  },
  data() {
    return {
      newPlaylistName: "",
      isTextFieldReadOnly: true,
      playlistNameRules: [v => v.length <= 25 || "Max 25 characters"],
      spotifyIcon: config.spotifyIcon,
      menuOptions: [{ title: "Replace" }, { title: "Remove" }],
      menuDisabled: false,
      selectedTrackToBeModified: 0,
      alert: false,
      alertType: undefined,
      alertMessage: undefined,
      alertForPreviewUrl: false
    };
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.getters.user ? true : false;
    },
    isSpotifyAccountLinked() {
      return this.$store.getters.isSpotifyLoggedIn;
    },
    isPlaylistSavedOnSpotify() {
      // Save to Spotify!
      return this.$store.getters.isCurrentPlaylistSavedOnSpotify;
    },
    isPreviewUrlAvailableForCurrentTrack() {
      return this.$store.getters.isPreviewUrlForCurrentTrack;
    },
    currentPlaylistName() {
      return this.$store.getters.getCurrentPlaylistMetaData.playlistName
        ? this.$store.getters.getCurrentPlaylistMetaData.playlistName
        : "Untitled";
    },
    spotifyButtonValue() {
      return this.isPlaylistSavedOnSpotify
        ? "Listen On Spotify"
        : "Save to Spotify!";
    },
    spotifyButtonToolTipValue() {
      if (this.spotifyButtonValue === "Save to Spotify!") {
        return !this.isSpotifyAccountLinked
          ? "Link Spotify account first"
          : "First save playlist to listen on Spotify";
      }
      return "Click to listen on Spotify!";
    },
    currentlySelectedPlaylist() {
      const currentPlayingPlaylist = this.$store.getters.getCurrentPlaylist;
      if (currentPlayingPlaylist) {
        return currentPlayingPlaylist.map(track => track);
      }

      return null;
    },
    currentlySelectedTrack() {
      return this.$store.getters.getCurrentTrack
        ? this.$store.getters.getCurrentTrack
        : this.currentlySelectedPlaylist[0];
    },
    currentlySelectedTrackName() {
      let trackName = null;
      if (this.currentlySelectedTrack) {
        trackName = this.currentlySelectedTrack.name;
      }
      console.log(trackName)
      return trackName;
    },
    numberOfSongs() {
      return this.currentlySelectedPlaylist
        ? `${this.currentlySelectedPlaylist.length} songs`
        : "";
    },
    loading() {
      return this.$store.getters.isLoading;
    }
  },
  methods: {
    onClickTrack(index) {
      const track = {
        currentTrack: this.currentlySelectedPlaylist[index],
        currentArtwork: this.currentlySelectedPlaylist[index].album.images[0]
          .url,
        currentTrackIndex: index
      };
      this.$store.dispatch("setCurrentTrack", track);
      this.$store.dispatch("setAutoPlay", true);
      this.selectedIndex = index;
    },
    onPlay() {
      if (this.currentlySelectedPlaylist) {
        this.onClickTrack(0);
      }
    },
    onShuffle() {
      if (this.currentlySelectedPlaylist) {
        let randomTrackIndex = Math.floor(
          Math.random() * this.currentlySelectedPlaylist.length
        );
        this.$store.dispatch("setSuffle", {
          shuffle: !this.$store.getters.isShuffle,
          loadingNewPlaylist: false
        });
        this.$store.dispatch("setAutoPlay", true);
      }
    },
    updatePlaylistName(newName) {
      this.newPlaylistName = newName;
    },
    editIconClicked() {
      this.isTextFieldReadOnly = !this.isTextFieldReadOnly;
      if (this.isTextFieldReadOnly) {
        if (this.newPlaylistName.trim() !== this.currentPlaylistName.trim()) {
          // update playlistName in the store and the database
          this.$store.dispatch(
            "updatedPlaylistName",
            this.newPlaylistName.trim()
          );
        }
      }
    },
    onSpotifyButton() {
      if (this.isPlaylistSavedOnSpotify) {
        // Listen uri
        let newTab = window.open(
          `https://open.spotify.com/playlist/${
            this.$store.getters.getCurrentPlaylistMetaData
              .spotifyGeneratedPlaylistId
          }`
        );
        newTab.opener = null;
      } else {
        this.onSaveToSpotify();
      }
    },
    onListenToTrackOnSpotify() {
      let newTab = window.open(
        `https://open.spotify.com/track/${this.currentlySelectedTrack.id}`
      );
      newTab.opener = null;
    },
    onSaveToSpotify() {
      if (this.isSpotifyAccountLinked) {
        this.$store.dispatch("savePlaylistToSpotify");
      } else {
        window.localStorage.setItem("loginFromPlaylistPage", true);
        this.$store
          .dispatch(
            "saveCurrentGeneratedPlaylistToFirebaseForUserThatHasNotLinkedSpotify"
          )
          .then(() => this.$store.dispatch("loginSpotify"));
      }
    },
    replaceTrack(index, currentTrackUri) {
      this.menuDisabled = !this.menuDisabled;

      // replace with a similar track in the same index postion, update firebase, update user's saved spotify playlist
      this.$store
        .dispatch("findRelatedTrack", this.currentlySelectedPlaylist[index].id)
        .then(track => {
          return this.$store.dispatch("updateCurrentPlaylistWithNewTrack", {
            track: track,
            index: index
          });
        })
        .then(() => {
          return this.$store.dispatch(
            "updateCurrentPlaylistMetaDataPlaylistUriId",
            {
              track: this.currentlySelectedPlaylist[index].uri,
              index
            }
          );
        })
        .then(() => {
          return this.$store.dispatch(
            "updatedTrackForPlaylistFromRecentlyGeneratedPlaylists",
            {
              trackUri: this.currentlySelectedPlaylist[index].uri,
              index
            }
          );
        })
        .then(() => {
          if (!this.isUserLoggedIn) return;

          return this.$store.dispatch("updatePlaylistOnFirebase", {
            trackUri: this.currentlySelectedPlaylist[index].uri,
            index
          });
        })
        .then(() => {
          if (!this.isSpotifyAccountLinked || !this.isPlaylistSavedOnSpotify) {
            return;
          }

          this.$store.dispatch("updateSavedSpotifyPlaylist", {
            snapshot_id: this.$store.getters.getCurrentPlaylistMetaData
              .snapshot_id,
            index,
            currentTrackUri,
            newTrackUri: this.currentlySelectedPlaylist[index].uri,
            spotifyGeneratedPlaylistId: this.$store.getters
              .getCurrentPlaylistMetaData.spotifyGeneratedPlaylistId
          });
        })
        .catch(err => {
          if (err.message === "Could not find related track!") {
            this.alert = true;
            this.alertType = "warning";
            this.alertMessage = "Could not find related track!";
          }
        })
        .finally(() => (this.menuDisabled = !this.menuDisabled));
    },
    removeTrack(index) {
      this.menuDisabled = !this.menuDisabled;

      // remove track from playlist, update firebase, update user's saved spotify playlist using index
      this.$store.commit("REMOVE_TRACK_FROM_CURRENT_PLAYLIST", index);
      this.$store.commit(
        "REMOVE_TRACK_URI_ID_FROM_CURRENT_PLAYLIST_META_DATA",
        index
      );
      this.$store.commit(
        "REMOVE_TRACK_URI_ID_FROM_RECENTLY_GENERATED_PLAYLIST_MEMBER",
        {
          id: this.$store.getters.getCurrentPlaylistMetaData.id,
          trackUriPosition: index
        }
      );

      if (this.isUserLoggedIn) {
        this.$store
          .dispatch("removeTrackFromFirebasePlaylist", index)
          .then(() => {
            if (!this.isSpotifyAccountLinked || !this.isPlaylistSavedOnSpotify)
              return;

            return this.$store.dispatch(
              "removeTrackFromSavedSpotifyPlaylists",
              {
                access_token: this.$store.getters.getAccessToken,
                snapshot_id: this.$store.getters.getCurrentPlaylistMetaData
                  .snapshot_id,
                index,
                spotifyGeneratedPlaylistId: this.$store.getters
                  .getCurrentPlaylistMetaData.spotifyGeneratedPlaylistId
              }
            );
          })
          .catch(err => console.log(err))
          .finally(() => (this.menuDisabled = !this.menuDisabled));
      }
    },
    onSelectOption(option, track) {
      let index = this.selectedTrackToBeModified;
      let currentTrackUri = this.currentlySelectedPlaylist[index].uri;

      if (option.title === "Replace") {
        this.replaceTrack(index, currentTrackUri);
      } else {
        this.removeTrack(index);
      }
    }
  }
};
</script>

<style scoped>
.listItem {
  cursor: pointer;
}
.listItem:hover {
  background-color: rgb(228, 231, 234);
}
.titleContainer {
  text-align: start;
}
</style>
