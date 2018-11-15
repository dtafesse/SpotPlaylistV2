import api from '../../../api/index';
import * as firebase from 'firebase';

const actions = {
  setPlaylist: (context, newPlayist) => {
    context.commit('SET_PLAYLIST', newPlayist);
  },
  clearPlaylistState: ({ commit }) => {
    commit('SET_PLAYLIST', undefined);
    commit('SET_SHUFFLED_PLAYLIST', []);
    commit('SET_CURRENT_PLAYLIST_META_DATA', []);
    commit('SET_RECENTLY_GENERATED_PLAYLISTS', []);
  },
  fetchPlaylistsFromFB: ({ commit, getters }) => {
    commit('SET_LOADING', true);

    firebase
      .database()
      .ref('/playlists/' + getters.user.id)
      .once('value')
      .then(data => {
        let savedPlaylists = [];
        const obj = data.val();

        for (let key in obj) {
          savedPlaylists.push({
            id: obj[key].id,
            playlistIds: obj[key].playlistIds,
            playlistName: obj[key].playlistName
          });
        }

        if (savedPlaylists) {
          commit('SET_RECENTLY_GENERATED_PLAYLISTS', savedPlaylists);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => commit('SET_LOADING', false));
  },
  savePlaylistToSpotify({ commit, getters }) {
    commit('SET_LOADING', true);
    api
      .savePlaylistToSpotify(
        getters.getAccessToken,
        getters.getCurrentPlaylistMetaData.playlistIds,
        getters.getCurrentPlaylistMetaData.playlistName
      )
      .then(() => {
        commit('SET_LOADING', false);
      })
      .catch(err => {
        console.log(err);
        commit('SET_LOADING', false);
      });
  },
  savePlaylistToFirebaseDB({ commit, getters }) {
    commit('SET_LOADING', true);
    firebase
      .database()
      .ref('/playlists/' + getters.user.id)
      .push(getters.getCurrentPlaylistMetaData)
      .then(data => {
        let currentPlaylistMeta = {
          ...getters.getCurrentPlaylistMetaData,
          fbKey: data.key
        };

        commit('SET_CURRENT_PLAYLIST_META_DATA', currentPlaylistMeta);
        commit('ADD_TO_RECENTLY_GENERATED_PLAYLISTS', currentPlaylistMeta);
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log(err.message);
      })
      .finally(() => {
        commit('SET_LOADING', false);
      });
  },
  updatedPlaylistName: ({ commit, getters }, newPlaylistName) => {
    commit('UPDATE_PLAYLIST_NAME', newPlaylistName);

    let id = getters.getCurrentPlaylistMetaData.id;
    commit('UPDATE_RECENTLY_GENERATED_PLAYLIST_MEMBER_NAME', {
      newPlaylistName,
      id
    });

    if (getters.user) {
      // update on firebase as well
      commit('SET_LOADING', true);

      const fbKey = getters.getCurrentPlaylistMetaData.fbKey;
      const location =
        '/playlists/' + getters.user.id + '/' + fbKey + '/playlistName/';

      let fbUpdates = {};
      fbUpdates[location] = newPlaylistName;

      firebase
        .database()
        .ref()
        .update(fbUpdates)
        .then(() => {
          commit('SET_LOADING', false);
        })
        .catch(err => console.log(err))
        .finally(() => commit('SET_LOADING', false));
    }
  },
  setCurrentTrack: (context, payload) => {
    context.commit('SET_CURRENT_TRACK', payload.currentTrack);
    context.commit('SET_ARTWORK', payload.currentArtwork);
    context.dispatch('setCurrentTrackIndex', payload.currentTrackIndex);
  },
  setAudioElement: (context, payload) => {
    context.commit('SET_AUDIO_ELEMENT', payload);
  },
  setMouseDown: (context, payload) => {
    context.commit('SET_MOUSE_DOWN', payload);
  },
  async playPauseSong(context, payload) {
    if (payload.playSong) {
      // play button was clicked
      if (context.getters.getCurrentTrack) {
        // takes care of case when user clicks play button before song is loaded from server
        context.commit('SET_PLAYING', payload.playing);
        try {
          await context.state.audioElement.play();
        } catch (err) {
          // eslint-disable-next-line
          console.log(err.message);
        }
      }
    } else {
      // pause button was clicked
      context.commit('SET_PLAYING', payload.playing);
      try {
        await context.state.audioElement.pause();
      } catch (err) {
        // eslint-disable-next-line
        console.log(err.message);
      }
    }
  },
  repeatSong: (context, payload) => {
    context.commit('SET_REPEAT', payload);
  },
  muteSong: (context, payload) => {
    context.commit('SET_MUTE', payload);
  },
  setSuffle: (context, payload) => {
    if (!payload.loadingNewPlaylist) {
      context.commit('SET_SHUFFLE', payload.shuffle);
    }

    if (payload.shuffle) {
      context.commit(
        'SET_SHUFFLED_PLAYLIST',
        context.getters.getCurrentPlaylist.slice()
      );

      const currentTrackIndex = context.getters.getShuffledPlaylist.indexOf(
        context.getters.getCurrentTrack
      );

      context.dispatch(
        'setCurrentTrackIndex',
        currentTrackIndex >= 0 ? currentTrackIndex : 0
      );
    } else {
      context.dispatch(
        'setCurrentTrackIndex',
        context.getters.getCurrentPlaylist.indexOf(
          context.getters.getCurrentTrack
        )
      );
    }
  },
  setAutoPlay: (context, payload) => {
    context.commit('SET_AUTO_PLAY', payload);
  },
  setAudioElementCurrentTime: (context, payload) => {
    context.commit('SET_AUDIO_ELEMENT_CURRENT_TIME', payload);
  },
  setCurrentTrackIndex: (context, payload) => {
    context.commit('SET_CURRENT_TRACK_INDEX', payload);
  },
  setCurrentTime: (context, payload) => {
    context.commit('SET_CURRENT_TIME', payload);
  },
  setDuration: (context, payload) => {
    context.commit('SET_DURATION', payload);
  },
  setRemainingTime: (context, payload) => {
    context.commit('SET_REMAINING_TIME', payload);
  },
  setProgress: (context, payload) => {
    context.commit('SET_PROGRESS', payload);
  },
  setVolume: (context, payload) => {
    context.commit('SET_VOLUME', payload);
  },
  setAudioElementVolumePercentage: (context, payload) => {
    context.commit('SET_AUDIO_ELEMENT_VOLUME_PERCENTAGE', payload);
  },
  setNextTrack(context) {
    const playlistSize = context.getters.getCurrentPlaylist.length - 1;

    if (context.getters.isRepeat) {
      context.dispatch('setAudioElementCurrentTime', 0);
      context.dispatch('playPauseSong', {
        playing: false,
        playSong: true
      });
      return;
    } else if (context.getters.getCurrentTrackIndex == playlistSize) {
      // go back to start
      context.dispatch('setCurrentTrackIndex', 0);
    } else {
      let curIndex = context.getters.getCurrentTrackIndex;
      context.dispatch('setCurrentTrackIndex', (curIndex += 1));
    }

    const nextTrack = context.getters.isShuffle
      ? context.getters.getShuffledPlaylist[
          context.getters.getCurrentTrackIndex
        ]
      : context.getters.getCurrentPlaylist[
          context.getters.getCurrentTrackIndex
        ];

    // pause the song first
    context.dispatch('playPauseSong', {
      playing: true,
      playSong: false
    });

    context.dispatch('setAutoPlay', true);

    context.dispatch('setCurrentTrack', {
      currentTrack: nextTrack,
      currentArtwork: nextTrack.album.images[0].url,
      currentTrackIndex: context.getters.getCurrentTrackIndex
    });
  },
  setPrevTrack(context) {
    if (
      context.getters.getCurrentTrackIndex == 0 ||
      context.getters.getAudioElement.currentTime >= 2
    ) {
      context.dispatch('setAudioElementCurrentTime', 0);
    } else {
      let currIndex = context.getters.getCurrentTrackIndex;
      context.dispatch('setCurrentTrackIndex', (currIndex -= 1));

      const nextTrack =
        context.getters.getCurrentPlaylist[
          context.getters.getCurrentTrackIndex
        ];

      context.dispatch('playPauseSong', {
        playing: true,
        playSong: false
      });

      context.dispatch('setAutoPlay', true);
      context.dispatch('setCurrentTrack', {
        currentTrack: nextTrack,
        currentArtwork: nextTrack.album.images[0].url,
        currentTrackIndex: context.getters.getCurrentTrackIndex
      });
    }
  }
};

export default actions;
